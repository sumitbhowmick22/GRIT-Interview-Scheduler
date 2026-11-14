// Student screens: home status card, book a slot, badges, and the exact student messages.
/* ---------- student screens ---------- */
function msgFor(vm,now){
  const q=vm.note?'“'+esc(vm.note)+'”':'';
  switch(vm.status){
    case 'booked':{
      const cut=new Date(vm.start.getTime()-12*H);
      return "You're booked. Your Backend Track interview is on "+when(vm.start)+" with "+vm.iv+". Join from this page 5 minutes early with your camera on. "+
        (now<cut?"You can change or cancel until "+dayLbl(cut)+", "+timeLbl(cut)+".":"It's too late to change this booking. If you can't make it, contact the GRIT team.");}
    case 'passed':return "You passed the Backend Track interview. Your Backend Track Badge is now on your profile. "+vm.iv+" recorded your result on "+dayLbl(vm.date)+". The badge stays valid unless malpractice is found later.";
    case 'retake':return "Not cleared yet. "+vm.iv+" asked you to retake the Backend Track interview. Feedback: "+q+" You can book again from "+dayLbl(vm.nextAfter)+". Your cleared skills stay cleared.";
    case 'fail':return "You didn't clear the Backend Track interview this time. Feedback from "+vm.iv+": "+q+" You can book again from "+dayLbl(vm.nextAfter)+" (attempt "+vm.attempt+" of 3). Your cleared skills stay cleared.";
    case 'revoked':return "Your Backend Track Badge was removed. Malpractice was flagged on a skill you cleared, and the GRIT team has reviewed it. If you think this is a mistake, write to the GRIT team within 7 days.";
    default:{
      let t="You've cleared all 5 skills for the Backend Track. Book a 60-minute interview to earn the badge.";
      if(vm.flash==='no_show')t="You missed your last interview, so it counted as an attempt. Book a new slot when you're ready.";
      if(vm.flash==='interviewer')t="Your interviewer had to cancel your interview. This did not count as an attempt. Please pick a new slot.";
      return t;}
  }
}
function statusCard(vm,ctx){
  const m=msgFor(vm,ctx.now);
  const tone={passed:'ok',retake:'warn',fail:'bad',revoked:'bad'}[vm.status]||'';
  const label={eligible:pill('p-acc','Ready to book'),booked:pill('p-acc','Interview booked'),passed:pill('p-ok','Badge earned'),retake:pill('p-warn','Retake later'),fail:pill('p-bad','Not cleared'),revoked:pill('p-bad','Badge removed')}[vm.status];
  let extra='',acts='';
  if(vm.status==='booked'){
    const cut=new Date(vm.start.getTime()-12*H),open=ctx.now<cut;
    const joinOk=ctx.now>=new Date(vm.start.getTime()-10*60000)&&ctx.now<new Date(vm.start.getTime()+H);
    extra='<dl class="kv"><dt>When</dt><dd>'+dayLbl(vm.start)+' · '+timeLbl(vm.start)+' IST</dd><dt>Interviewer</dt><dd>'+vm.iv+'</dd><dt>Format</dt><dd>60-minute video call</dd></dl>';
    acts=btn(joinOk?'Join call':'Join opens 10 min before','join',null,'',!joinOk)+btn('Change slot','change',vm.id,'sec',!open)+btn('Cancel','cancel',vm.id,'danger',!open);
  }else if(vm.status==='retake'||vm.status==='fail'){
    const ok=ctx.now>=vm.nextAfter;
    acts=btn(ok?'Book again':'Available '+dayLbl(vm.nextAfter),'goBook',null,'',!ok);
  }else if(vm.status==='eligible'){
    acts=btn('Book a slot','goBook');
  }
  return '<section class="card '+tone+'"><div class="card-h"><h3>Backend Track interview</h3>'+label+'</div><p class="msg">'+m+'</p>'+extra+(acts?'<div class="row">'+acts+'</div>':'')+'</section>';
}
const frontendCard='<section class="card"><div class="card-h"><h3>Frontend Track</h3>'+pill('p-mute','Locked')+'</div><p class="muted">2 of 4 skills cleared. Clear 2 more to unlock the interview.</p><div class="bar"><i style="width:50%"></i></div></section>';
function homeHTML(vm,ctx){
  const n=vm.status==='passed'?1:0;
  return '<div class="ph-head"><div><div class="muted sm">Welcome back</div><h2>Aarav Menon</h2></div><div class="count">'+n+'/2<span>badges earned</span></div></div>'+statusCard(vm,ctx)+frontendCard;
}
function badgesHTML(vm,ctx){
  const line={eligible:'Interview not booked yet',booked:'Interview on '+(vm.start?dayLbl(vm.start)+', '+timeLbl(vm.start):''),passed:'Earned on '+(vm.date?dayLbl(vm.date):''),
    retake:'Not earned yet · retake from '+(vm.nextAfter?dayLbl(vm.nextAfter):''),fail:'Not earned yet · book again from '+(vm.nextAfter?dayLbl(vm.nextAfter):''),revoked:'Removed after a malpractice flag'}[vm.status];
  const pl={eligible:pill('p-acc','Ready to book'),booked:pill('p-acc','Booked'),passed:pill('p-ok','Earned'),retake:pill('p-warn','Retake later'),fail:pill('p-bad','Not cleared'),revoked:pill('p-bad','Removed')}[vm.status];
  const earned=vm.status==='passed';
  return '<div class="ph-head"><div><div class="muted sm">Your profile</div><h2>Badges</h2></div><div class="count">'+(earned?1:0)+'/2<span>earned</span></div></div>'+
   '<section class="card"><div class="badge-row"><div class="hex '+(earned?'earned':'')+'">'+(vm.status==='revoked'?'×':'B')+'</div><div><h3>Backend Track</h3><div class="muted sm">5 of 5 skills cleared</div><div class="muted sm">'+line+'</div></div></div><div>'+pl+'</div></section>'+
   '<section class="card"><div class="badge-row"><div class="hex">F</div><div><h3>Frontend Track</h3><div class="muted sm">2 of 4 skills cleared</div><div class="muted sm">Locked until all skills are cleared</div></div></div><div>'+pill('p-mute','Locked')+'</div></section>';
}
function bookHTML(vm,ctx){
  let body;
  if(!canBook(vm,ctx.now)){
    const why={booked:'You already have an interview booked. Change or cancel it from Home.',passed:'You have already earned this badge.',revoked:'This badge was removed. Contact the GRIT team to continue.',
      retake:'You can book again from '+(vm.nextAfter?dayLbl(vm.nextAfter):'')+'.',fail:'You can book again from '+(vm.nextAfter?dayLbl(vm.nextAfter):'')+'.'}[vm.status];
    body='<section class="card"><p class="msg">'+why+'</p></section>';
  }else{
    const open=S.slots.filter(s=>s.state==='open'&&s.start-ctx.now>=24*H);
    const days=[...new Set(open.map(s=>s.day))];
    body=(days.length?days.map(d=>'<div class="day"><h3>'+dayLbl(T(d+'T00:00'))+'</h3><div class="chips">'+
      open.filter(s=>s.day===d).sort((x,y)=>x.start-y.start||0).map(s=>'<button class="chip '+(S.sel===s.id?'sel':'')+'" data-act="pick" data-id="'+s.id+'">'+timeLbl(s.start)+'<small>'+IV[s.iv]+'</small></button>').join('')+'</div></div>').join('')
      :'<section class="card"><p class="msg">No slots are open right now. Check back soon, the interview team adds times every week.</p></section>');
    const sl=S.slots.find(s=>s.id===S.sel);
    if(sl)body+='<section class="card"><div class="muted sm">Selected</div><b>'+when(sl.start)+' with '+IV[sl.iv]+'</b>'+btn('Confirm booking','confirm')+'</section>';
  }
  return '<div class="ph-head"><div><div class="muted sm">Backend Track · attempt '+vm.attempt+'</div><h2>Book a slot</h2></div></div><p class="muted sm">60-minute interviews. Slots open at least 24 hours ahead. Times in IST.</p>'+body;
}
function studentView(){
  const vm=vmFor(ME),ctx={now:S.now};
  const body=S.stab==='book'?bookHTML(vm,ctx):S.stab==='badges'?badgesHTML(vm,ctx):homeHTML(vm,ctx);
  const tb=[['home','Home'],['book','Book a slot'],['badges','Badges']].map(x=>'<button data-act="stab" data-id="'+x[0]+'" aria-selected="'+(S.stab===x[0])+'">'+x[1]+'</button>').join('');
  return '<div class="phone">'+body+'<nav class="tb">'+tb+'</nav></div>';
}
