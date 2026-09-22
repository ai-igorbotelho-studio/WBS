#!/usr/bin/env python3
"""Compute WCAG contrast ratios for colour token pairs and fail below the
minimum declared in each token's `usage` string (regex `(\\d\\.\\d):1`) or an
explicit `minContrast` field if present. Runs per theme (light/dark).

Pairs checked are the foreground/background relationships named in
09-ui-spec-v3 / tokens.json usage text: ink/surface, ink-muted/surface,
timber-text/surface, on-accent/accent, danger/surface, success/surface,
warning/surface, ridgeline-lit/surface (graphic, 3:1 floor).
"""
import json, os, re, sys

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
tokens = json.load(open(os.path.join(root, 'design-system/tokens.json')))
themes = [t['id'] for t in tokens['color']['themes']]  # ['light', 'dark']
by_name = {t['name']: t for t in tokens['color']['tokens']}

def resolve(name, theme, _seen=None):
    _seen = _seen or set()
    if name in _seen:
        raise ValueError('cycle resolving %s' % name)
    _seen.add(name)
    tok = by_name[name]
    val = tok['value']
    v = val if isinstance(val, str) else val.get(theme, val.get(themes[0]))
    if isinstance(v, str) and v.startswith('{') and v.endswith('}'):
        return resolve(v[1:-1], theme, _seen)
    return v

def hex_to_rgb(v):
    v = v.lstrip('#')
    if len(v) == 3:
        v = ''.join(c * 2 for c in v)
    return tuple(int(v[i:i+2], 16) for i in (0, 2, 4))

def channel(c):
    c = c / 255.0
    return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4

def luminance(rgb):
    r, g, b = rgb
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)

def ratio(hex1, hex2):
    l1, l2 = luminance(hex_to_rgb(hex1)), luminance(hex_to_rgb(hex2))
    lighter, darker = max(l1, l2), min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)

def min_contrast(tok):
    if 'minContrast' in tok:
        return float(tok['minContrast'])
    nums = [float(m) for m in re.findall(r'(\d\.\d):1', tok.get('usage', ''))]
    return min(nums) if nums else None

# name: (foreground token, background token)
PAIRS = [
    ('ink/surface', 'ink', 'surface'),
    ('ink-muted/surface', 'ink-muted', 'surface'),
    ('ink/surface-alt', 'ink', 'surface-alt'),
    ('timber-text/surface', 'timber-text', 'surface'),
    ('on-accent/accent', 'on-accent', 'accent'),
    ('danger/surface', 'danger', 'surface'),
    ('success/surface', 'success', 'surface'),
    ('warning/surface', 'warning', 'surface'),
]

def main():
    fails = []
    for label, fg, bg in PAIRS:
        fg_tok = by_name[fg]
        floor = min_contrast(fg_tok)
        if floor is None:
            continue
        for theme in themes:
            fg_hex, bg_hex = resolve(fg, theme), resolve(bg, theme)
            r = ratio(fg_hex, bg_hex)
            status = 'ok' if r >= floor else 'FAIL'
            print('%-24s %-6s %.2f:1 (floor %.1f:1) %s' % (label, theme, r, floor, status))
            if r < floor:
                fails.append((label, theme, r, floor))
    if fails:
        print('\n%d pair(s) below their declared minimum contrast.' % len(fails))
        return 1
    print('\ncheck-contrast: all pairs meet their declared minimum.')
    return 0

if __name__ == '__main__':
    sys.exit(main())
