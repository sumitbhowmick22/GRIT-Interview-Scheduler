// Interviewer screens: availability grid and daily schedule with outcome recording.
/* ---------- interviewer screens ---------- */
function availHTML(){
  const rows=DAYS.map(d=>{
    const ss=S.slots.filter(s=>s.iv===S.iv&&s.day===d);
    const chips=ss.map(s=>{
      if(s.state==='booked'){const i=S.interviews.find(x=>x.slot===s.id&&x.status==='booked');const nm=i?S.students.find(z=>z.id===i.sid).name.split(' ')[0]:'';return '<button class="chip bk" disabled title="Booked">'+timeLbl(s.start)+'<small>'+nm+'</small></button>';}
      return '<button class="chip '+(s.state==='open'?'on':'')+'" data-act="toggle" data-id="'+s.id+'" aria-pressed="'+(s.state==='open')+'">'+timeLbl(s.start)+'<small>'+(s.state==='open'?'Open':'Closed')+'</small></button>';}).join('');
    return '<div class="day"><h3>'+dayLbl(T(d+'T00:00'))+' · '+ss.filter(s=>s.state==='open').length+' open</h3><div class="chips">'+chips+'</div></div>';}).join('');
  return '<p class="muted">Tap a time to open or close it. Students can book open times that are at least 24 hours away. Booked times are locked; cancel the interview from the daily schedule if you cannot make it.</p>'+rows;
}
function bookingCard(i){
  const st=S.students.find(s=>s.id===i.sid);
  const n=S.interviews.filter(x=>x.sid===i.sid&&x.status!=='cancelled'&&x.start<=i.start).length;
  const started=i.start<=S.now;
  let state='',main='';
  if(i.status==='completed'){
    state={pass:pill('p-ok','Passed'),fail:pill('p-bad','Failed'),retake:pill('p-warn','Retake later')}[i.outcome];
    main=i.note?'<p class="muted sm">Feedback sent: '+esc(i.note)+'</p>':'';
  }else if(i.status==='no_show'){state=pill('p-bad','No-show');}
  else if(!started){
    state=pill('p-acc','Upcoming');
    main='<p class="muted sm">The outcome form opens when the interview starts.</p><div class="row">'+btn('Cancel interview','ivcancel',i.id,'danger sm')+'</div>';
  }else{
    state=pill('p-warn','Needs outcome');
    main='<fieldset><legend class="sm muted">Outcome</legend>'+
      [['pass','Pass'],['fail','Fail'],['retake','Retake later']].map(o=>'<label class="opt"><input type="radio" name="o'+i.id+'" value="'+o[0]+'"> '+o[1]+'</label>').join('')+'</fieldset>'+
      '<label class="sm muted" for="n'+i.id+'">Feedback for the student (required for Fail and Retake later)</label><textarea id="n'+i.id+'" rows="2"></textarea>'+
      '<p class="muted sm">Retake later: student can rebook after 7 days. Fail: after 14 days.</p><p class="err" id="e'+i.id+'" hidden></p>'+
      '<div class="row">'+btn('Record outcome','record',i.id)+btn('Mark no-show','noshow',i.id,'sec')+'</div>';
  }
  return '<section class="card bkc"><div class="bk-h"><div class="bk-time">'+timeLbl(i.start)+'</div><div><b>'+st.name+'</b><div class="muted sm">Backend Track · 5/5 skills cleared · Attempt '+n+'</div></div>'+state+'</div>'+main+'</section>';
}
function schedHTML(){
  const tabs=DAYS.map(d=>{const c=S.interviews.filter(i=>i.iv===S.iv&&dayKey(i.start)===d&&i.status!=='cancelled').length;
    return '<button data-act="day" data-id="'+d+'" aria-selected="'+(S.day===d)+'">'+dayLbl(T(d+'T00:00'))+' ('+c+')</button>';}).join('');
  const list=S.interviews.filter(i=>i.iv===S.iv&&dayKey(i.start)===S.day&&i.status!=='cancelled').sort((a,b)=>a.start-b.start);
  const openN=S.slots.filter(s=>s.iv===S.iv&&s.day===S.day&&s.state==='open').length;
  return '<div class="seg">'+tabs+'</div>'+(list.length?'<div class="list">'+list.map(bookingCard).join('')+'</div>':
    '<section class="card"><p class="msg">No interviews booked for this day. You have '+openN+' open slot'+(openN===1?'':'s')+'.</p></section>');
}
function interviewerView(){
  const who='<div class="seg">'+Object.keys(IV).map(k=>'<button data-act="ivsel" data-id="'+k+'" aria-selected="'+(S.iv===k)+'">'+IV[k]+'</button>').join('')+'</div>';
  const sub='<div class="tabs" style="align-self:flex-start">'+[['avail','My availability'],['sched','Daily schedule']].map(x=>'<button data-act="ivtab" data-id="'+x[0]+'" aria-selected="'+(S.ivTab===x[0])+'">'+x[1]+'</button>').join('')+'</div>';
  return '<div class="list">'+who+sub+(S.ivTab==='avail'?availHTML():schedHTML())+'</div>';
}
