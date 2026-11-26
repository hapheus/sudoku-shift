import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Probes an image with ffprobe and returns { width, height, pixFmt }.
 */
export function probePng(filePath) {
    const raw = execFileSync(
        'ffprobe',
        [
            '-v',
            'error',
            '-select_streams',
            'v:0',
            '-show_entries',
            'stream=width,height,pix_fmt',
            '-of',
            'json',
            filePath,
        ],
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
    );
    const parsed = JSON.parse(raw);
    const stream = parsed.streams?.[0];
    if (!stream) {
        throw new Error(`Could not inspect PNG stream for ${filePath}`);
    }
    return {
        width: Number(stream.width),
        height: Number(stream.height),
        pixFmt: String(stream.pix_fmt),
    };
}

/**
 * Converts a raw PNG into an App Store Connect compliant 24-bit RGB PNG (no alpha channel)
 * at exact target pixel dimensions and verifies the output via ffprobe.
 */
export function exportAppStorePng({
    rawPath,
    outPath,
    expectedWidth,
    expectedHeight,
    allowScale = false,
}) {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    const rawInfo = probePng(rawPath);

    if (!allowScale && (rawInfo.width !== expectedWidth || rawInfo.height !== expectedHeight)) {
        throw new Error(
            `Captured raw PNG dimensions ${rawInfo.width}x${rawInfo.height} do not match expected ${expectedWidth}x${expectedHeight} for ${outPath}`,
        );
    }

    const vf = allowScale
        ? `scale=${expectedWidth}:${expectedHeight}:flags=lanczos,format=rgb24`
        : 'format=rgb24';

    const stagedPath = `${outPath}.tmp.png`;
    try {
        execFileSync(
            'ffmpeg',
            ['-y', '-i', rawPath, '-vf', vf, '-pix_fmt', 'rgb24', '-frames:v', '1', stagedPath],
            { stdio: 'pipe' },
        );
        const verified = probePng(stagedPath);
        if (
            verified.width !== expectedWidth ||
            verified.height !== expectedHeight ||
            verified.pixFmt !== 'rgb24'
        ) {
            throw new Error(
                `Export verification failed for ${outPath}: got ${verified.width}x${verified.height} (${verified.pixFmt}), expected ${expectedWidth}x${expectedHeight} (rgb24)`,
            );
        }
        fs.renameSync(stagedPath, outPath);
        return {
            outPath,
            width: verified.width,
            height: verified.height,
            pixFmt: verified.pixFmt,
            bytes: fs.statSync(outPath).size,
        };
    } finally {
        if (fs.existsSync(stagedPath)) {
            fs.rmSync(stagedPath, { force: true });
        }
    }
}
