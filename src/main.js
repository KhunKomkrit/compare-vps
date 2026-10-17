import './style.css';
import mermaid from 'mermaid';

(() => {
const root=document.getElementById('vps-compare');
const el=id=>root.querySelector('#'+id);
const specs=[['Management','2 vCPU · RAM 4 GB · Disk ≥100 GB'],['DEV + UAT','4 vCPU · RAM 8 GB · Disk ≥150 GB'],['PROD App','4 vCPU · RAM 8 GB · Disk ≥100 GB'],['PROD DB','4 vCPU · RAM 16 GB · Disk ≥150 GB']];
const data={
up:{name:'UpCloud',currency:'USD',prices:[26+50*.25,54+50*.25,54,108],notes:['Premium $26 + MaxIOPS 50 GB $12.50; รวม 100 GB','Premium $54 + MaxIOPS 50 GB $12.50; รวม 150 GB','Premium $54; รวม 100 GB','Premium $108; รวม 150 GB']},
ready:{name:'ReadyIDC',currency:'THB',prices:[800,1400,1300,1800],notes:['2 CPU / 4 GB / 100 GB + 1 IP','4 CPU / 8 GB / 150 GB + 1 IP','4 CPU / 8 GB / 100 GB + 1 IP','4 CPU / 16 GB / 150 GB + 1 IP']},
zcom:{name:'Z.com',currency:'THB',prices:[900,1800,1500,2400],promo:[780,1560,1260,2040],notes:['Linux Standard C2 · 2 CPU / RAM 4 GB / Disk 100 GB · 500 IOPS · 1 IP; compute 600 + disk 300 บาท','Linux Standard C3 · 4 CPU / RAM 8 GB / Disk 200 GB · 500 IOPS · 1 IP; compute 1,200 + disk 600 บาท (พื้นที่เกินเป้าหมาย)','Linux Standard C3 · 4 CPU / RAM 8 GB / Disk 100 GB · 500 IOPS · 1 IP; compute 1,200 + disk 300 บาท','Linux HighMEM C3 · 4 CPU / RAM 16 GB / Disk 200 GB · 500 IOPS · 1 IP; compute 1,800 + disk 600 บาท (พื้นที่เกินเป้าหมาย)']},
host:{name:'Hostinger',currency:'THB',prices:[419,839,839,839],promo:[279,389,389,389],notes:['KVM 2 · 2 vCPU / RAM 8 GB / NVMe 100 GB (RAM มากกว่าเป้าหมาย)','KVM 4 · 4 vCPU / RAM 16 GB / NVMe 200 GB (RAM/พื้นที่มากกว่าเป้าหมาย)','KVM 4 · 4 vCPU / RAM 16 GB / NVMe 200 GB (RAM/พื้นที่มากกว่าเป้าหมาย)','KVM 4 · 4 vCPU / RAM 16 GB / NVMe 200 GB (พื้นที่มากกว่าเป้าหมาย)']},
do:{name:'DigitalOcean',currency:'USD',prices:[26,48,48,136],notes:['Basic $24: 80 GiB + Volume 20 GiB $2; รวม 100 GiB','Basic $48: รวม 160 GiB','Basic $48: รวม 160 GiB','General Purpose $126: 50 GiB + Volume 100 GiB $10; รวม 150 GiB']}
};
const num=n=>n.toLocaleString('th-TH',{maximumFractionDigits:2});
const validKeys=Object.keys(data);
function state(){return {provider:el('provider').value,fx:Number(el('fx').value),vat:el('vat').checked,hostRate:el('host-rate').value,zRate:el('z-rate').value,compare:[...root.querySelectorAll('[name="compare"]:checked')].map(e=>e.value)};}
function prices(p,s){return (p===data.host&&s.hostRate==='promo')||(p===data.zcom&&s.zRate==='promo')?p.promo:p.prices;}
function multiplier(p,s){return (p.currency==='USD'?s.fx:1)*(s.vat?1.07:1);}
function monthly(p,s){return prices(p,s).reduce((a,b)=>a+b,0)*multiplier(p,s);}
function render(){const s=state();const valid=Number.isFinite(s.fx)&&s.fx>0;el('fx-error').hidden=valid;if(!valid){el('monthly').textContent='—';el('yearly').textContent='—';el('rows').innerHTML='';el('all').innerHTML='';el('matrix-head').innerHTML='';el('matrix-body').innerHTML='';return;}const d=data[s.provider],mult=multiplier(d,s),list=prices(d,s);el('monthly').textContent=num(monthly(d,s));el('yearly').textContent=num(monthly(d,s)*12);el('native').textContent=d.name+' · '+num(list.reduce((a,b)=>a+b,0))+' '+d.currency+'/เดือน ก่อนภาษี';el('tax').textContent=(s.vat?'รวมภาษีสมมติ 7%':'ก่อนภาษี')+' · รายปีเป็นค่าเฉลี่ย ×12';el('host-note').textContent=s.hostRate==='promo'?'Hostinger: ใช้ราคาโปรโมชันเฉลี่ยต่อเดือน ต้องชำระล่วงหน้าตามระยะสัญญาที่ checkout; ไม่ใช่จ่ายรายเดือน':'Hostinger: ใช้ราคาต่ออายุเฉลี่ยต่อเดือน อ้างอิงการต่ออายุ 2 ปี; ต้องชำระล่วงหน้าตาม checkout';el('z-note').textContent=s.zRate==='promo'?'Z.com: ส่วนลด compute 20% ตามตัวคำนวณที่ตรวจ; ค่าดิสก์ไม่ลด ต้องยืนยันสิทธิ์/ระยะโปรโมชันกับผู้ให้บริการ':'Z.com: ราคาปกติ Linux + ค่าดิสก์ 500 IOPS; ราคาเดือนอ้างอิง 720 ชั่วโมง ไม่ใช่บิลจริงของบริษัท';el('rows').innerHTML=specs.map((x,i)=>'<tr><td><strong>'+x[0]+'</strong><br><span class="text-small">'+x[1]+'</span></td><td>'+d.notes[i]+'</td><td class="text-end tabular-nums">'+num(list[i]*mult)+'</td></tr>').join('');
const selected=s.compare.filter(k=>validKeys.includes(k));el('compare-empty').hidden=selected.length>0;
el('matrix-head').innerHTML=selected.length?'<tr><th>เครื่อง / สเปกขั้นต่ำ</th>'+selected.map(k=>'<th>'+data[k].name+'</th>').join('')+'</tr>':'';
el('matrix-body').innerHTML=selected.length?specs.map((x,i)=>'<tr><td><strong>'+x[0]+'</strong><br>'+x[1]+'</td>'+selected.map(k=>'<td><strong>'+num(prices(data[k],s)[i]*multiplier(data[k],s))+' บาท/เดือน</strong><br><span class="text-small">'+data[k].notes[i]+'</span></td>').join('')+'</tr>').join('')+['month','year'].map(period=>'<tr class="font-semibold"><td>รวม'+(period==='month'?'ต่อเดือน':'ต่อปี (เฉลี่ย ×12)')+'</td>'+selected.map(k=>'<td>'+num(monthly(data[k],s)*(period==='year'?12:1))+' บาท</td>').join('')+'</tr>').join(''):'';
el('all').innerHTML=selected.map(k=>'<tr><td>'+data[k].name+'</td><td class="text-end tabular-nums">'+num(monthly(data[k],s))+'</td><td class="text-end tabular-nums">'+num(monthly(data[k],s)*12)+'</td></tr>').join('');}
const params=new URLSearchParams(location.search);if(data[params.get('provider')])el('provider').value=params.get('provider');if(Number(params.get('fx'))>0)el('fx').value=params.get('fx');el('vat').checked=params.get('vat')==='1';if(params.get('hostRate')==='promo')el('host-rate').value='promo';if(params.get('zRate')==='promo')el('z-rate').value='promo';if(params.has('compare'))root.querySelectorAll('[name="compare"]').forEach(e=>e.checked=params.get('compare').split(',').includes(e.value));render();
root.addEventListener('input',()=>{render();if(Number(el('fx').value)>0)window.dispatchEvent(new Event('planner:update'));});
el('share').onclick=async()=>{const s=state();if(!Number.isFinite(s.fx)||s.fx<=0)return;const url=new URL(location.href);url.search=new URLSearchParams({provider:s.provider,fx:s.fx,vat:s.vat?'1':'0',hostRate:s.hostRate,zRate:s.zRate,compare:s.compare.join(',')});try{await navigator.clipboard.writeText(url.href);el('message').textContent='คัดลอกแล้ว';}catch{window.prompt('คัดลอกลิงก์',url.href);}};
})();

