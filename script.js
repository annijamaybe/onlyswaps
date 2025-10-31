let username = "";
let swaps = JSON.parse(localStorage.getItem("swaps")) || [];
let editingItem = null;
let chatBox = document.getElementById("chat-box");

/* 🌷 Switch between pages */
function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
}

/* 💕 Login */
function login() {
  username = document.getElementById("username").value.trim();
  if (username) {
    document.getElementById("welcome").innerText = `Welcome to OnlySwaps, ${username}! 💕`;
    localStorage.setItem("username", username);
    alert(`Logged in as ${username}`);
  }
}

/* 🌸 Category-specific questions */
function updateCategoryFields() {
  const category = document.getElementById("item-category").value;
  const fieldsDiv = document.getElementById("category-fields");
  fieldsDiv.innerHTML = "";

  if (category === "clothes") {
    fieldsDiv.innerHTML = `
      <label>Material:</label><input id="item-material" placeholder="e.g. cotton, denim" />
      <label>How worn out is it?</label><input id="item-wear" placeholder="e.g. barely used" />
      <label>Colour:</label><input id="item-colour" placeholder="e.g. pastel pink" />
    `;
  } else if (category === "books") {
    fieldsDiv.innerHTML = `
      <label>Genre:</label><input id="item-genre" placeholder="e.g. fantasy" />
      <label>How long have you had it?</label><input id="item-time" placeholder="e.g. 2 years" />
      <label>Personal rating:</label><input id="item-rating" placeholder="e.g. 8/10" />
    `;
  } else if (category === "jewelry") {
    fieldsDiv.innerHTML = `
      <label>Made from:</label><input id="item-madefrom" placeholder="e.g. silver" />
      <label>Colour:</label><input id="item-colour" placeholder="e.g. gold" />
    `;
  } else if (category === "other") {
    fieldsDiv.innerHTML = `
      <label>Description:</label><input id="item-desc" placeholder="Describe your item" />
    `;
  }
}

/* 🎀 Add new item */
function addItem() {
  const category = document.getElementById("item-category").value;
  let worth = document.getElementById("item-worth").value.trim();
  if (worth && !worth.includes("€")) worth = worth + " €";
  const notes = document.getElementById("item-notes").value.trim();
  const file = document.getElementById("item-image").files[0];

  if (!category || !worth || !file) {
    alert("Please select category, add worth, and upload an image!");
    return;
  }

  let extraData = {};
  if (category === "clothes") {
    extraData = {
      material: document.getElementById("item-material")?.value.trim(),
      wear: document.getElementById("item-wear")?.value.trim(),
      colour: document.getElementById("item-colour")?.value.trim()
    };
  } else if (category === "books") {
    extraData = {
      genre: document.getElementById("item-genre")?.value.trim(),
      time: document.getElementById("item-time")?.value.trim(),
      rating: document.getElementById("item-rating")?.value.trim()
    };
  } else if (category === "jewelry") {
    extraData = {
      madeFrom: document.getElementById("item-madefrom")?.value.trim(),
      colour: document.getElementById("item-colour")?.value.trim()
    };
  } else if (category === "other") {
    extraData = { desc: document.getElementById("item-desc")?.value.trim() };
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const itemData = { category, worth, notes, img: e.target.result, ...extraData };
    swaps.push(itemData);
    saveSwaps();
    renderSwaps();
    filterSwaps();
    updateFeatured();
    showPopup(itemData);
    clearForm();
  };
  reader.readAsDataURL(file);
}

/* 🪞 Render item card */
function createItemCard(itemData, index) {
  const li = document.createElement("li");
  li.setAttribute("data-index", index);
  li.innerHTML = `
    <img src="${itemData.img}" class="item-img" />
    <strong>${itemData.category.charAt(0).toUpperCase() + itemData.category.slice(1)}</strong><br>
    ${itemData.material ? `Material: ${itemData.material}<br>` : ""}
    ${itemData.wear ? `Wear: ${itemData.wear}<br>` : ""}
    ${itemData.genre ? `Genre: ${itemData.genre}<br>` : ""}
    ${itemData.time ? `Owned: ${itemData.time}<br>` : ""}
    ${itemData.rating ? `Rating: ${itemData.rating}<br>` : ""}
    ${itemData.madeFrom ? `Made from: ${itemData.madeFrom}<br>` : ""}
    ${itemData.colour ? `Colour: ${itemData.colour}<br>` : ""}
    ${itemData.desc ? `Desc: ${itemData.desc}<br>` : ""}
    Worth: ${itemData.worth}<br>
    <div style="margin-top:6px;">
      <button onclick="editItem(this)">✏️ Edit</button>
      <button onclick="deleteItem(this)">🗑️ Delete</button>
    </div>
  `;
  li.onclick = () => showPopup(itemData);
  document.getElementById("item-list").appendChild(li);
}

/* ✏️ Edit item */
function editItem(button) {
  event.stopPropagation();
  const li = button.closest("li");
  const index = li.getAttribute("data-index");
  const item = swaps[index];

  document.getElementById("item-category").value = item.category;
  updateCategoryFields();

  if (item.category === "clothes") {
    document.getElementById("item-material").value = item.material || "";
    document.getElementById("item-wear").value = item.wear || "";
    document.getElementById("item-colour").value = item.colour || "";
  } else if (item.category === "books") {
    document.getElementById("item-genre").value = item.genre || "";
    document.getElementById("item-time").value = item.time || "";
    document.getElementById("item-rating").value = item.rating || "";
  } else if (item.category === "jewelry") {
    document.getElementById("item-madefrom").value = item.madeFrom || "";
    document.getElementById("item-colour").value = item.colour || "";
  } else if (item.category === "other") {
    document.getElementById("item-desc").value = item.desc || "";
  }

  document.getElementById("item-worth").value = item.worth.replace(" €", "");
  document.getElementById("item-notes").value = item.notes;

  editingItem = index;
  const addBtn = document.querySelector("button[onclick='addItem()']");
  addBtn.textContent = "Save Changes";
  addBtn.onclick = saveEdit;
}

/* 💾 Save edit */
function saveEdit() {
  if (editingItem === null) return;
  const category = document.getElementById("item-category").value;
  let worth = document.getElementById("item-worth").value.trim();
  if (worth && !worth.includes("€")) worth = worth + " €";
  const notes = document.getElementById("item-notes").value.trim();

  let extraData = {};
  if (category === "clothes") {
    extraData = {
      material: document.getElementById("item-material")?.value.trim(),
      wear: document.getElementById("item-wear")?.value.trim(),
      colour: document.getElementById("item-colour")?.value.trim()
    };
  } else if (category === "books") {
    extraData = {
      genre: document.getElementById("item-genre")?.value.trim(),
      time: document.getElementById("item-time")?.value.trim(),
      rating: document.getElementById("item-rating")?.value.trim()
    };
  } else if (category === "jewelry") {
    extraData = {
      madeFrom: document.getElementById("item-madefrom")?.value.trim(),
      colour: document.getElementById("item-colour")?.value.trim()
    };
  } else if (category === "other") {
    extraData = { desc: document.getElementById("item-desc")?.value.trim() };
  }

  swaps[editingItem] = { ...swaps[editingItem], category, worth, notes, ...extraData };
 
