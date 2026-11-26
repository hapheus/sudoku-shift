// Adapted from artemnovichkov/hinge (MIT License).
// Runs inside the iOS Simulator via `xcrun simctl spawn` and posts the vendor-defined
// HID event that Xcode Device Hub uses to fold/unfold and rotate iPhone Duo.
//
// Usage:
//   duo-hinge-helper set <degrees> [confirm-seconds]
//   duo-hinge-helper sweep <from> <to> <seconds>
//   duo-hinge-helper orient <portrait|landscape-left|landscape-right|pud>
//   duo-hinge-helper get

#import <Foundation/Foundation.h>

#include <CoreFoundation/CoreFoundation.h>
#include <mach/mach_time.h>
#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

typedef struct __IOHIDEvent *IOHIDEventRef;
typedef struct __IOHIDEventSystemClient *IOHIDEventSystemClientRef;

extern IOHIDEventRef IOHIDEventCreateVendorDefinedEvent(CFAllocatorRef allocator, uint64_t timeStamp,
    uint32_t usagePage, uint32_t usage, uint32_t version, const uint8_t *data, CFIndex length, uint32_t options);
extern IOHIDEventSystemClientRef IOHIDEventSystemClientCreateWithType(CFAllocatorRef allocator, int type,
    CFDictionaryRef properties);
extern void IOHIDEventSystemClientDispatchEvent(IOHIDEventSystemClientRef client, IOHIDEventRef event);
extern CFDataRef IOCFSerialize(CFTypeRef object, CFOptionFlags options);

enum {
    kUsagePage = 0xFF61,
    kUsage = 0x5B,
    kClientTypeSimple = 4,
    kSerializeBinary = 1,
    kSweepHz = 60,
};

static CFStringRef const kProviders[] = {
    CFSTR("com.apple.Virtualization.VirtualMachines"),
    CFSTR("com.apple.Virtualization"),
};
static const CFTimeInterval kAngleTimeout = 2.0;
static const double kAngleTolerance = 1.0;
static const CFTimeInterval kRunLoopSlice = 0.05;
static const useconds_t kSettleMicros = 25000;

@interface CMAngle : NSObject
- (float)angleDegrees;
- (float)mechanicalAngleDegrees;
@end

@interface CMAngleManager : NSObject
+ (BOOL)isAvailable;
- (void)startAngleUpdatesToQueue:(NSOperationQueue *)queue handler:(void (^)(CMAngle *angle))handler;
- (void)stopAngleUpdates;
@end

typedef enum {
    kObserveUnavailable = -1,
    kObserveTimedOut = 0,
    kObserveAccepted = 1,
} ObserveResult;

static void send_payload(IOHIDEventSystemClientRef client, CFStringRef source, CFStringRef type, CFTypeRef value) {
    for (size_t i = 0; i < sizeof(kProviders) / sizeof(kProviders[0]); i++) {
        const void *keys[] = {CFSTR("provider"), CFSTR("source"), CFSTR("type"), CFSTR("value")};
        const void *values[] = {kProviders[i], source, type, value};
        CFDictionaryRef payload = CFDictionaryCreate(NULL, keys, values, 4,
            &kCFTypeDictionaryKeyCallBacks, &kCFTypeDictionaryValueCallBacks);
        CFDataRef data = IOCFSerialize(payload, kSerializeBinary);
        if (data) {
            IOHIDEventRef event = IOHIDEventCreateVendorDefinedEvent(NULL, mach_absolute_time(), kUsagePage, kUsage, 0,
                CFDataGetBytePtr(data), CFDataGetLength(data), 0);
            if (event) {
                IOHIDEventSystemClientDispatchEvent(client, event);
                CFRelease(event);
            }
            CFRelease(data);
        }
        CFRelease(payload);
    }
}

static double clamp_angle(double degrees) {
    if (degrees < 0) return 0;
    if (degrees > 180) return 180;
    return degrees;
}

static void send_angle(IOHIDEventSystemClientRef client, double degrees) {
    degrees = clamp_angle(degrees);
    CFNumberRef value = CFNumberCreate(NULL, kCFNumberDoubleType, &degrees);
    send_payload(client, CFSTR("hinge-slider-control"), CFSTR("range"), value);
    CFRelease(value);
}

