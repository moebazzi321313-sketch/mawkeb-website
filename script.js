(()=>{
 'use strict';
 const header=document.getElementById('site-header');
 const menu=document.getElementById('menu-toggle');
 const nav=document.getElementById('site-navigation');
 const refreshHeader=()=>header?.classList.toggle('is-scrolled',window.scrollY>24);
 refreshHeader();
 window.addEventListener('scroll',refreshHeader,{passive:true});
 const closeMenu=()=>{nav?.classList.remove('open');header?.classList.remove('menu-open');menu?.setAttribute('aria-expanded','false');menu?.setAttribute('aria-label','Open navigation');};
 menu?.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')!=='true';nav.classList.toggle('open',expanded);header.classList.toggle('menu-open',expanded);menu.setAttribute('aria-expanded',String(expanded));menu.setAttribute('aria-label',expanded?'Close navigation':'Open navigation');});
 document.querySelectorAll('.dropdown-toggle').forEach(button=>{
  button.addEventListener('click',()=>{const container=button.closest('.nav-dropdown');const opened=container.classList.toggle('open');button.setAttribute('aria-expanded',String(opened));});
 });
 document.addEventListener('click',event=>{
  if(!event.target.closest('.nav-dropdown'))document.querySelectorAll('.nav-dropdown.open').forEach(d=>{d.classList.remove('open');d.querySelector('button')?.setAttribute('aria-expanded','false')});
  if(!event.target.closest('.site-header'))closeMenu();
 });
 document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeMenu();document.querySelectorAll('.nav-dropdown.open').forEach(d=>{d.classList.remove('open');d.querySelector('button')?.setAttribute('aria-expanded','false')});}});
 document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Intl.DateTimeFormat('en-US',{timeZone:'America/Detroit',year:'numeric'}).format(new Date()));
 const params=new URLSearchParams(location.search);
 const topic=params.get('topic');
 const topicSelect=document.querySelector('#contact-topic');
 if(topicSelect&&['fatimiyya','activities','lessons','ashura','volunteer','donate','partner'].includes(topic))topicSelect.value=topic;
 const contactForm=document.querySelector('#contact-form');
 contactForm?.addEventListener('submit',event=>{
  event.preventDefault();if(!contactForm.reportValidity())return;
  const name=contactForm.elements.name.value.trim();
  const email=contactForm.elements.email.value.trim();
  const topic=contactForm.elements.topic.value;
  const message=contactForm.elements.message.value.trim();
  const subject=encodeURIComponent('Themawkeb website inquiry: '+topic);
  const body=encodeURIComponent(`Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`);
  window.location.href=`mailto:?subject=${subject}&body=${body}`;
 });
 const newsletter=document.getElementById('newsletter-form');
 newsletter?.addEventListener('submit',event=>{
  event.preventDefault();if(!newsletter.reportValidity())return;
  const email=newsletter.querySelector('input').value.trim();
  window.location.href=`mailto:?subject=${encodeURIComponent('Themawkeb newsletter signup request')}&body=${encodeURIComponent('Please add '+email+' to the newsletter if available. I understand this is a request, not a confirmed subscription.')}`;
 });
 // Confirmed future events are always displayed in Detroit time.
 const eventFormatter=new Intl.DateTimeFormat('en-US',{timeZone:'America/Detroit',month:'long',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'});
 document.querySelectorAll('time[data-event-time][datetime]').forEach(el=>{
  const timestamp=el.getAttribute('datetime');
  if(!/(Z|[+-]\\d{2}:\\d{2})$/i.test(timestamp))return;
  const date=new Date(timestamp);
  if(!Number.isNaN(date.getTime()))el.textContent=eventFormatter.format(date);
 });
})();
