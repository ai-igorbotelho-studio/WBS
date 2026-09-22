#!/usr/bin/env python3
"""Generate design-system/tokens.css and site/assets/tokens.css from design-system/tokens.json."""
import json, os
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
t=json.load(open(os.path.join(root,'design-system/tokens.json')))
themes=[th['id'] for th in t['color']['themes']]
def v(tok,th):
    val=tok['value']; s=val if isinstance(val,str) else val.get(th, val.get(themes[0]))
    return 'var(--'+s[1:-1]+')' if isinstance(s,str) and s.startswith('{') else s
out=['/* WBS design tokens. Generated from design-system/tokens.json by tools/build-tokens.py. Do not edit by hand. */']
for f in t['type']['fonts']:
    out.append('@font-face{font-family:"%s";src:url("fonts/%s") format("woff2");font-weight:%s;font-style:%s;font-display:swap}'%(f['family'],f['file'].split('/')[-1],f['weight'],f.get('style','normal')))
for i,th in enumerate(themes):
    sel=':root,[data-theme="%s"]'%th if i==0 else '[data-theme="%s"]'%th
    out.append(sel+'{'+';'.join('--%s:%s'%(k['name'],v(k,th)) for k in t['color']['tokens'])+'}')
rest=[]
for fam in ('spacing','radius','shadow','logo'):
    for k in t.get(fam,{}).get('tokens',[]):
        val=k['value']; rest.append('--%s:%s'%(k['name'],val if isinstance(val,str) else val[themes[0]]))
for key,fam in t['type']['families'].items(): rest.append('--font-%s:%s'%(key,fam))
out.append(':root{'+';'.join(rest)+'}')
for g in t['type']['groups']:
    for s in g['styles']:
        out.append('.%s{font-family:var(--font-%s);font-size:%s;line-height:%s;font-weight:%s;letter-spacing:%s%s}'%(s['name'],g['family'],s['fontSize'],s['lineHeight'],s['fontWeight'],s['letterSpacing'],';text-transform:uppercase' if g['family']=='mono' else ''))
css='\n'.join(out)+'\n'
for p in ('design-system/tokens.css','site/assets/tokens.css'):
    open(os.path.join(root,p),'w').write(css); print('wrote',p)
