// Student journey state, derived from interviews and badges (never stored): vmFor() and canBook().
/* ---------- derived student state ---------- */
function vmFor(sid){
  const mine=S.interviews.filter(i=>i.sid===sid),last=mine[mine.length-1];
  const used=mine.filter(i=>i.status==='completed'||i.status==='no_show').length;
  const aw=S.awards.find(a=>a.sid===sid);
  const b=last?{iv:IV[last.iv],start:last.start}:{};
  if(aw)return {...b,status:aw.status==='active'?'passed':'revoked',date:aw.at,attempt:used};
  if(!last||last.status==='cancelled'||last.status==='no_show')
    return {...b,status:'eligible',attempt:used+1,flash:last?(last.status==='no_show'?'no_show':last.by):null};
  if(last.status==='booked')return {...b,status:'booked',id:last.id,attempt:used+1};
  return {...b,status:last.outcome,note:last.note,nextAfter:last.nextAfter,attempt:used+1};
}
const canBook=(vm,now)=>vm.status==='eligible'||((vm.status==='retake'||vm.status==='fail')&&now>=vm.nextAfter);
