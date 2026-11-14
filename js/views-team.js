// Interview team tracker: who booked, who has not, reminders, malpractice flag.
/* ---------- interview team ---------- */
function rowHTML(st,vm){
  let p,info,act='';
  const w=vm.start?dayLbl(vm.start)+', '+timeLbl(vm.start)+' · '+vm.iv:'';
  switch(vm.status){
    case 'booked':p=pill('p-acc','Booked');info=w;break;
    case 'passed':p=pill('p-ok','Passed');info='Passed '+dayLbl(vm.date)+' · '+vm.iv;
      act=S.flagging===st.id?btn('Revoke badge','flagyes',st.id,'danger sm')+btn('Cancel','flagno',st.id,'sec sm'):btn('Flag malpractice','flag',st.id,'sec sm');break;
    case 'retake':p=pill('p-warn','Retake later');info='Eligible again '+dayLbl(vm.nextAfter);break;
    case 'fail':p=pill('p-bad','Failed');info='Eligible again '+dayLbl(vm.nextAfter);break;
    case 'revoked':p=pill('p-bad','Badge revoked');info='Removed after a malpractice flag';break;
    default:p=pill('p-warn','Not booked');info='No slot booked';
      act=S.nudged[st.id]?'<span class="muted sm">Reminder sent</span>':btn('Send reminder','nudge',st.id,'sec sm');}
  return '<div class="trow"><div><b>'+st.name+'</b><div class="muted sm">Backend Track · 5/5 skills</div></div><div>'+p+'</div><div class="sm">'+info+'</div><div class="ract">'+act+'</div></div>';
}
const bucket=s=>s==='eligible'?'notbooked':s==='booked'?'booked':'done';
function teamView(){
  const rows=S.students.map(st=>({st,vm:vmFor(st.id)}));
  const c={all:rows.length,notbooked:0,booked:0,done:0};rows.forEach(r=>c[bucket(r.vm.status)]++);
  const f=[['all','All'],['notbooked','Not booked'],['booked','Booked'],['done','Result recorded']];
  const chips='<div class="seg">'+f.map(x=>'<button data-act="filter" data-id="'+x[0]+'" aria-selected="'+(S.filter===x[0])+'">'+x[1]+' '+c[x[0]]+'</button>').join('')+'</div>';
  const shown=rows.filter(r=>S.filter==='all'||bucket(r.vm.status)===S.filter);
  return '<div class="list"><div><h2>Eligible students</h2><p class="muted">Students who cleared every skill for the Backend Track. '+c.booked+' booked, '+c.notbooked+' not booked yet.</p></div>'+chips+
    shown.map(r=>rowHTML(r.st,r.vm)).join('')+'</div>';
}
