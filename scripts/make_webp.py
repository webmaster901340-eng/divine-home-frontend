# Make WebP copies of every site photo for src/utils/img.js.
# public/images/<dir>/<name>.jpg -> public/images/<dir>/w/<name>-{240,480,960,1600}.webp
# Only widths smaller than the source are written; the largest is capped at the source width.
# Run after adding photos:  python scripts/make_webp.py
import os
from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), '..', 'public', 'images')
WIDTHS = [240, 480, 960, 1600]
made = 0
for dirpath, dirs, files in os.walk(ROOT):
    dirs[:] = [d for d in dirs if d != 'w']
    for f in files:
        name, ext = os.path.splitext(f)
        if ext.lower() not in ('.jpg', '.jpeg', '.png'):
            continue
        src = os.path.join(dirpath, f)
        out_dir = os.path.join(dirpath, 'w')
        wide = os.path.basename(dirpath) in ('site', 'hero')
        targets = [(w, os.path.join(out_dir, f'{name}-{w}.webp')) for w in WIDTHS if w < 1600 or wide]
        mtime = os.path.getmtime(src)
        if all(os.path.exists(p) and os.path.getmtime(p) >= mtime for _, p in targets):
            continue
        os.makedirs(out_dir, exist_ok=True)
        im = Image.open(src)
        im = im.convert('RGBA' if im.mode in ('RGBA', 'LA', 'P') and ext.lower() == '.png' else 'RGB')
        for w, p in targets:
            tw = min(w, im.width)
            th = round(im.height * tw / im.width)
            r = im if tw == im.width else im.resize((tw, th), Image.LANCZOS)
            r.save(p, 'WEBP', quality=80 if w >= 960 else 76, method=6)
            made += 1
print('webp written:', made)
