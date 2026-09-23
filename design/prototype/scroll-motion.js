/*! WBS scroll-motion.js — IO only, no per-frame scroll/rAF loop. */
document.documentElement.classList.add('js');
(function(){
'use strict';
var doc=document.documentElement,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,hasIO='IntersectionObserver' in window;
var emu=document.getElementById('emu-reduced');
if(emu)emu.onchange=function(){doc.classList.toggle('emulate-reduced',emu.checked);};
if(!hasIO)return;
var edge='0px 0px -20% 0px';

/* scroll-spy + header shrink share the hero as the compact-state trigger */
var pairs=[],header=document.getElementById('siteHeader'),hero=document.getElementById('top');
document.querySelectorAll('#navlinks a').forEach(function(a){var t=document.querySelector(a.getAttribute('href'));if(t)pairs.push([t,a]);});
if(pairs.length){var spy=new IntersectionObserver(function(es){es.forEach(function(e){
  if(!e.isIntersecting)return;
  pairs.forEach(function(p){p[1].removeAttribute('aria-current');});
  pairs.forEach(function(p){if(p[0]===e.target)p[1].setAttribute('aria-current','true');});
});},{rootMargin:'-30% 0px -50% 0px'});pairs.forEach(function(p){spy.observe(p[0]);});}
if(header&&hero)new IntersectionObserver(function(es){es.forEach(function(e){header.setAttribute('data-shrunk',String(!e.isIntersecting));});}).observe(hero);

/* ridgeline cumulative lit ticks + hero photo crossfade tied to the first divider */
var ridge=document.querySelector('.ridge'),dividers=Array.prototype.slice.call(document.querySelectorAll('.ridgeline'));
if(!reduce&&dividers.length){
  var lit=dividers.map(function(){return false;});
  var rio=new IntersectionObserver(function(es){es.forEach(function(e){
    var i=dividers.indexOf(e.target);if(i<0)return;
    if(e.boundingClientRect.top<innerHeight)lit[i]=true;
    if(i===0&&ridge)ridge.classList.add('photo-color');
    dividers.forEach(function(svg){svg.querySelectorAll('.tick').forEach(function(t){t.classList.toggle('ridgeline-lit',!!lit[+t.getAttribute('data-i')||0]);});});
  });},{rootMargin:edge});
  dividers.forEach(function(d){rio.observe(d);});
}else if(ridge)ridge.classList.add('photo-color');

/* process rail fill from scroll position */
var stepList=Array.prototype.slice.call(document.querySelectorAll('.steps .step')),rail=document.querySelector('.rail__fill');
if(stepList.length&&rail){
  var max=-1;
  var railIO=new IntersectionObserver(function(es){es.forEach(function(e){
    if(!e.isIntersecting)return;
    var i=stepList.indexOf(e.target);
    if(i>max){max=i;rail.style.setProperty('--fill',String((max+1)/stepList.length));}
  });},{threshold:.4});
  stepList.forEach(function(el){railIO.observe(el);});
}

/* opacity-only reveal */
var reveals=document.querySelectorAll('.reveal2');
if(reduce)reveals.forEach(function(el){el.classList.add('in');});
else{
  var reveal=new IntersectionObserver(function(es){es.forEach(function(e){
    if(!e.isIntersecting)return;
    e.target.style.setProperty('--i',e.target.getAttribute('data-stagger')||0);
    e.target.classList.add('in');
    reveal.unobserve(e.target);
  });},{threshold:.15,rootMargin:'0px 0px -10% 0px'});
  reveals.forEach(function(el){reveal.observe(el);});
}

/* FLIP gallery filter, animated or instant via toggle */
var chips=document.querySelectorAll('.filters .chip'),gallery=document.querySelector('.gallery'),mode=document.getElementById('flip-mode');
if(chips.length&&gallery){
  var tiles=Array.prototype.slice.call(gallery.querySelectorAll('.tile'));
  chips.forEach(function(chip){chip.onclick=function(){
    chips.forEach(function(c){c.setAttribute('aria-pressed','false');});
    chip.setAttribute('aria-pressed','true');
    var cat=chip.getAttribute('data-filter'),skip=reduce||(mode&&mode.checked);
    var first=skip?null:tiles.map(function(t){return t.getBoundingClientRect();});
    tiles.forEach(function(t){var m=cat==='All'||t.getAttribute('data-cat')===cat;t.classList.toggle('is-hidden',!m);t.toggleAttribute('inert',!m);});
    if(skip)return;
    requestAnimationFrame(function(){tiles.forEach(function(t,i){
      if(t.classList.contains('is-hidden'))return;
      var last=t.getBoundingClientRect(),dx=first[i].left-last.left,dy=first[i].top-last.top;
      if(dx||dy){t.style.transition='none';t.style.transform='translate('+dx+'px,'+dy+'px)';
        requestAnimationFrame(function(){t.style.transition='';t.style.transform='';});}
    });});
  };});
}
})();
