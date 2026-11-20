"""Pre-render the Abna Al-Batoul contour map to assets/media/years-map.webp.

Same seeded terrain as the old in-browser version (assets/site/trail.js: Park-Miller seed 1445,
five octaves, land rising toward the upper right, 70 contour levels), drawn once here so the
homepage never computes it. Build-time only:  python tools/map/render_terrain.py
Needs numpy and opencv-python.

World coordinates (shared with assets/site/years.js and the SVG route):
  x from -700 to 2300, y from -500 to 1341.7  (the old map's extent)
"""
import os
import numpy as np
import cv2

W, H = 1600, 1000
PAD_X, PAD_Y = 700, 500
NX0, NY0 = 260, 160                     # the old sampling grid, kept for identical octave sizes
EW = W + 2 * PAD_X                      # 3000 world units wide
EH = (NY0 - 1) * EW / (NX0 - 1)         # 1841.7 world units tall (the old map's real extent)
SCALE = 0.8                             # output pixels per world unit
FINE = 2                                # contour grid is half the output resolution, then scaled up

OUT = os.path.join(os.path.dirname(__file__), '..', '..', 'assets', 'media', 'years-map.webp')


def rng(seed):
    s = seed
    while True:
        s = (s * 16807) % 2147483647
        yield (s - 1) / 2147483646


def octaves():
    r = rng(1445)
    out = []
    for o in range(5):
        gx = 4 * 2 ** o + 1
        gy = round(gx * NY0 / NX0) + 1
        g = np.array([next(r) for _ in range(gx * gy)]).reshape(gy, gx)
        out.append((gx, gy, g, 0.52 ** o))
    return out


def field(nx, ny):
    u = np.linspace(0, 1, nx)[None, :]
    w = np.linspace(0, 1, ny)[:, None]
    s = np.zeros((ny, nx))
    sm = lambda t: t * t * (3 - 2 * t)
    for gx, gy, g, amp in octaves():
        fx, fy = u * (gx - 1), w * (gy - 1)
        ix = np.minimum(gx - 2, np.floor(fx)).astype(int)
        iy = np.minimum(gy - 2, np.floor(fy)).astype(int)
        tx, ty = sm(fx - ix), sm(fy - iy)
        ix, iy = np.broadcast_to(ix, s.shape), np.broadcast_to(iy, s.shape)
        a, b = g[iy, ix], g[iy, ix + 1]
        c, d = g[iy + 1, ix], g[iy + 1, ix + 1]
        s += amp * (a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty)
    px = u * (W + 2 * PAD_X) - PAD_X
    py = w * (H + 2 * PAD_Y) - PAD_Y
    return s * 1.1 + (px / W) * .9 + (1 - py / H) * .9


def hex_rgb(h):
    h = h.lstrip('#')
    return np.array([int(h[i:i + 2], 16) for i in (4, 2, 0)], dtype=np.float32)  # BGR


def main():
    ow, oh = round(EW * SCALE), round(EH * SCALE)
    fw, fh = ow // FINE, oh // FINE
    vals = field(fw, fh)
    lo, hi = vals.min(), vals.max()
    step = (hi - lo) / 70
    levels = np.arange(lo + step, hi, step)

    img = np.empty((oh, ow, 3), np.float32)
    img[:] = hex_rgb('#0d0e08')

    def blend(mask, colour, alpha):
        a = (mask.astype(np.float32) / 255.0 * alpha)[..., None]
        img[:] = img * (1 - a) + colour * a

    # survey grid every 200 world units
    grid = np.zeros((oh, ow), np.uint8)
    for gx in range(-600, W + 700, 200):
        x = round((gx + PAD_X) * SCALE)
        cv2.line(grid, (x, 0), (x, oh), 255, 1, cv2.LINE_AA)
    for gy in range(-400, H + 500, 200):
        y = round((gy + PAD_Y) * SCALE)
        cv2.line(grid, (0, y), (ow, y), 255, 1, cv2.LINE_AA)
    blend(grid, hex_rgb('#ECF2EC'), .06)

    leaf, wash = hex_rgb('#9cc59f'), hex_rgb('#ECF2EC')
    n = len(levels)
    for i, t in enumerate(levels):
        k, idx = i / n, i % 5 == 0
        mask = (vals >= t).astype(np.uint8)
        cs, _ = cv2.findContours(mask, cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE)
        runs = []
        for c in cs:
            p = c[:, 0, :]
            edge = (p[:, 0] == 0) | (p[:, 1] == 0) | (p[:, 0] == fw - 1) | (p[:, 1] == fh - 1)
            # split each contour where it runs along the image border, so the border itself is not drawn
            cur = []
            for q, e in zip(p, edge):
                if e:
                    if len(cur) > 4: runs.append(np.array(cur))
                    cur = []
                else:
                    cur.append(q)
            if len(cur) > 4: runs.append(np.array(cur))
        runs = [(r.astype(np.float32) * FINE * 16).astype(np.int32).reshape(-1, 1, 2) for r in runs]  # 4 bits of subpixel
        layer = np.zeros((oh, ow), np.uint8)
        cv2.polylines(layer, runs, False, 255, 2 if idx else 1, cv2.LINE_AA, shift=4)
        blend(layer, wash if idx else leaf, (.2 + k * .35) if idx else (.1 + k * .22))

    cv2.imwrite(OUT, np.clip(img, 0, 255).astype(np.uint8), [cv2.IMWRITE_WEBP_QUALITY, 82])
    print('wrote', os.path.normpath(OUT), ow, 'x', oh, os.path.getsize(OUT) // 1024, 'KB')


if __name__ == '__main__':
    main()
