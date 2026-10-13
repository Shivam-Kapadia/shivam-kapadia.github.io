import * as THREE from 'three';

// Everything in the city is procedural geometry; no remote models or textures.
const INK = 0x202c30, PAPER = 0xf4f0e5, RED = 0xe63032;
const stops = [
  {x:0,z:0,h:43,label:'QUEENS',sub:'THE ORIGIN STORY',color:0xbb7261},
  {x:65,z:-155,h:72,label:'METER',sub:'IDEAS WITH RESPONSIBILITY',color:0x768e90},
  {x:-25,z:-310,h:98,label:'OSCORP',sub:'RESEARCH & DEVELOPMENT',color:0x75968b},
  {x:65,z:-465,h:66,label:'DAILY BUGLE',sub:'THE DAILY BUILD',color:0xba7665},
  {x:-15,z:-635,h:64,label:'BROOKLYN',sub:'CONNECTING WORLDS',color:0xc2b19a},
  {x:70,z:-800,h:43,label:'UNDER THE MASK',sub:'SHIVAM VIPUL KAPADIA',color:0xc4a686},
  {x:0,z:-955,h:68,label:'TO BE CONTINUED',sub:'YOUR NEXT GREAT TEAM-UP',color:0x879897}
];

export function createCity(container, state) {
  const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true, powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setClearColor(0xdde3d9, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xe5e6d9, 165, 490);
  const camera = new THREE.PerspectiveCamera(36, 1, 1, 650);
  scene.add(new THREE.HemisphereLight(0xfff6df, 0x526b73, 2.6));
  const sun = new THREE.DirectionalLight(0xffedc8, 3.0);
  sun.position.set(-100,190,100); scene.add(sun);
  const rim = new THREE.DirectionalLight(0xbcdbe0, 1.2);
  rim.position.set(100,60,-80); scene.add(rim);

  let seed=17;
  const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const mat = (color, opts={}) => new THREE.MeshStandardMaterial({color,roughness:1,metalness:0,...opts});
  const ink=mat(INK), roofMat=mat(0x637778), red=mat(RED), cream=mat(PAPER), roadMat=mat(0x82908b), yellow=mat(0xf3c24a);
  const lineMat=new THREE.LineBasicMaterial({color:INK,transparent:true,opacity:.62});
  const cube=new THREE.BoxGeometry(1,1,1);
  const cubeEdges=new THREE.EdgesGeometry(cube);
  function box(parent,w,h,d,x,y,z,material,outline=false){
    const mesh=new THREE.Mesh(cube,material);mesh.scale.set(w,h,d);mesh.position.set(x,y,z);parent.add(mesh);
    if(outline){const edge=new THREE.LineSegments(cubeEdges,lineMat);mesh.add(edge);}
    return mesh;
  }
  function rod(parent,a,b,r,material=ink){
    const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),delta=end.clone().sub(start);
    const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,delta.length(),6),material);
    mesh.position.copy(start).add(end).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());parent.add(mesh);return mesh;
  }
  function line(parent,points,color=INK){
    const geometry=new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(...p)));
    const mesh=new THREE.Line(geometry,new THREE.LineBasicMaterial({color}));parent.add(mesh);return mesh;
  }
  function facade(color,variant=0){
    const canvas=document.createElement('canvas');canvas.width=256;canvas.height=512;
    const ctx=canvas.getContext('2d');ctx.fillStyle='#'+color.toString(16).padStart(6,'0');ctx.fillRect(0,0,256,512);
    for(let y=0;y<512;y+=32){ctx.strokeStyle='rgba(24,41,43,.22)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(256,y);ctx.stroke();
      for(let x=0;x<256;x+=32){ctx.beginPath();ctx.moveTo(x+(y%64?16:0),y);ctx.lineTo(x+(y%64?16:0),y+32);ctx.stroke();}}
    for(let y=22;y<500;y+=52)for(let x=15;x<250;x+=45){
      ctx.fillStyle='#263f45';ctx.fillRect(x,y,27,34);ctx.fillStyle=rand()>.76?'#e7d7a2':variant===1?'#94b1a3':'#9faeaa';ctx.fillRect(x+3,y+3,21,27);
      ctx.fillStyle='rgba(28,49,52,.5)';ctx.fillRect(x+13,y+2,2,29);ctx.fillRect(x+2,y+16,23,2);ctx.fillStyle='#c6c6b2';ctx.fillRect(x-1,y+33,29,3);
    }
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;
    return mat(0xffffff,{map:texture});
  }
  const facades=[facade(0x9ba9a0),facade(0xb9b5a2),facade(0xa8b9b0),facade(0xba8b77),facade(0x73968d,1),facade(0x718d97)];
  function building(parent,x,z,w,d,h,material,detail=false){
    box(parent,w,h,d,x,h/2,z,material,true);
    box(parent,w+1.1,1.1,d+1.1,x,h,z,roofMat,true);
    // Rooftop parapets make the buildings read as architecture, not blocks.
    box(parent,w+1,1.8,.65,x,h+1,z+d/2,cream);
    box(parent,w+1,1.8,.65,x,h+1,z-d/2,cream);
    if(detail){
      box(parent,.65,1.8,d,x-w/2,h+1,z,cream);box(parent,.65,1.8,d,x+w/2,h+1,z,cream);
      box(parent,w*.25,3.5,d*.25,x+w*.2,h+2.6,z-d*.2,roofMat,true);
      for(let a=0;a<2;a++){const fan=new THREE.Mesh(new THREE.CylinderGeometry(1.7,1.7,.4,12),ink);fan.position.set(x+w*.2+a*4,h+4.5,z-d*.2);parent.add(fan);}
      for(let y=7;y<h-5;y+=8){box(parent,5,.35,2.5,x-w*.22,y,z+d*.5+1,ink);rod(parent,[x-w*.22-2,y,z+d*.5+2],[x-w*.22+2,y+8,z+d*.5+2],.12);}
    }
  }
  function sign(parent,text,sub,w,h,x,y,z,bg='#f4f0e5',fg='#202c30',rotation=.25){
    const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=384;
    const ctx=canvas.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,1024,384);ctx.strokeStyle=fg;ctx.lineWidth=15;ctx.strokeRect(10,10,1004,364);
    ctx.fillStyle=fg;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='900 115px "Arial Narrow", Impact, sans-serif';
    ctx.fillText(text,512,157,925);ctx.fillRect(70,250,884,3);ctx.font='bold 28px monospace';ctx.fillText(sub,512,306,885);
    const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide}));mesh.position.set(x,y,z);mesh.rotation.y=rotation;parent.add(mesh);
    rod(parent,[x-w*.35,y-h/2-8,z],[x-w*.35,y-h/2,z],.3);rod(parent,[x+w*.35,y-h/2-8,z],[x+w*.35,y-h/2,z],.3);
    return mesh;
  }
  function waterTank(parent,x,y,z){
    for(const dx of [-2.8,2.8])for(const dz of [-2.8,2.8])rod(parent,[x+dx,y,z+dz],[x+dx,y+6,z+dz],.22);
    const tank=new THREE.Mesh(new THREE.CylinderGeometry(4.4,4.4,8,12),mat(0x8c6a50));tank.position.set(x,y+10,z);parent.add(tank);
    for(let a=0;a<3;a++){const ring=new THREE.Mesh(new THREE.TorusGeometry(4.45,.14,4,16),ink);ring.rotation.x=Math.PI/2;ring.position.set(x,y+7+a*2.5,z);parent.add(ring);}
    const top=new THREE.Mesh(new THREE.ConeGeometry(5,3,12),ink);top.position.set(x,y+15.5,z);parent.add(top);
  }
  const districts=[];
  for(let i=0;i<stops.length;i++){
    const s=stops[i],g=new THREE.Group();g.position.set(s.x,0,s.z);scene.add(g);districts.push(g);
    if(i!==4){
      box(g,170,2,140,0,-1,0,mat(0xc5c9b8));
      box(g,170,.12,15,0,.08,38,roadMat);box(g,16,.12,140,-33,.1,0,roadMat);
      for(let n=-7;n<8;n++){box(g,4,.16,.35,n*11,.2,38,cream);box(g,.35,.16,4,-33,.2,n*11,cream);}
      for(let n=0;n<14;n++){
        const x=(n%5-2)*34+(rand()-.5)*5,z=-28-Math.floor(n/5)*37;
        if(Math.abs(x)<25&&Math.abs(z)<50)continue;
        building(g,x,z,15+rand()*10,16+rand()*10,15+rand()*45,facades[Math.floor(rand()*facades.length)]);
      }
      building(g,62,14,25,23,28+rand()*25,facades[1]);building(g,-65,13,24,26,20+rand()*25,facades[3]);
      // Taxi cabs and street markings provide a human scale.
      for(let n=0;n<4;n++){const x=-70+n*40;box(g,5,1.4,2.5,x,1,37+(n%2?3:-3),yellow,true);box(g,2.5,1,2.2,x,2.1,37+(n%2?3:-3),ink);}
    }
    if(i===0){
      building(g,0,0,34,29,s.h,facades[3],true);waterTank(g,-8,s.h+1,-5);
      sign(g,'QUEENS','EVERY HERO STARTS SOMEWHERE',25,9,12,s.h+9,3);
      sign(g,'HELLO, WORLD.','A SHIVAM KAPADIA ORIGINAL',24,9,-61,43,27,'#e63032','#fff5df',.25);
      sign(g,'PIZZA TIME.','YOUR FRIENDLY NEIGHBORHOOD SLICE',17,6,60,18,27,'#edc657','#202c30',.25);
    }else if(i===1){
      building(g,0,0,32,29,s.h,facades[5],true);building(g,0,-2,23,21,s.h+9,facades[5]);
      sign(g,'METER','HUMAN-APPROVED. AGENT-POWERED.',34,13,0,s.h+20,-8,'#e63032','#fff5df');
      box(g,36,2,32,0,35,0,cream,true);box(g,36,2,32,0,56,0,cream,true);
    }else if(i===2){
      building(g,0,0,38,34,54,facades[4],true);building(g,0,-2,30,29,78,facades[4]);building(g,0,-4,22,23,s.h,facades[4]);
      for(let h=12;h<99;h+=13)box(g,h<54?39:h<78?31:23,1.3,h<54?35:h<78?30:24,0,h,h<54?0:h<78?-2:-4,cream,true);
      sign(g,'OSCORP','THE FUTURE IS UNDER CONSTRUCTION',36,12,0,108,-8,'#b7d29a','#203932');
      rod(g,[0,98,-5],[0,132,-5],.45);const beacon=new THREE.Mesh(new THREE.SphereGeometry(1.1,8,6),red);beacon.position.set(0,132,-5);g.add(beacon);
    }else if(i===3){
      building(g,0,0,39,29,s.h,facades[3],true);building(g,0,-3,25,20,s.h+12,facades[3]);
      sign(g,'DAILY BUGLE','ALL THE CODE THAT FITS TO SHIP',43,15,0,s.h+27,-8,'#e63032','#fff5df');
      waterTank(g,-13,s.h+1,-8);sign(g,'WEB DEVELOPER?','YES. LITERALLY.',24,10,61,55,24);
    }else if(i===4){
      box(g,280,1,190,0,-1,0,mat(0x85aead,{transparent:true,opacity:.85}));
      for(let n=0;n<27;n++)box(g,8+rand()*18,.05,.25,(rand()-.5)*270,.1,(rand()-.5)*170,cream);
      box(g,255,2.2,19,0,19,0,roadMat,true);box(g,255,1,1,0,21,10,cream);box(g,255,1,1,0,21,-10,cream);
      for(const x of [-57,57]){
        for(const z of [-10,10]){box(g,7,78,7,x,39,z,mat(0xb6a68d),true);box(g,10,3,10,x,80,z,cream,true);}
        box(g,7,6,27,x,62,0,mat(0xb6a68d),true);box(g,7,5,27,x,76,0,mat(0xb6a68d),true);
      }
      for(const z of [-10,10]){
        const points=[];
        for(let x=-128;x<=128;x+=4){const y=Math.abs(x)<=57?33+45*Math.pow(x/57,2):78-(Math.abs(x)-57)*.72;points.push([x,y,z]);if(x%8===0)rod(g,[x,21,z],[x,y,z],.12,ink);}
        line(g,points,0x354647);
      }
      for(let x=-120;x<=120;x+=14)box(g,6,.1,.35,x,20.2,0,cream);
      sign(g,'BROOKLYN','BUILD CONNECTIONS THAT LAST',34,11,56,92,11);
      for(const side of [-1,1])for(let n=0;n<5;n++)building(g,side*(155+n*25),-35-n*9,20,24,18+rand()*44,facades[n%6]);
    }else if(i===5){
      building(g,0,0,42,35,s.h,facades[1],true);waterTank(g,11,s.h+1,-6);
      sign(g,'UNDER THE MASK','ENGINEER. STUDENT. HUMAN.',37,12,-4,s.h+15,-8);
      box(g,7,1.8,3,-10,s.h+3,2,red,true);rod(g,[-12,s.h+1,2],[-12,s.h+3,2],.2);rod(g,[-8,s.h+1,2],[-8,s.h+3,2],.2);
    }else{
      building(g,0,0,33,29,s.h,facades[5],true);
      sign(g,'TO BE CONTINUED','LET’S BUILD THE NEXT CHAPTER.',44,15,0,s.h+19,-8,'#e63032','#fff5df');
      const tower=new THREE.Group();tower.position.set(-12,s.h,-7);g.add(tower);
      rod(tower,[0,0,0],[0,30,0],.4);for(let y=8;y<28;y+=7)rod(tower,[-5,y,0],[5,y,0],.18);
    }
  }
  // Far skyline: one instanced draw call, with a soft paper-colored atmospheric fade.
  const far=new THREE.InstancedMesh(cube,mat(0x98aeaa),170),dummy=new THREE.Object3D();
  for(let i=0;i<170;i++){dummy.position.set((rand()-.5)*620,0,-160-rand()*330);const h=20+rand()*64;dummy.position.y=h/2;dummy.scale.set(14+rand()*20,h,16+rand()*20);dummy.updateMatrix();far.setMatrixAt(i,dummy.matrix);}far.instanceMatrix.needsUpdate=true;scene.add(far);

  // A hand-built, articulated red-and-blue web-slinger.
  const hero=new THREE.Group();scene.add(hero);
  const rig=new THREE.Group();hero.add(rig);
  const suitCanvas=document.createElement('canvas');suitCanvas.width=256;suitCanvas.height=256;
  const sc=suitCanvas.getContext('2d');sc.fillStyle='#e63032';sc.fillRect(0,0,256,256);sc.strokeStyle='#732c32';sc.lineWidth=2;
  for(let x=0;x<=256;x+=32){sc.beginPath();sc.moveTo(x,0);sc.lineTo(x,256);sc.stroke();}
  for(let y=0;y<=256;y+=32){sc.beginPath();for(let x=0;x<=256;x+=8){const yy=y+Math.sin(x/32*Math.PI)*5;x?sc.lineTo(x,yy):sc.moveTo(x,yy);}sc.stroke();}
  const suitTexture=new THREE.CanvasTexture(suitCanvas);suitTexture.colorSpace=THREE.SRGBColorSpace;
  const redSuit=mat(0xffffff,{map:suitTexture}),blueSuit=mat(0x244b67),blackSuit=mat(0x142a36);
  const sphere=new THREE.SphereGeometry(1,16,12);
  function ellipsoid(parent,material,x,y,z,sx,sy,sz){const mesh=new THREE.Mesh(sphere,material);mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);parent.add(mesh);return mesh;}
  ellipsoid(rig,blueSuit,0,-.2,0,1.25,1.4,.75);
  ellipsoid(rig,redSuit,0,1.65,0,1.7,2.1,.95);
  const head=new THREE.Group();head.position.set(0,4.5,.1);rig.add(head);
  ellipsoid(head,redSuit,0,0,0,1.15,1.48,1.08);
  function eye(side){
    const s=new THREE.Shape();s.moveTo(side*.15,.25);s.lineTo(side*.98,.72);s.quadraticCurveTo(side*1.04,-.25,side*.55,-.45);s.quadraticCurveTo(side*.24,-.36,side*.15,.25);
    const outline=new THREE.Mesh(new THREE.ShapeGeometry(s),new THREE.MeshBasicMaterial({color:INK,side:THREE.DoubleSide}));outline.position.z=.99;head.add(outline);
    const white=new THREE.Mesh(new THREE.ShapeGeometry(s),new THREE.MeshBasicMaterial({color:0xfffaea,side:THREE.DoubleSide}));white.scale.set(.76,.74,1);white.position.set(side*.11,.02,1.015);head.add(white);
  }eye(-1);eye(1);
  // Chest emblem, drawn as actual small geometry.
  ellipsoid(rig,blackSuit,0,1.8,.97,.2,.45,.055);
  for(const side of [-1,1])for(let j=0;j<4;j++)line(rig,[[side*.08,1.9-j*.12,1.01],[side*.5,2.4-j*.39,1.02],[side*.7,2.7-j*.58,1.02]],0x142a36);
  function limb(parent,x,y,z,upperLength,lowerLength,upperMat,lowerMat,radius){
    const pivot=new THREE.Group();pivot.position.set(x,y,z);parent.add(pivot);
    ellipsoid(pivot,upperMat,0,-upperLength/2,0,radius,upperLength/2+.18,radius);
    const joint=new THREE.Group();joint.position.y=-upperLength;pivot.add(joint);
    ellipsoid(joint,lowerMat,0,-lowerLength/2,0,radius*.85,lowerLength/2+.22,radius*.85);
    ellipsoid(joint,lowerMat,0,-lowerLength-.2,.16,radius*.86,.55,radius*1.15);
    return {pivot,joint,length:lowerLength};
  }
  const armL=limb(rig,-1.6,2.7,0,2.2,2.1,redSuit,redSuit,.47),armR=limb(rig,1.6,2.7,0,2.2,2.1,redSuit,redSuit,.47);
  const legL=limb(rig,-.75,-1,0,2.9,2.6,blueSuit,redSuit,.66),legR=limb(rig,.75,-1,0,2.9,2.6,blueSuit,redSuit,.66);
  hero.scale.setScalar(1.8);
  const webGeo=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3(),new THREE.Vector3()]);
  const web=new THREE.Line(webGeo,new THREE.LineBasicMaterial({color:0xfff9e9}));scene.add(web);
  const webDark=new THREE.Line(webGeo,new THREE.LineBasicMaterial({color:0x647d80,transparent:true,opacity:.25}));scene.add(webDark);webDark.position.x=.15;
  const hand=new THREE.Vector3(),position=new THREE.Vector3(),target=new THREE.Vector3(),camPosition=new THREE.Vector3();
  const landingPoints=stops.map((s,i)=>new THREE.Vector3(s.x+(i===4?-57:-9),s.h+(i===4?31:12),s.z+(i===4?10:14)));
  const focusPoints=stops.map(s=>new THREE.Vector3(s.x,s.h*.85+10,s.z));
  let width=0,height=0,mobile=false,smoothed=state.progress||0,last=0,time=0,frame=0,disposed=false;
  let pointerX=0,pointerY=0,lastPaint=-1;
  function resize(){width=innerWidth;height=innerHeight;mobile=width<=700;renderer.setSize(width,height);camera.aspect=width/height;
    camera.setViewOffset(width,height,mobile?-width*.02:-width*.22,mobile?height*.24:0,width,height);camera.updateProjectionMatrix();lastPaint=-1;}
  function pointer(e){pointerX=(e.clientX/width-.5)*2;pointerY=(e.clientY/height-.5)*2;}
  window.addEventListener('resize',resize);window.addEventListener('pointermove',pointer,{passive:true});resize();
  const clamp=THREE.MathUtils.clamp,lerp=THREE.MathUtils.lerp;
  const swingCaption=document.querySelector('#swing-caption');
  let wasSwinging=false;
  function render(now){
    if(disposed)return;
    frame=requestAnimationFrame(render);
    if(document.hidden){last=now;return;}
    const dt=Math.min((now-last)/1000,.12)||.016;last=now;
    const paused=state.paused||state.reduced;
    if(!paused)time+=dt;
    const desired=clamp(state.progress,0,6);
    smoothed=paused?Math.round(desired):lerp(smoothed,desired,1-Math.exp(-dt*7));
    if(paused&&lastPaint===smoothed&&!state.dirty)return;
    state.dirty=false;lastPaint=smoothed;state.renderProgress=smoothed;
    const index=Math.min(5,Math.floor(smoothed)),raw=smoothed-index;
    const t=clamp((raw-.12)/.76,0,1),ease=t*t*(3-2*t),arc=Math.sin(t*Math.PI);
    const swinging=!paused&&arc>.72;
    if(swinging!==wasSwinging){swingCaption?.classList.toggle('in-flight',swinging);wasSwinging=swinging;}
    target.copy(focusPoints[index]).lerp(focusPoints[index+1],ease);target.y+=arc*24;
    const angle=.59+Math.sin(smoothed*.95)*.12;
    const bridgeZoom=Math.max(0,1-Math.abs(smoothed-4)*2);
    if(mobile){target.x-=bridgeZoom*48;target.y+=bridgeZoom*16;}
    const distance=(mobile?255:190)+bridgeZoom*50;
    camPosition.set(target.x+Math.sin(angle)*distance+(paused?0:pointerX*2),target.y+distance*.49+arc*13+(paused?0:pointerY*1.4),target.z+Math.cos(angle)*distance);
    camera.position.copy(camPosition);camera.lookAt(target);
    position.copy(landingPoints[index]).lerp(landingPoints[index+1],ease);position.y+=arc*40;
    hero.position.copy(position);hero.rotation.set(0,angle+(arc*.5),paused?0:-arc*.4);
    rig.rotation.x=-.08-arc*.38;rig.position.y=paused?0:Math.sin(time*2)*.18;
    head.rotation.z=paused?0:Math.sin(time)*.05;
    armL.pivot.rotation.set(-.2-arc*.7,0,-.5-arc*2.1);armL.joint.rotation.x=-.5-arc*.2;
    armR.pivot.rotation.set(-.4-arc*.5,0,.9+arc*.1);armR.joint.rotation.x=-1.1;
    legL.pivot.rotation.set(-.6-arc*.7,0,-.25);legL.joint.rotation.x=.9+arc*.9;
    legR.pivot.rotation.set(.3+arc*.25,0,.3);legR.joint.rotation.x=.3+arc*.6;
    hero.updateMatrixWorld(true);armL.joint.localToWorld(hand.set(0,-armL.length-.3,0));
    const webAnchor=landingPoints[Math.min(index+1,6)].clone();webAnchor.y+=48;webAnchor.x-=20;
    const arr=webGeo.attributes.position.array;
    arr[0]=hand.x;arr[1]=hand.y;arr[2]=hand.z;arr[3]=(hand.x+webAnchor.x)/2;arr[4]=(hand.y+webAnchor.y)/2-arc*4;arr[5]=(hand.z+webAnchor.z)/2;arr[6]=webAnchor.x;arr[7]=webAnchor.y;arr[8]=webAnchor.z;
    webGeo.attributes.position.needsUpdate=true;webGeo.computeBoundingSphere();web.visible=webDark.visible=arc>.04;
    far.position.set(target.x,0,target.z);
    districts.forEach((g,i)=>{g.visible=Math.abs(i-smoothed)<.95;});
    renderer.render(scene,camera);
    state.rendered=true;
  }
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();state.contextLost=true;container.dispatchEvent(new Event('citylost'));});
  renderer.domElement.addEventListener('webglcontextrestored',()=>{state.contextLost=false;state.dirty=true;lastPaint=-1;container.dispatchEvent(new Event('cityrestored'));});
  frame=requestAnimationFrame(render);
  return {renderer,scene,camera,hero,stops,dispose(){disposed=true;cancelAnimationFrame(frame);window.removeEventListener('resize',resize);window.removeEventListener('pointermove',pointer);scene.traverse(obj=>{obj.geometry?.dispose();if(obj.material){for(const material of Array.isArray(obj.material)?obj.material:[obj.material]){material.map?.dispose();material.dispose();}}});renderer.dispose();renderer.domElement.remove();}};
}
