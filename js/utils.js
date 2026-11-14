// Dates, formatting and small UI helpers shared by every screen.
const IST_MS=19800000,H=3600000,D=86400000;
const WD=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],MO=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const T=s=>new Date(s+':00+05:30');
const ist=d=>new Date(d.getTime()+IST_MS);
const dayLbl=d=>{const x=ist(d);return WD[x.getUTCDay()]+' '+x.getUTCDate()+' '+MO[x.getUTCMonth()]};
const timeLbl=d=>{const x=ist(d);let h=x.getUTCHours();const m=x.getUTCMinutes(),ap=h>=12?'PM':'AM';h=h%12||12;return h+':'+String(m).padStart(2,'0')+' '+ap};
const dayKey=d=>ist(d).toISOString().slice(0,10);
const dayStart=d=>{const x=ist(d);return new Date(Date.UTC(x.getUTCFullYear(),x.getUTCMonth(),x.getUTCDate())-IST_MS)};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const $=id=>document.getElementById(id);
const IV={a:'Anita Rao',r:'Rahul Verma'};
const DAYS=['2026-11-16','2026-11-17','2026-11-18','2026-11-19','2026-11-20'];
const TIMES=['10:00','11:00','12:00','14:00','15:00','16:00'];
const ME='s1';
const NOW0=T('2026-11-14T12:05'),NOW1=T('2026-11-16T18:00');
let S;

/* ---------- small helpers ---------- */
const pill=(c,t)=>'<span class="pill '+c+'">'+t+'</span>';
const btn=(label,act,id,cls,dis)=>'<button class="btn '+(cls||'')+'" data-act="'+act+'"'+(id!=null?' data-id="'+id+'"':'')+(dis?' disabled':'')+'>'+label+'</button>';
const when=d=>dayLbl(d)+' at '+timeLbl(d);
