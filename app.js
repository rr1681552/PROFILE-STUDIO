const $ = id => document.getElementById(id);
const girlAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=faces";
const boyAvatar = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=faces";
const fields = ["name","role","bio","avatar","email","location","skills","linkedin","github","avatarType"];
let profiles = JSON.parse(localStorage.getItem("profileStudioProfiles") || "[]");
let toastTimer;
function avatarFor(type, custom){ return type === "boy" ? boyAvatar : (type === "custom" && custom ? custom : girlAvatar); }
function currentData(){
  const d={}; fields.forEach(k=>d[k]=$(k).value.trim());
  d.avatar = d.avatar || avatarFor(d.avatarType);
  d.skills = d.skills ? d.skills.split(",").map(x=>x.trim()).filter(Boolean) : [];
  return d;
}
function updatePreview(){
  const d=currentData();
  $("previewName").textContent=d.name||"Your Name";
  $("previewRole").textContent=d.role||"Your professional title";
  $("previewBio").textContent=d.bio||"Your introduction will appear here. Tell people a little about yourself and what you do.";
  $("previewEmail").textContent=d.email?"✉ "+d.email:"✉ Add your email";
  $("previewLocation").textContent=d.location?"⌖ "+d.location:"⌖ Add your location";
  $("previewAvatar").src=avatarFor(d.avatarType,d.avatar);
  $("previewAvatar").onerror=()=>{$("previewAvatar").src=girlAvatar;};
  $("previewSkills").innerHTML="";
  (d.skills.length?d.skills:["Your skills"]).forEach(s=>{const el=document.createElement("span");el.className="skill-chip";el.textContent=s;$("previewSkills").appendChild(el);});
  $("previewSocial").innerHTML="";
  [["LinkedIn",d.linkedin],["GitHub",d.github]].filter(x=>x[1]).forEach(([label,url])=>{const a=document.createElement("a");a.textContent=label;a.href=url;a.target="_blank";a.rel="noopener";$("previewSocial").appendChild(a);});
  if(!$("previewSocial").children.length){$("previewSocial").innerHTML='<span class="social-placeholder">Social links will appear here</span>';}
  $("bioCount").textContent=(d.bio||"").length+" / 220";
}
function notify(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2300);}
function saveStore(){localStorage.setItem("profileStudioProfiles",JSON.stringify(profiles));}
function clearForm(){ $("profileForm").reset();$("profileId").value="";$("submitLabel").textContent="Save Profile";updatePreview();}
function renderProfiles(){
  $("profileCount").textContent=profiles.length+" profile"+(profiles.length===1?"":"s");
  const list=$("savedList");list.innerHTML="";
  if(!profiles.length){list.innerHTML='<div class="empty-state"><span>✧</span><strong>No profiles saved yet</strong><p>Your saved profile cards will appear here.</p></div>';return;}
  profiles.forEach(p=>{
    const card=document.createElement("div");card.className="saved-card";
    const img=document.createElement("img");img.src=p.avatar||girlAvatar;img.alt="";img.onerror=()=>img.src=girlAvatar;
    const info=document.createElement("div");info.className="saved-card-info";
    const name=document.createElement("strong");name.textContent=p.name;
    const role=document.createElement("small");role.textContent=p.role||"Profile";
    info.append(name,role);
    const actions=document.createElement("div");actions.className="saved-actions";
    const edit=document.createElement("button");edit.textContent="Edit";edit.onclick=()=>editProfile(p.id);
    const del=document.createElement("button");del.textContent="Delete";del.className="delete";del.onclick=()=>deleteProfile(p.id);
    actions.append(edit,del);card.append(img,info,actions);list.appendChild(card);
  });
}
function editProfile(id){
  const p=profiles.find(x=>x.id===id);if(!p)return;
  fields.forEach(k=>{if(k==="skills")$(k).value=(p.skills||[]).join(", ");else $(k).value=p[k]||"";});
  $("profileId").value=p.id;$("submitLabel").textContent="Update Profile";updatePreview();
  $("builder").scrollIntoView({behavior:"smooth"});notify("Profile loaded for editing");
}
function deleteProfile(id){if(!confirm("Delete this saved profile?"))return;profiles=profiles.filter(p=>p.id!==id);saveStore();renderProfiles();notify("Profile deleted");}
$("profileForm").addEventListener("submit",e=>{
  e.preventDefault();const d=currentData();if(!d.name){notify("Please enter your name");return;}
  const id=$("profileId").value;
  if(id){profiles=profiles.map(p=>p.id===id?{...d,id}:p);notify("Profile updated successfully");}
  else{profiles.unshift({...d,id:String(Date.now())});notify("Profile saved successfully");}
  saveStore();renderProfiles();clearForm();
});
fields.forEach(k=>$(k).addEventListener("input",updatePreview));
$("avatarType").addEventListener("change",()=>{if($("avatarType").value!=="custom")$("avatar").value="";updatePreview();});
$("resetBtn").addEventListener("click",()=>{clearForm();notify("Form reset");});
$("pdfBtn").addEventListener("click",async()=>{
  if(!$("name").value.trim()){notify("Enter your name before downloading the PDF");return;}
  const button=$("pdfBtn");button.disabled=true;button.textContent="Preparing PDF...";
  try{
    const canvas=await html2canvas($("profileCard"),{scale:2,useCORS:true,backgroundColor:"#ffffff"});
    const img=canvas.toDataURL("image/png");
    const {jsPDF}=window.jspdf;const pdf=new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
    const pageW=210,pageH=297,margin=18,maxW=pageW-margin*2,maxH=pageH-margin*2;
    let w=maxW,h=canvas.height*w/canvas.width;if(h>maxH){h=maxH;w=canvas.width*h/canvas.height;}
    pdf.addImage(img,"PNG",(pageW-w)/2,35,w,h);
    pdf.save(($("name").value.trim().replace(/[^a-z0-9]+/gi,"_")||"profile")+"_Profile.pdf");
    notify("PDF downloaded successfully");
  }catch(err){console.error(err);notify("PDF could not be created. Check your internet connection and try again.");}
  finally{button.disabled=false;button.textContent="↓ Download as PDF";}
});
updatePreview();renderProfiles();