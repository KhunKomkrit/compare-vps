import './style.css';
import mermaid from 'mermaid';

(() => {
const root=document.getElementById('vps-compare');
const el=id=>root.querySelector('#'+id);
const specs=[['Management','2 vCPU · RAM 4 GB · Disk ≥100 GB'],['DEV + UAT','4 vCPU · RAM 8 GB · Disk ≥150 GB'],['PROD App','4 vCPU · RAM 8 GB · Disk ≥100 GB'],['PROD DB','4 vCPU · RAM 16 GB · Disk ≥150 GB']];
const data={
up:{name:'UpCloud',currency:'USD',prices:[26+50*.25,54+50*.25,54,108],notes:['Premium $26 + MaxIOPS 50 GB $12.50; รวม 100 GB','Premium $54 + MaxIOPS 50 GB $12.50; รวม 150 GB','Premium $54; รวม 100 GB','Premium $108; รวม 150 GB']},
ready:{name:'ReadyIDC',currency:'THB',prices:[800,1400,1300,1800],notes:['2 CPU / 4 GB / 100 GB + 1 IP','4 CPU / 8 GB / 150 GB + 1 IP','4 CPU / 8 GB / 100 GB + 1 IP','4 CPU / 16 GB / 150 GB + 1 IP']},
do:{name:'DigitalOcean',currency:'USD',prices:[26,48,48,136],notes:['Basic $24: 80 GiB + Volume 20 GiB $2; รวม 100 GiB','Basic $48: รวม 160 GiB','Basic $48: รวม 160 GiB','General Purpose $126: 50 GiB + Volume 100 GiB $10; รวม 150 GiB']}
};
const num=n=>n.toLocaleString('th-TH',{minimumFractionDigits:0,maximumFractionDigits:2});
function state(){return {provider:el('provider').value,fx:Number(el('fx').value),vat:el('vat').checked};}
function render(){const s=state();if(!Number.isFinite(s.fx)||s.fx<=0){el('monthly').textContent='กรอกอัตราแลกเปลี่ยนมากกว่า 0';return;}const d=data[s.provider];const mult=(d.currency==='USD'?s.fx:1)*(s.vat?1.07:1);const sum=d.prices.reduce((a,b)=>a+b,0);el('monthly').textContent=num(sum*mult);el('yearly').textContent=num(sum*mult*12);el('native').textContent=d.name+' · '+num(sum)+' '+d.currency+'/เดือน ก่อนภาษี';el('tax').textContent=s.vat?'รวมภาษีสมมติ 7%':'ก่อนภาษี · ไม่รวมบริการเสริม';el('rows').innerHTML=specs.map((x,i)=>'<tr><td><strong>'+x[0]+'</strong><br><span class="text-small">'+x[1]+'</span></td><td>'+d.notes[i]+'</td><td class="text-end tabular-nums">'+num(d.prices[i]*mult)+'</td></tr>').join('');el('all').innerHTML=Object.entries(data).map(([key,p])=>{let cost=p.prices.reduce((a,b)=>a+b,0)*(p.currency==='USD'?s.fx:1)*(s.vat?1.07:1);return '<tr><td>'+p.name+(key===s.provider?' · เลือกอยู่':'')+'</td><td class="text-end tabular-nums">'+num(cost)+'</td><td class="text-end tabular-nums">'+num(cost*12)+'</td></tr>';}).join('');}
function apply(s){if(!s)return;if(data[s.provider])el('provider').value=s.provider;if(Number(s.fx)>0)el('fx').value=s.fx;if(typeof s.vat==='boolean')el('vat').checked=s.vat;}
const params=new URLSearchParams(location.search);apply({provider:params.get('provider'),fx:params.get('fx'),vat:params.has('vat')?params.get('vat')==='1':false});render();
root.addEventListener('input',()=>{render();window.dispatchEvent(new Event('planner:update'));});

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
 MGMT -->|SSH private| NONPROD
 MGMT -->|SSH private| APP
 APP -->|Private DB connection| DB
 end
 DB --> BACKUP["Off-provider backup · ยังไม่รวมราคา"]
 TOTAL["รวม ${monthly} THB/mo · ยังไม่ใช่ HA"]
 CLOUD --- TOTAL`;
 try{const {svg}=await mermaid.render('architecture-'+id,graph);if(id===sequence)document.getElementById('diagram').innerHTML=svg;}catch(e){if(id===sequence)document.getElementById('diagram').textContent='ไม่สามารถแสดง diagram ได้ กรุณาโหลดหน้าใหม่';console.error(e);}
}
window.addEventListener('planner:update',draw);draw();
document.getElementById('share').onclick=async()=>{const url=new URL(location.href);url.search=new URLSearchParams({provider:document.getElementById('provider').value,fx:document.getElementById('fx').value,vat:document.getElementById('vat').checked?'1':'0'});try{await navigator.clipboard.writeText(url.href);document.getElementById('message').textContent='คัดลอกแล้ว';}catch{window.prompt('คัดลอกลิงก์',url.href);}};
document.getElementById('print').onclick=()=>window.print();
