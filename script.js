let username = "";
let swaps = JSON.parse(localStorage.getItem("swaps")) || [];
let editingItem = null;
const itemList = document.getElementById("item-list");
const chatBox = document.getElementById("chat-box");

/* 🌸 Switch pages */
function showPage(pageId){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
}

/* 💕 Login */
function login(){
  username = document.getElementById("username").value.trim();
  if(username) document.getElementById("welcome").innerText = `Welcome to OnlySwaps, ${username}! 💕`;
}

/* 🌷 Category fields */
function updateCategoryFields(){
  const category = document.getElementById("item-category").value;
  const div = document.getElementById("category-fields");
  div.innerHTML = "";
  if(category==="clothes"){
    div.innerHTML=`<label>Material:</label><input id="item-material"/><label>Wear:</label><input id="item-wear"/><label>Colour:</label><input id="item-colour"/>`;
  }else if(category==="books"){
    div.innerHTML=`<label>Genre:</label><input id="item-genre"/><label>Time owned:</label><input id="item-time"/><label>Rating:</label><input id="item-rating"/>`;
  }else if(category==="jewelry"){
    div.innerHTML=`<label>Made from:</label><input id="item-madefrom"/><label>Colour:</label><input id="item-colour"/>`;
  }else if(category==="other"){
    div.innerHTML=`<label>Description:</label><input id="item-desc"/>`;
  }
}

/* 🎀 Add Item */
function addItem(){
  const category=document.getElementById("item-category").value;
  let worth=document.getElementById("item-worth").value.trim();
  const notes=document.getElementById("item-notes").value.trim();
  const file=document.getElementById("item-image").files[0];
  if(!category||!worth||!file){alert("Category, worth & image required!"); return;}
  if(!worth.includes("€")) worth+=" €";

  let extra={};
  if(category==="clothes"){extra={material:document.getElementById("item-material")?.value,wear:document.getElementById("item-wear")?.value,colour:document.getElementById("item-colour")?.value};}
  else if(category==="books"){extra={genre:document.getElementById("item-genre")?.value,time:document.getElementById("item-time")?.value,rating:document.getElementById("item-rating")?.value};}
  else if(category==="jewelry"){extra={madeFrom:document.getElementById("item-madefrom")?.value,colour:document.getElementById("item-colour")?.value};}
  else if(category==="other"){extra={desc:document.getElementById("item-desc")?.value};}

  const reader=new FileReader();
  reader.onload=function(e){
    swaps.push({category,worth,notes,img:e.target.result,...extra});
    localStorage.setItem("swaps",JSON.stringify(swaps));
    renderSwaps(); updateFeatured(); showPopup(swaps[swaps.length-1]); clearForm();
  };
  reader.readAsDataURL(file);
}

/* 🪞 Render */
function createItemCard(item,index){
  const li=document.createElement("li");
  li.setAttribute("data-index",index);
  li.innerHTML=`<img src="${item.img}" class="item-img"/>
  <strong>${item.category}</strong><br>
  ${item.material?`Material:${item.material}<br>`:""}
  ${item.wear?`Wear:${item.wear}<br>`:""}
  ${item.colour?`Colour:${item.colour}<br>`:""}
  ${item.genre?`Genre:${item.genre}<br>`:""}
  ${item.time?`Time:${item.time}<br>`:""}
  ${item.rating?`Rating:${item.rating}<br>`:""}
  ${item.madeFrom?`Made from:${item.madeFrom}<br>`:""}
  ${item.desc?`Description:${item.desc}<br>`:""}
  Worth:${item.worth}<br>
  ${item.notes?`Notes:${item.notes}`:""}
  <div><button onclick="editItem(this)">✏️ Edit</button><button onclick="deleteItem(this)">🗑️ Delete</button></div>`;
  li.onclick=()=>showPopup(item);
  itemList.appendChild(li);
}

function renderSwaps(){itemList.innerHTML="";swaps.forEach((item,index)=>createItemCard(item,index));filterSwaps();}

/* ✏️ Edit/Delete */
function editItem(btn){event.stopPropagation();const li=btn.closest("li");const index=li.getAttribute("data-index");const item=swaps[index];document.getElementById("item-category").value=item.category;updateCategoryFields();if(item.category==="clothes"){document.getElementById("item-material").value=item.material;document.getElementById("item-wear").value=item.wear;document.getElementById("item-colour").value=item.colour;}
else if(item.category==="books"){document.getElementById("item-genre").value=item.genre;document.getElementById("item-time").value=item.time;document.getElementById("item-rating").value=item.rating;}
else if(item.category==="jewelry"){document.getElementById("item-madefrom").value=item.madeFrom;document.getElementById("item-colour").value=item.colour;}
else if(item.category==="other"){document.getElementById("item-desc").value=item.desc;}
document.getElementById("item-worth").value=item.worth;document.getElementById("item-notes").value=item.notes;
editingItem=index;const addBtn=document.querySelector("button[onclick='addItem()']");addBtn.textContent="Save Changes";addBtn.onclick=saveEdit;}

