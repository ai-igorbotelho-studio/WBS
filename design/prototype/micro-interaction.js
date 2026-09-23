document.documentElement.classList.add('js');
(function(){
  var rm=document.getElementById('rmToggle');
  if(rm)rm.addEventListener('change',function(){
    document.documentElement.classList.toggle('emu-reduced',rm.checked);
  });
  document.querySelectorAll('#protoFaq .q-btn').forEach(function(btn){
    btn.addEventListener('click',function(){
      var open=btn.getAttribute('aria-expanded')==='true';
      btn.setAttribute('aria-expanded',String(!open));
      document.getElementById(btn.getAttribute('aria-controls')).setAttribute('data-open',String(!open));
    });
  });
  var form=document.getElementById('proto-quote'),status=document.getElementById('proto-status');
  if(form)form.addEventListener('submit',function(ev){
    ev.preventDefault();
    var btn=document.getElementById('proto-submit'),label=btn.textContent;
    btn.setAttribute('data-state','loading');
    btn.setAttribute('aria-busy','true');
    status.textContent='';
    setTimeout(function(){
      btn.setAttribute('data-state','success');
      btn.removeAttribute('aria-busy');
      status.setAttribute('data-ok','true');
      status.textContent='Thanks, request received.';
      setTimeout(function(){btn.removeAttribute('data-state');btn.textContent=label;},2200);
    },700);
  });
})();
