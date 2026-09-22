/* WBS micro-interactions (vanilla, <=4KB). Progressive enhancement only:
   degrades to plain HTML/CSS if this fails to load (html.js gate on the
   CSS side keeps all content visible either way). */
(function(){
  'use strict';
  document.documentElement.classList.add('js');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var css=getComputedStyle(document.documentElement);
  var DUR=(css.getPropertyValue('--dur-base')||'220ms').trim()||'220ms';
  var EASE=(css.getPropertyValue('--ease-standard')||'cubic-bezier(0.4,0,0.2,1)').trim();

  /* Service cards: hover/focus already expand via CSS (:hover,
     :focus-within). This adds the touch/click toggle and keeps
     aria-expanded in sync, since CSS alone cannot announce state. */
  function initCards(){
    document.querySelectorAll('.card').forEach(function(card,i){
      var list=card.querySelector('ul');
      if(!list)return;
      if(!list.id)list.id='wbs-card-list-'+i;
      card.setAttribute('tabindex','0');
      card.setAttribute('aria-expanded','false');
      card.setAttribute('aria-controls',list.id);
      card.setAttribute('data-toggle','true');
      function open(){return card.getAttribute('aria-expanded')==='true';}
      function set(v){card.setAttribute('aria-expanded',String(v));}
      card.addEventListener('click',function(e){
        if(e.target.closest('a,button'))return;
        set(!open());
      });
      card.addEventListener('keydown',function(e){
        if(e.key==='Enter'||e.key===' '||e.key==='Spacebar'){
          e.preventDefault();set(!open());
        }
      });
    });
  }

  /* FAQ: animate open/close height only when motion is allowed. Under
     reduced motion we attach nothing, so <details> keeps its native,
     instant, fully accessible toggle. */
  function initFaq(){
    if(reduce)return;
    document.querySelectorAll('.faq details').forEach(function(d){
      var summary=d.querySelector('summary'),content=d.querySelector('p');
      if(!summary||!content)return;
      content.style.overflow='hidden';
      summary.addEventListener('click',function(e){
        e.preventDefault();
        var h,opening=!d.open;
        if(opening){
          d.open=true;h=content.scrollHeight;content.style.maxHeight='0px';
        }else{
          h=content.scrollHeight;content.style.maxHeight=h+'px';
        }
        requestAnimationFrame(function(){
          content.style.transition='max-height '+DUR+' '+EASE;
          content.style.maxHeight=opening?h+'px':'0px';
        });
        content.addEventListener('transitionend',function done(){
          if(!opening)d.open=false;
          content.style.maxHeight='';content.style.transition='';
          content.removeEventListener('transitionend',done);
        });
      });
    });
  }

  /* Quote form: sending/success state on the submit button. Runs after
     any validation listener already on #quote (script order), so it is
     skipped when that listener already called preventDefault. */
  function initForm(){
    var form=document.getElementById('quote');
    if(!form)return;
    form.addEventListener('submit',function(ev){
      if(ev.defaultPrevented)return;
      var btn=form.querySelector('button[type="submit"]');
      if(!btn)return;
      var label=btn.textContent;
      btn.setAttribute('aria-busy','true');
      btn.textContent='Sending…';
      window.setTimeout(function(){
        btn.removeAttribute('aria-busy');
        btn.classList.add('is-success');
        btn.textContent='Sent';
        window.setTimeout(function(){
          btn.classList.remove('is-success');btn.textContent=label;
        },2200);
      },700);
    });
  }

  initCards();initFaq();initForm();
})();
