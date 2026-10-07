import os,secrets,time,threading
from dataclasses import dataclass
from typing import Dict
from fastapi import FastAPI,HTTPException
from pydantic import BaseModel,Field
try:
 import docker
except Exception:
 docker=None

app=FastAPI(title="SPECTER.GHOST Range Controller",version="0.1.0")
ALLOWED={"ghost-protocol":{"image":"specter/demo-target:local","port":8080}}
MAX_TTL=int(os.getenv("SPECTER_MAX_TTL_MINUTES","60"))
DRY_RUN=os.getenv("SPECTER_DRY_RUN","1")!="0"
@dataclass
class Instance:
 id:str;challenge:str;created:int;expires:int;status:str;endpoint:str|None=None;container_id:str|None=None
instances:Dict[str,Instance]={}
class Deploy(BaseModel):
 challenge:str
 ttlMinutes:int=Field(default=30,ge=5,le=60)
def view(i:Instance):
 return {"id":i.id,"challenge":i.challenge,"created":i.created,"expires":i.expires,"status":i.status,"endpoint":i.endpoint}
def client():
 if DRY_RUN:return None
 if docker is None:raise HTTPException(503,"docker sdk unavailable")
 return docker.from_env()
def destroy(i:Instance):
 if i.container_id and not DRY_RUN:
  try:
   c=client().containers.get(i.container_id);c.remove(force=True)
  except Exception:pass
 i.status="stopped";i.endpoint=None
def reap():
 while True:
  now=int(time.time())
  for i in list(instances.values()):
   if i.status=="running" and i.expires<=now:destroy(i)
  time.sleep(15)
threading.Thread(target=reap,daemon=True).start()

@app.get("/health")
def health():return {"ok":True,"service":"specter-range-controller","dryRun":DRY_RUN,"instances":sum(i.status=="running" for i in instances.values())}

@app.get("/v1/instances")
def list_instances():return [view(i) for i in instances.values()]

@app.get("/v1/instances/{iid}")
def get_instance(iid:str):
 i=instances.get(iid)
 if not i:raise HTTPException(404,"instance not found")
 return view(i)

@app.post("/v1/instances",status_code=201)
def deploy(req:Deploy):
 spec=ALLOWED.get(req.challenge)
 if not spec:raise HTTPException(404,"challenge not deployable")
 iid="sg-"+secrets.token_hex(6);now=int(time.time());ttl=min(req.ttlMinutes,MAX_TTL)
 i=Instance(iid,req.challenge,now,now+ttl*60,"starting");instances[iid]=i
 if DRY_RUN:
  i.status="running";i.endpoint=f"/range/{iid}/"
 else:
  c=client().containers.run(spec["image"],detach=True,network="specter_range",read_only=True,mem_limit="128m",nano_cpus=500_000_000,pids_limit=64,cap_drop=["ALL"],security_opt=["no-new-privileges:true"],labels={"specter.instance":iid,"specter.challenge":req.challenge})
  i.container_id=c.id;i.status="running";i.endpoint=f"/range/{iid}/"
 return view(i)

@app.delete("/v1/instances/{iid}")
def stop(iid:str):
 i=instances.get(iid)
 if not i:raise HTTPException(404,"instance not found")
 destroy(i);return view(i)
