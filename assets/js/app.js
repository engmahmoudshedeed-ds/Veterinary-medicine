(() => {
 const data = window.PATHOLOGY_DATA;
 const $ = (id) => document.getElementById(id);
 $("introText").textContent = data.intro;
 $("conclusionText").textContent = data.conclusion;
 const groups = {infectious:$("infectiousGrid"), inflammatory:$("inflammatoryGrid"), parasitic:$("parasiticGrid")};
 const shortText = (d) => {
   const first = d.sections.find(s => /Definition|Hosts|Clinical Features/i.test(s.heading));
   return first ? first.items.join(" ").slice(0,155) + (first.items.join(" ").length>155 ? "…" : "") : "Explore the disease profile and pathological findings.";
 };
 data.diseases.forEach(d => {
   const card = document.createElement("article");
   card.className = "disease-card";
   card.dataset.search = (d.title+" "+d.sections.map(s=>s.heading+" "+s.items.join(" ")).join(" ")).toLowerCase();
   card.innerHTML = `<span class="number">DISEASE ${String(d.number).padStart(2,"0")}</span><h3></h3><p></p><button type="button">View Details →</button>`;
   card.querySelector("h3").textContent = d.title;
   card.querySelector("p").textContent = shortText(d);
   card.querySelector("button").addEventListener("click",()=>openDisease(d));
   groups[d.category].appendChild(card);
 });
 data.images.forEach((im,i)=>{
   const b=document.createElement("button"); b.className="gallery-item"; b.type="button";
   b.innerHTML=`<img loading="lazy" src="${im.src}" alt="${im.title}"><strong>${im.title}</strong><small>${im.original} · Local image</small>`;
   b.addEventListener("click",()=>openImage(im));
   $("galleryGrid").appendChild(b);
 });
 data.references.forEach(ref=>{const li=document.createElement("li");li.textContent=ref;$("referenceList").appendChild(li)});
 function openDisease(d){
   $("modalCategory").textContent=d.categoryLabel;
   $("modalTitle").textContent=d.title;
   const body=$("modalBody");body.innerHTML="";
   d.sections.forEach(s=>{
     const sec=document.createElement("section");sec.className="modal-section";
     const h=document.createElement("h3");h.textContent=s.heading;sec.appendChild(h);
     const list=document.createElement("ul");
     s.items.forEach(item=>{const li=document.createElement("li");li.textContent=item;list.appendChild(li)});
     sec.appendChild(list);body.appendChild(sec);
   });
   $("diseaseModal").classList.add("open");$("diseaseModal").setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
   $("modalBox")?.focus();
 }
 function openImage(im){
   $("lightboxImage").src=im.src;$("lightboxImage").alt=im.title;$("lightboxCaption").textContent=im.title+" — "+im.caption;
   $("lightbox").classList.add("open");$("lightbox").setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
 }
 function closeOverlays(){document.querySelectorAll(".modal.open,.lightbox.open").forEach(x=>{x.classList.remove("open");x.setAttribute("aria-hidden","true")});document.body.style.overflow=""}
 document.querySelectorAll("[data-close]").forEach(x=>x.addEventListener("click",closeOverlays));
 document.querySelectorAll("[data-lightbox-close]").forEach(x=>x.addEventListener("click",closeOverlays));
 document.addEventListener("keydown",e=>{if(e.key==="Escape")closeOverlays()});
 $("menuToggle").addEventListener("click",()=>{const nav=$("mainNav");const open=nav.classList.toggle("open");$("menuToggle").setAttribute("aria-expanded",String(open))});
 $("mainNav").querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{$("mainNav").classList.remove("open");$("menuToggle").setAttribute("aria-expanded","false")}));
 function runSearch(){
   const q=$("searchInput").value.trim().toLowerCase();let count=0;
   document.querySelectorAll(".disease-card").forEach(c=>{const match=!q||c.dataset.search.includes(q);c.style.display=match?"flex":"none";if(match)count++});
   if(q){$("toast").textContent=count?`${count} matching disease profile(s)`:"No matching disease found in the source document";$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),2400)}
 }
 $("searchForm").addEventListener("submit",e=>{e.preventDefault();runSearch()});
 $("searchInput").addEventListener("input",runSearch);
})();