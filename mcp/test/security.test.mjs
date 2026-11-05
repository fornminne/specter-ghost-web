import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
const port=18787;
const token='0123456789abcdef0123456789abcdef';
let child;
test('security gates',async()=>{
 child=spawn(process.execPath,['server.mjs'],{cwd:new URL('..',import.meta.url),env:{...process.env,MCP_PORT:String(port),MCP_BEARER_TOKEN:token},stdio:'ignore'});
 try{
  let ready=false;
  for(let i=0;i<40;i++){try{const r=await fetch('http://127.0.0.1:'+port+'/healthz');if(r.ok){ready=true;break;}}catch{} await sleep(100);}
  assert.ok(ready,'server must start');
  const url='http://127.0.0.1:'+port+'/mcp';
  assert.equal((await fetch(url,{method:'POST'})).status,401);
  assert.equal((await fetch(url,{method:'POST',headers:{Authorization:'Bearer '+token,Origin:'https://evil.example'}})).status,403);
  assert.equal((await fetch(url,{method:'PUT',headers:{Authorization:'Bearer '+token}})).status,405);
  const response=await fetch(url,{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json',Accept:'application/json, text/event-stream'},body:JSON.stringify({jsonrpc:'2.0',id:1,method:'initialize',params:{protocolVersion:'2025-03-26',capabilities:{},clientInfo:{name:'test',version:'1'}}})});
  assert.equal(response.status,200,await response.text());
 }finally{child.kill('SIGTERM');}
});
