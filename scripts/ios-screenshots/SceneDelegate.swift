import UIKit
import WebKit
import Capacitor

private final class ScreenshotBridgeViewController: CAPBridgeViewController {
    var orientationMask: UIInterfaceOrientationMask = .all

    override var supportedInterfaceOrientations: UIInterfaceOrientationMask {
        orientationMask
    }
}

// This delegate is compiled only into the separate screenshot app.
class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?
    private var bridgeController: ScreenshotBridgeViewController?
    private var timer: Timer?
    private var lastRequest: String?
    private var busy = false

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options: UIScene.ConnectionOptions) {
        guard let windowScene = scene as? UIWindowScene else { return }
        let controller = ScreenshotBridgeViewController()
        bridgeController = controller
        window = UIWindow(windowScene: windowScene)
        window?.rootViewController = controller
        window?.makeKeyAndVisible()

        timer = Timer.scheduledTimer(withTimeInterval: 0.25, repeats: true) { [weak self, weak controller] _ in
            Task { @MainActor in
                guard let self, let webView = controller?.webView else { return }
                self.captureIfRequested(in: webView, scene: windowScene)
            }
        }
    }

    func sceneDidDisconnect(_ scene: UIScene) {
        timer?.invalidate()
    }

    private func captureIfRequested(in webView: WKWebView, scene: UIWindowScene) {
        let directory = URL.documentsDirectory
        guard !busy,
            let data = try? Data(contentsOf: directory.appendingPathComponent("screenshot-request.json")),
            let request = try? JSONSerialization.jsonObject(with: data) as? [String: String],
            let id = request["id"], id != lastRequest
        else { return }

        busy = true

        let requestedOrientation = request["orientation"]
        let runPrepare = { [weak self] in
            guard let self else { return }
            webView.callAsyncJavaScript(
                "return window.prepareScreenshot ? await window.prepareScreenshot(request) : null;",
                arguments: ["request": request], in: nil, in: .page
            ) { [weak self] result in
                guard let self else { return }
                self.busy = false
                guard case let .success(value) = result, let outcome = value as? String else { return }
                self.lastRequest = id
                let screen = scene.screen.nativeBounds.size
                let reply: [String: Any] = [
                    "id": id,
                    "outcome": outcome,
                    "width": Int(screen.width),
                    "height": Int(screen.height),
                    "landscape": scene.interfaceOrientation.isLandscape
                ]
                if let payload = try? JSONSerialization.data(withJSONObject: reply) {
                    try? payload.write(to: directory.appendingPathComponent("screenshot-ready.json"), options: .atomic)
                }
            }
        }

        if let requestedOrientation, requestedOrientation == "portrait" || requestedOrientation == "landscape" {
            let wantLandscape = requestedOrientation == "landscape"
            let mask: UIInterfaceOrientationMask = wantLandscape ? .landscapeRight : .portrait
            bridgeController?.orientationMask = mask
            bridgeController?.setNeedsUpdateOfSupportedInterfaceOrientations()
            if scene.interfaceOrientation.isLandscape != wantLandscape {
                scene.requestGeometryUpdate(.iOS(interfaceOrientations: mask)) { _ in }
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.75) {
                    runPrepare()
                }
                return
            }
        }

        runPrepare()
    }
}
