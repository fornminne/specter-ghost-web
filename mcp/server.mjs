import http from 'node:http';
import { timingSafeEqual, createHash } from 'node:crypto';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';

const HOST = '127.0.0.1';
const PORT = Number(process.env.MCP_PORT || 8787);
const ORIGIN = process.env.MCP_PUBLIC_ORIGIN || 'https://specterghost.com';
const TOKEN = process.env.MCP_BEARER_TOKEN;
const REPO = 'fornminne/flipper-ghost';
if (!TOKEN || TOKEN.length < 32) throw new Error('MCP_BEARER_TOKEN must be set to a random 32+ character secret');
if (!ORIGIN.startsWith('https://')) throw new Error('MCP_PUBLIC_ORIGIN must use HTTPS');

function authorized(req) {
  const match = /^Bearer (\S+)$/i.exec(req.headers.authorization || '');
  if (!match) return false;
  const a = createHash('sha256').update(match[1]).digest();
  const b = createHash('sha256').update(TOKEN).digest();
  return timingSafeEqual(a,b);
}
function originAllowed(req) {
  const origin = req.headers.origin;
  return !origin || origin === ORIGIN;
}
async function githubJson(path) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);
  try {
    const res = await fetch('https://api.github.com/repos/' + REPO + path, {
      headers: { 'Accept':'application/vnd.github+json', 'User-Agent':'specter-ghost-mcp/0.1' },
      signal: controller.signal
    });
    if (!res.ok) throw new Error('GitHub returned ' + res.status);
    return await res.json();
  } finally { clearTimeout(timeout); }
}
function createServer() {
  const mcp = new McpServer({name:'specter-ghost-readonly',version:'0.1.0'});
  mcp.tool('get_project_status','Read-only project overview',{},async()=>({
    content:[{type:'text',text:JSON.stringify({project:'SPECTER-GHOST',mode:'read-only',repository:REPO,hardwareDeployment:'not controlled by MCP'})}]
  }));
  mcp.tool('get_release_status','Read GitHub release metadata',{tag:z.string().regex(/^v[0-9]+\.[0-9]+\.[0-9]+(?:-[a-z0-9.-]+)?$/).default('v0.1.3-candidate')},async({tag})=>{
    try {
      const data=await githubJson('/git/ref/tags/'+encodeURIComponent(tag));
      return {content:[{type:'text',text:JSON.stringify({tag,object:data.object})}]};
    } catch(e){return {isError:true,content:[{type:'text',text:String(e.message)}]};}
  });
  mcp.tool('get_repository_metadata','Read public repository metadata',{},async()=>{
    try {
      const data=await githubJson('');
      return {content:[{type:'text',text:JSON.stringify({full_name:data.full_name,default_branch:data.default_branch,updated_at:data.updated_at,html_url:data.html_url})}]};
    } catch(e){return {isError:true,content:[{type:'text',text:String(e.message)}]};}
  });
  return mcp;
}
const server=http.createServer(async(req,res)=>{
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Content-Type-Options','nosniff');
  if(req.url==='/healthz' && req.method==='GET'){res.writeHead(200,{'Content-Type':'application/json'});res.end('{"ok":true}');return;}
  if(req.url!=='/mcp'){res.writeHead(404);res.end();return;}
  if(!originAllowed(req)){res.writeHead(403);res.end();return;}
  if(!authorized(req)){res.writeHead(401,{'WWW-Authenticate':'Bearer realm="specter-ghost-mcp"'});res.end();return;}
  if(!['POST','GET','DELETE'].includes(req.method)){res.writeHead(405,{'Allow':'POST, GET, DELETE'});res.end();return;}
  if(req.method==='POST' && Number(req.headers['content-length']||0)>65536){res.writeHead(413);res.end();return;}
  const mcp=createServer();
  const transport=new StreamableHTTPServerTransport({sessionIdGenerator:undefined,enableJsonResponse:true});
  try {
    await mcp.connect(transport);
    await transport.handleRequest(req,res);
  } catch(e) {
    console.error('MCP request error:',e?.message);
    if(!res.headersSent){res.writeHead(500);res.end();}
  } finally {
    res.on('close',()=>{void transport.close();void mcp.close();});
  }
});
server.requestTimeout=15000;
server.headersTimeout=10000;
server.listen(PORT,HOST,()=>console.log('MCP listening on '+HOST+':'+PORT));