function saveEdit(){if(editingItem===null)return;const category=document.getElementById("item-category").value;let worth=document.getElementById("item-worth").value.trim();if(!worth.includes("€")) worth+=" €";const notes=document.getElementById("item-notes").value.trim();let extra={};if(category==="clothes"){extra={material:document.getElementById("item-material")?.value,wear:document.getElementById("item-wear")?.value,colour:document.getElementById("item-colour")?.value};}else if(category==="books"){extra={genre:document.getElementById("item-genre")?.value,time:document.getElementById("item-time")?.value,rating:document.getElementById("item-rating")?.value};}else if(category==="jewelry"){extra={madeFrom:document.getElementById("item-madefrom")?.value,colour:document.getElementById("item-colour")?.value};}else if(category==="other"){extra={desc:document.getElementById("item-desc")?.value};}swaps[editingItem]={...swaps[editingItem],category,worth,notes,...extra};localStorage.setItem("swaps",JSON.stringify(swaps));renderSwaps();updateFeatured();editingItem=null;clearForm();const addBtn=document.querySelector("button[onclick='saveEdit()']");addBtn.textContent="Add Item";addBtn.onclick=addItem;}

function deleteItem(btn){event.stopPropagation();const li=btn.closest("li");const index=li.getAttribute("data-index");if(confirm("Delete this item?")){swaps.splice(index,1);localStorage.setItem("swaps",JSON.stringify(swaps));renderSwaps();updateFeatured();}}

/* 🌟 Featured */
function updateFeatured(){
  const fc=document.getElementById("featured-card");
  if(!swaps.length){fc.innerHTML=`<p>✨ Add your first swap to see it featured here!</p>`; fc.onclick=null; return;}
  const randomItem=swaps[Math.floor(Math.random()*swaps.length)];
  fc.innerHTML=`<img src="${randomItem.img}" /><strong>${randomItem.category.toUpperCase()}</strong><br>${randomItem.worth}`;
  fc.onclick=()=>showPopup(randomItem);
}

/* 🌸 Popup */
function showPopup(item){
  document.getElementById("popup-img").src=item.img;
  let info=`<strong>${item.category.toUpperCase()}</strong><br>Worth: ${item.worth}<br>`;
  if(item.material) info+=`Material: ${item.material}<br>`;
  if(item.wear) info+=`Wear: ${item.wear}<br>`;
  if(item.colour) info+=`Colour: ${item.colour}<br>`;
  if(item.genre) info+=`Genre: ${item.genre}<br>`;
  if(item.time) info+=`Time: ${item.time}<br>`;
  if(item.rating) info+=`Rating: ${item.rating}<br>`;
  if(item.madeFrom) info+=`Made from: ${item.madeFrom}<br>`;
  if(item.desc) info+=`Description: ${item.desc}<br>`;
  if(item.notes) info+=`Notes: ${item.notes}<br>`;
  document.getElementById("popup-info").innerHTML=info;
  document.getElementById("popup").style.display="flex";
}

function closePopup(){document.getElementById("popup").style.display="none";}

/* 🌸 Filter */
function filterSwaps(){
  const val=document.getElementById("filter-category").value;
  itemList.innerHTML="";
  const filtered=val==="all"?swaps:swaps.filter(s=>s.category===val);
  if(!filtered.length){itemList.innerHTML="<p style='text-align:center;color:#d45b7a;'>No swaps found</p>"; return;}
  filtered.forEach((item,index)=>createItemCard(item,index));
}

/* 🌸 Clear form */
function clearForm(){
  document.getElementById("item-category").value="";
  document.getElementById("item-worth").value="";
  document.getElementById("item-notes").value="";
  document.getElementById("item-image").value="";
  document.getElementById("category-fields").innerHTML="";
}

/* 💬 Chat */
function sendMessage(){
  const msg=document.getElementById("chat-input").value.trim();
  if(!msg) return;
  const div=document.createElement("div");
  div.innerHTML=`<strong>${username||"Anon"}:</strong> ${msg}`;
  chatBox.appendChild(div);
  chatBox.scrollTop=chatBox.scrollHeight;
  document.getElementById("chat-input").value="";
}

/*