static void send_orientation(IOHIDEventSystemClientRef client, const char *orientation) {
    CFStringRef value = CFStringCreateWithCString(NULL, orientation, kCFStringEncodingUTF8);
    send_payload(client, CFSTR("orientation-picker-control"), CFSTR("enum"), value);
    CFRelease(value);
}

static ObserveResult observe_angles(CFTimeInterval timeout, void (^afterStart)(void), bool (^accept)(CMAngle *angle)) {
    Class managerClass = NSClassFromString(@"CMAngleManager");
    if (!managerClass || ![managerClass isAvailable]) {
        fprintf(stderr, "duo-hinge-helper: this simulator reports no hinge\n");
        return kObserveUnavailable;
    }

    id manager = [[managerClass alloc] init];
    __block bool accepted = false;
    [manager startAngleUpdatesToQueue:[NSOperationQueue new] handler:^(CMAngle *angle) {
        if (!accepted && accept(angle)) accepted = true;
    }];
    if (afterStart) afterStart();

    CFAbsoluteTime deadline = CFAbsoluteTimeGetCurrent() + timeout;
    while (!accepted && CFAbsoluteTimeGetCurrent() < deadline) {
        CFRunLoopRunInMode(kCFRunLoopDefaultMode, kRunLoopSlice, false);
    }
    [manager stopAngleUpdates];
    return accepted ? kObserveAccepted : kObserveTimedOut;
}

static double commanded_degrees(CMAngle *angle) {
    if ([angle respondsToSelector:@selector(mechanicalAngleDegrees)]) return [angle mechanicalAngleDegrees];
    return [angle angleDegrees];
}

static int print_angle(void) {
    __block double current = 0;
    ObserveResult result = observe_angles(kAngleTimeout, NULL, ^bool(CMAngle *angle) {
        current = [angle angleDegrees];
        return true;
    });
    if (result != kObserveAccepted) return 1;
    printf("%.1f\n", current);
    return 0;
}

static int set_angle_confirmed(IOHIDEventSystemClientRef client, double degrees, CFTimeInterval timeout) {
    double target = clamp_angle(degrees);
    ObserveResult result = observe_angles(timeout, ^{
        send_angle(client, target);
    }, ^bool(CMAngle *angle) {
        return fabs(commanded_degrees(angle) - target) <= kAngleTolerance;
    });
    if (result == kObserveTimedOut) {
        fprintf(stderr, "duo-hinge-helper: hinge did not reach %.1f within %.1fs\n", target, timeout);
    }
    return result == kObserveAccepted ? 0 : 1;
}

int main(int argc, char **argv) {
    if (argc < 2) return 64;
    if (strcmp(argv[1], "get") == 0 && argc == 2) return print_angle();
    if (argc < 3) return 64;

    IOHIDEventSystemClientRef client = IOHIDEventSystemClientCreateWithType(NULL, kClientTypeSimple, NULL);
    if (!client) {
        fprintf(stderr, "duo-hinge-helper: failed to create HID client\n");
        return 1;
    }

    if (strcmp(argv[1], "set") == 0 && argc <= 4) {
        double timeout = argc == 4 ? atof(argv[3]) : 0;
        if (timeout > 0) return set_angle_confirmed(client, atof(argv[2]), timeout);
        send_angle(client, atof(argv[2]));
    } else if (strcmp(argv[1], "orient") == 0 && argc == 3) {
        send_orientation(client, argv[2]);
    } else if (strcmp(argv[1], "sweep") == 0 && argc == 5) {
        double from = atof(argv[2]), to = atof(argv[3]), seconds = fmax(atof(argv[4]), 0.1);
        int steps = (int)fmax(1, round(seconds * kSweepHz));
        for (int i = 0; i <= steps; i++) {
            send_angle(client, from + (to - from) * i / steps);
            if (i < steps) usleep((useconds_t)(seconds * 1e6 / steps));
        }
    } else {
        return 64;
    }

    usleep(kSettleMicros);
    return 0;
}
