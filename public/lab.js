const btn=document.querySelector('.solve'),status=document.querySelector('#status'),input=document.querySelector('#flag');
const API='https://ptej5ssp2e.execute-api.us-east-2.amazonaws.com/verify';
if(btn&&status&&input){
  const id=btn.dataset.lab,key='sg:complete:'+id;
  const showDone=()=>{status.textContent='✓ FLAG ACCEPTED · LAB COMPLETE';status.classList.add('ok');btn.textContent='COMPLETED ✓';btn.disabled=true};
  if(localStorage.getItem(key)==='1')showDone();
  btn.addEventListener('click', async () => {
    if(btn.disabled)return;
    const flag=input.value.trim();
    if(!flag){status.textContent='Enter the recovered training flag.';status.classList.remove('ok');return}
    btn.disabled=true;status.textContent='Verifying flag…';status.classList.remove('ok');
    try{
      const response=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({lab:id,flag}),cache:'no-store'});
      if(!response.ok)throw new Error('HTTP '+response.status);
      const result=await response.json();
      if(result.valid===true){localStorage.setItem(key,'1');showDone();return}
      status.textContent='✕ FLAG REJECTED · keep investigating the evidence';
    }catch(error){status.textContent='Verification unavailable. Please retry later.';console.error('Flag verification failed:',error)}
    finally{if(localStorage.getItem(key)!=='1')btn.disabled=false}
  });
  input.addEventListener('keydown',e=>{if(e.key==='Enter')btn.click()});
}