mermaid.initialize({startOnLoad:false,securityLevel:'strict',theme:'neutral',flowchart:{htmlLabels:false,useMaxWidth:true}});
let sequence=0;
async function draw(){
 const id=++sequence;
 const provider=document.getElementById('provider').selectedOptions[0].textContent;
 const prices=[...document.querySelectorAll('#rows tr')].map(row=>row.lastElementChild.textContent);
 const monthly=document.getElementById('monthly').textContent;
 const graph=`flowchart TB
 USER["Internet"] -->|HTTPS 443| APP
 TEAM["ทีม IT"] -->|VPN| MGMT
 subgraph CLOUD["${provider}"]
 MGMT["Management / Coolify / VPN / Metrics<br/>2 vCPU · RAM 4 GB · Disk ≥100 GB<br/>${prices[0]} THB/mo"]
 NONPROD["DEV + UAT<br/>4 vCPU · RAM 8 GB · Disk ≥150 GB<br/>${prices[1]} THB/mo"]
 APP["PROD App<br/>4 vCPU · RAM 8 GB · Disk ≥100 GB<br/>${prices[2]} THB/mo"]
 DB["PROD DB<br/>4 vCPU · RAM 16 GB · Disk ≥150 GB<br/>${prices[3]} THB/mo"]
 MGMT -->|SSH private / overlay| NONPROD
 MGMT -->|SSH private / overlay| APP
 APP -->|Private / encrypted overlay| DB
 end
 DB --> BACKUP["Off-provider backup · ยังไม่รวมราคา"]
 TOTAL["รวม ${monthly} THB/mo · ยังไม่ใช่ HA"]
 CLOUD --- TOTAL`;
 try{const {svg}=await mermaid.render('architecture-'+id,graph);if(id===sequence)document.getElementById('diagram').innerHTML=svg;}catch(e){if(id===sequence)document.getElementById('diagram').textContent='ไม่สามารถแสดง diagram ได้ กรุณาโหลดหน้าใหม่';console.error(e);}
}
window.addEventListener('planner:update',draw);draw();
document.getElementById('print').onclick=()=>window.print();
