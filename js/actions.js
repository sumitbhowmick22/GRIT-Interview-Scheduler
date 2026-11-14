// render(), toast and ACT: every transition (book, cancel, record outcome, revoke).
/* ---------- render + actions ---------- */
function render(){
  $('clock').textContent=dayLbl(S.now)+', '+timeLbl(S.now);
  document.querySelectorAll('#roleNav button').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.id===S.role)));
  const sk=$('skipBtn');if(sk)sk.disabled=S.now>=NOW1;
  $('view').innerHTML=S.role==='student'?studentView():S.role==='interviewer'?interviewerView():S.role==='team'?teamView():S.role==='msgs'?msgsHTML():baHTML();
}
let tt;
function toast(t){const e=$('toast');e.textContent=t;e.hidden=false;clearTimeout(tt);tt=setTimeout(()=>{e.hidden=true},2800)}
function cancelInterview(id,by){
  const i=S.interviews.find(x=>x.id===+id);if(!i)return;
  i.status='cancelled';i.by=by;
  const s=S.slots.find(x=>x.id===i.slot);if(s)s.state=by==='student'?'open':'closed';
}
const ACT={
  role:id=>{S.role=id;render()},
  stab:id=>{S.stab=id;render()},
  goBook:()=>{S.stab='book';render()},
  pick:id=>{S.sel=id;render()},
  confirm:()=>{
    const s=S.slots.find(x=>x.id===S.sel);
    if(!s||s.state!=='open'||s.start-S.now<24*H){toast('That slot is no longer available. Pick another.');S.sel=null;render();return}
    s.state='booked';S.interviews.push({id:++S.seq,sid:ME,iv:s.iv,slot:s.id,start:s.start,status:'booked'});
    S.sel=null;S.stab='home';toast('Booking confirmed. Details are on your home screen.');render();
  },
  cancel:id=>{
    const i=S.interviews.find(x=>x.id===+id);
    if(i&&S.now>=new Date(i.start.getTime()-12*H)){toast('Too late to cancel online.');return}
    cancelInterview(id,'student');toast('Booking cancelled. You can book another slot.');render();
  },
  change:id=>{
    const i=S.interviews.find(x=>x.id===+id);
    if(i&&S.now>=new Date(i.start.getTime()-12*H)){toast('Too late to change online.');return}
    cancelInterview(id,'student');S.stab='book';render();
  },
  ivsel:id=>{S.iv=id;render()},
  ivtab:id=>{S.ivTab=id;render()},
  day:id=>{S.day=id;render()},
  toggle:id=>{const s=S.slots.find(x=>x.id===id);if(s&&s.state!=='booked')s.state=s.state==='open'?'closed':'open';render()},
  ivcancel:id=>{cancelInterview(id,'interviewer');toast('Interview cancelled. The student can pick a new slot.');render()},
  noshow:id=>{const i=S.interviews.find(x=>x.id===+id);i.status='no_show';i.recordedAt=S.now;toast('Marked as no-show. The student is notified.');render()},
  record:id=>{
    const i=S.interviews.find(x=>x.id===+id);
    const r=document.querySelector('input[name="o'+id+'"]:checked'),note=($('n'+id).value||'').trim(),err=$('e'+id);
    const fail=m=>{err.textContent=m;err.hidden=false};
    if(!r)return fail('Choose an outcome first.');
    if(r.value!=='pass'&&!note)return fail('Add feedback so the student knows what to work on.');
    i.status='completed';i.outcome=r.value;i.note=note;i.recordedAt=S.now;
    if(r.value==='pass')S.awards.push({sid:i.sid,status:'active',at:S.now});
    else i.nextAfter=new Date(dayStart(S.now).getTime()+(r.value==='retake'?7:14)*D);
    toast('Outcome recorded. The student is notified.');render();
  },
  filter:id=>{S.filter=id;render()},
  nudge:id=>{S.nudged[id]=true;toast('Reminder sent to the student.');render()},
  flag:id=>{S.flagging=id;render()},
  flagno:()=>{S.flagging=null;render()},
  flagyes:id=>{const a=S.awards.find(x=>x.sid===id);if(a){a.status='revoked';a.reason='malpractice'}S.flagging=null;toast('Badge revoked. The student is notified.');render()},
  ba:id=>{S.ba=id;render()},
  skip:()=>{S.now=NOW1;toast('Clock moved to Mon 16 Nov, 6:00 PM.');render()},
  reset:()=>{S=init();render()}
};
document.addEventListener('click',e=>{
  const el=e.target.closest('[data-act]');if(!el||el.disabled)return;
  const f=ACT[el.dataset.act];if(f)f(el.dataset.id);
});
