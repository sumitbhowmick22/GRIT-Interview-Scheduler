// Before and after screens, and the student messages screen.
/* ---------- before & after ---------- */
const REF_B=T('2026-11-14T12:05'),REF_A=T('2026-11-16T18:00');
function baHTML(){
  const s0=T('2026-11-16T11:00'),iv='Anita Rao';
  const before={status:'booked',iv,start:s0,attempt:1,id:0};
  const after={
    passed:{status:'passed',iv,start:s0,date:T('2026-11-16T17:00'),attempt:1},
    retake:{status:'retake',iv,start:s0,note:'Your API design was solid. Revisit indexing and query plans.',nextAfter:T('2026-11-23T00:00'),attempt:2},
    fail:{status:'fail',iv,start:s0,note:'Schema design and error handling need more depth.',nextAfter:T('2026-11-30T00:00'),attempt:2},
    revoked:{status:'revoked',iv,start:s0,date:T('2026-11-16T17:00'),attempt:1}}[S.ba];
  const lab={passed:'Passed',retake:'Retake later',fail:'Failed',revoked:'Badge revoked'}[S.ba];
  const cB={now:REF_B},cA={now:REF_A},me={id:'x',name:'Aarav Menon'};
  const sel='<div class="seg">'+Object.entries({passed:'Passed',retake:'Retake later',fail:'Failed',revoked:'Badge revoked later'}).map(e=>'<button data-act="ba" data-id="'+e[0]+'" aria-selected="'+(S.ba===e[0])+'">'+e[1]+'</button>').join('')+'</div>';
  const head=(t)=>'<div class="sec-h"><h2>'+t+'</h2></div>';
  const tags='<div class="cmp"><div class="tag">'+pill('p-mute','Before')+' Interview booked</div><div class="tag">'+pill('p-acc','After')+' '+lab+'</div></div>';
  const ph=h=>'<div class="phone" inert>'+h+'</div>';
  return '<div class="list"><div><h2>Before and after the result</h2><p class="muted">Pick the outcome to compare. Each screen is the same component the live prototype uses.</p></div>'+sel+
    head('Student home')+tags+'<div class="cmp">'+ph(homeHTML(before,cB))+ph(homeHTML(after,cA))+'</div>'+
    head('Student badges')+tags+'<div class="cmp">'+ph(badgesHTML(before,cB))+ph(badgesHTML(after,cA))+'</div>'+
    head('Interview team tracker')+tags+'<div class="cmp"><div inert>'+rowHTML(me,before)+'</div><div inert>'+rowHTML(me,after)+'</div></div></div>';
}

/* ---------- student messages ---------- */
function msgsHTML(){
  const s0=T('2026-11-16T11:00'),iv='Anita Rao',cB={now:REF_B},cA={now:REF_A};
  const item=(n,title,where,vm,ctx)=>'<div><div class="tag">'+pill('p-acc',n)+' '+title+'</div><div class="muted sm">'+where+'</div><div inert>'+statusCard(vm,ctx)+'</div></div>';
  const top='<div class="tri">'+
    item('1','Booking confirmed','Shown on Student home right after booking.',{status:'booked',iv,start:s0,attempt:1,id:0},cB)+
    item('2','Passed','Shown on Student home when the interviewer records Pass.',{status:'passed',iv,start:s0,date:T('2026-11-16T17:00'),attempt:1},cA)+
    item('3','Retake later','Shown on Student home when the interviewer records Retake later.',{status:'retake',iv,start:s0,note:'Revisit indexing and query plans.',nextAfter:T('2026-11-23T00:00'),attempt:2},cA)+'</div>';
  const more='<div class="tri">'+
    item('Variant','Failed','Same place, same shape as Retake later.',{status:'fail',iv,start:s0,note:'Schema design and error handling need more depth.',nextAfter:T('2026-11-30T00:00'),attempt:2},cA)+
    item('Variant','Badge revoked','Shown after the team flags malpractice on a passed badge.',{status:'revoked',iv,start:s0,date:T('2026-11-16T17:00'),attempt:1},cA)+'</div>';
  return '<div class="list"><div><h2>The 3 most important student messages</h2><p class="muted">Exactly as the student sees them on the dashboard.</p></div>'+top+
    '<div class="sec-h"><h2>Other variants</h2></div>'+more+'</div>';
}
