#!/usr/bin/env python3
"""Fail if raw hex colour literals leak into site markup/CSS instead of design tokens.

Scans site/**/*.html and site/assets/*.css (excluding tokens.css). A line is
allowed if it carries the comment `/* check-tokens: allow */` (same line).
Exit 1 and print file:line:hex for every unallowlisted finding.
"""
import glob, os, re, sys

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HEX_RE = re.compile(r'#[0-9a-fA-F]{3,8}\b')
ALLOW = '/* check-tokens: allow */'

def targets():
    files = glob.glob(os.path.join(root, 'site', '**', '*.html'), recursive=True)
    for css in glob.glob(os.path.join(root, 'site', 'assets', '*.css')):
        if os.path.basename(css) == 'tokens.css':
            continue
        files.append(css)
    return files

def main():
    findings = []
    for path in targets():
        rel = os.path.relpath(path, root)
        with open(path, encoding='utf-8') as f:
            for i, line in enumerate(f, 1):
                if ALLOW in line:
                    continue
                for m in HEX_RE.finditer(line):
                    findings.append((rel, i, m.group(0)))
    if findings:
        for rel, i, hexv in findings:
            print('%s:%d:%s' % (rel, i, hexv))
        print('\n%d hex literal(s) found outside tokens.css. Use var(--token) or allowlist with %s' % (len(findings), ALLOW))
        return 1
    print('check-tokens: no stray hex literals found.')
    return 0

if __name__ == '__main__':
    sys.exit(main())
