"""Write the Mawkeb site's inner pages and the redirects from the old addresses.
Run from the project folder:  python tools/pages/build.py
The homepage (index.html) is written by hand and is not touched by this script."""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)

import programs, involved, other  # noqa: E402

REDIRECTS = {  # old address -> new address
    'causes.html': '/programs/',
    'impact.html': '/about.html',
    'blog.html': '/social/',
    'donate.html': '/get-involved/donate.html',
    'volunteer.html': '/get-involved/volunteer.html',
    'abna-al-batul.html': '/programs/abna-al-batoul.html',
}
REDIRECT = """<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Moved</title>
<meta http-equiv="refresh" content="0; url={to}"><link rel="canonical" href="{to}"><meta name="robots" content="noindex"></head>
<body><p>This page has moved to <a href="{to}">{to}</a>.</p></body></html>
"""

import re  # noqa: E402

# Content is written with addresses from the site root ("/programs/", "/assets/..."). On output every
# address is made relative to the page, so the site works at a domain's root and inside a folder
# (GitHub Pages serves a project at user.github.io/<repo>/).
ATTR = re.compile(r'((?:href|src|data-full|poster|content|url)=")/(?!/)([^"]*)"')


def relativize(html, rel_path):
    up = '../' * rel_path.count('/')
    return ATTR.sub(lambda m: m.group(1) + ((up + m.group(2)) if (up + m.group(2)) else './') + '"', html)


written = []
for mod in (programs, involved, other):
    for rel, fn in mod.PAGES.items():
        out = os.path.join(ROOT, rel)
        os.makedirs(os.path.dirname(out), exist_ok=True)
        with open(out, 'w', encoding='utf-8', newline='\n') as f:
            f.write(relativize(fn(), rel))
        written.append(rel)
for old, new in REDIRECTS.items():
    with open(os.path.join(ROOT, old), 'w', encoding='utf-8', newline='\n') as f:
        f.write(REDIRECT.format(to=new.lstrip('/') or './'))
    written.append(old + ' (redirect)')
print('\n'.join(written))
print(len(written), 'files written')
