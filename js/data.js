// Seed data: students, interviewers, availability slots and interviews. init() builds a fresh demo state.
function init(){
  const spec={
    a:{'2026-11-16':['10:00','11:00','14:00'],'2026-11-17':['11:00','15:00','16:00'],'2026-11-18':['10:00','14:00'],'2026-11-19':['12:00','15:00'],'2026-11-20':['11:00']},
    r:{'2026-11-16':['12:00','15:00'],'2026-11-17':['10:00','14:00'],'2026-11-18':['11:00','16:00'],'2026-11-19':['10:00','14:00'],'2026-11-20':['10:00','15:00']}};
  const slots=[];
  for(const iv of ['a','r'])for(const d of DAYS)for(const t of TIMES)
    slots.push({id:iv+'|'+d+'T'+t,iv,day:d,time:t,start:T(d+'T'+t),state:(spec[iv][d]||[]).includes(t)?'open':'closed'});
  const slot=id=>slots.find(s=>s.id===id);
  slot('a|2026-11-16T10:00').state='booked'; slot('r|2026-11-17T10:00').state='booked';
  return {
    now:NOW0,role:'student',stab:'home',sel:null,iv:'a',ivTab:'avail',day:DAYS[0],filter:'all',flagging:null,nudged:{},ba:'passed',seq:10,
    students:[{id:'s1',name:'Aarav Menon'},{id:'s2',name:'Isha Patel'},{id:'s3',name:'Kabir Shah'},{id:'s4',name:'Meera Iyer'},{id:'s5',name:'Sana Qureshi'},{id:'s6',name:'Rohan Das'},{id:'s7',name:'Dev Khanna'}],
    slots,
    interviews:[
      {id:1,sid:'s2',iv:'a',slot:'a|2026-11-16T10:00',start:T('2026-11-16T10:00'),status:'booked'},
      {id:2,sid:'s3',iv:'r',slot:'r|2026-11-17T10:00',start:T('2026-11-17T10:00'),status:'booked'},
      {id:3,sid:'s5',iv:'a',slot:null,start:T('2026-11-12T11:00'),status:'completed',outcome:'pass',note:'',recordedAt:T('2026-11-12T12:10')},
      {id:4,sid:'s6',iv:'r',slot:null,start:T('2026-11-11T14:00'),status:'completed',outcome:'retake',note:'Revisit indexing and query plans.',recordedAt:T('2026-11-11T15:10'),nextAfter:T('2026-11-18T00:00')}],
    awards:[{sid:'s5',status:'active',at:T('2026-11-12T12:10')}]
  };
}
