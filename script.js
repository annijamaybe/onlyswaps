let username = "";
let chatBox = document.getElementById("chat-box");
let itemList = document.getElementById("item-list");
let editingItem = null;
let swaps = JSON.parse(localStorage.getItem("swaps")) || [];

/* 🌸 Switch pages */
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
  }
}

/* 🌷 Update category fields dynamically */
function updateCategoryFields() {
  const category = document.getElementById("item-category").value;
  const fieldsDiv = document.getElementById("category-fields");
  fieldsDiv.innerHTML = "";

  if (category === "clothes") {
    fieldsDiv.innerHTML = `
      <label>Material:</label>
      <input id="item-material" placeholder="e.g. cotton" />
      <label>Wear level:</label>
      <input id="item-wear" placeholder="e.g. lightly used" />
      <label>Colour:</label>
      <input id="item-colour" placeholder="e.g. pastel pink" />
    `;
  } else if (category === "books") {
    fieldsDiv.innerHTML = `
      <label>Genre:</label>
      <input id="item-genre" placeholder="e.g. fantasy" />
      <label>Time owned:</label>
      <input id="item-time" placeholder="e.g. 2 years" />
      <label>Rating:</label>
      <input id="item-rating" placeholder="e.g. 8/10" />
    `;
  } else if (category === "jewelry") {
    fieldsDiv.innerHTML = `
      <label>Made from:</label>
      <input id="item-madefrom" placeholder="e.g. silver" />
      <label>Colour:</label>
      <input id="item-colour" placeholder="e.g. gold" />
    `;
  } else if (category === "other") {
    fieldsDiv.innerHTML = `
      <label>Description:</label>
      <input id="item-desc" placeholder="What is it?" />
    `;
  }
}

/* 🎀 Add new item */
function addItem() {
  const category = document.getElementById("item-category").value;
  let worth = document.getElementById("item-worth").value.trim();
  const notes = document.getElementById("item-notes").value.trim();
  const file = document.getElementById("item-image").files[0];

  if (!category || !worth || !file) {
    alert("Please select category, enter worth, and upload an image!");
    return;
  }

  if (!worth.includes("€")) worth += " €";

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
    extraData = {
      desc: document.getElementById("item-desc")?.value.trim()
    };
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const itemData = {
      category,
      worth,
      notes,
      img: e.target.result,
      ...extraData
    };
    swaps.push(itemData);
    saveSwaps();
    renderSwaps();
    updateFeatured();
    showPopup(itemData);
    clearForm();
  };
  reader.readAsDataURL(file);
}

/* 🪞 Render swap cards */
function createItemCard(itemData, index = swaps.length - 1) {
  const li = document.createElement("li");
  li.setAttribute("data-index", index);
  li.innerHTML = `
    <img src="${itemData.img}" alt="item image" class="item-img" />
    <strong>${itemData.category.charAt(0).toUpperCase() + itemData.category.slice(1)}</strong><br>
    ${itemData.material ? `<em>Material:</em> ${itemData.material}<br>` : ""}
    ${itemData.genre ? `<em>Genre:</em> ${itemData.genre}<br>` : ""}
    ${itemData.madeFrom ? `<em>Made from:</em> ${itemData.madeFrom}<br>` : ""}
    ${itemData.colour ? `<em>Colour:</em> ${itemData.colour}<br>` : ""}
    ${itemData.time ? `<em>Time owned:</em> ${itemData.time}<br>` : ""}
    ${itemData.rating ? `<em>Rating:</em> ${itemData.rating}<br>` : ""}
    ${itemData.desc ? `<em>Description:</em> ${itemData.desc}<br>` : ""}
    <em>Worth:</em> ${itemData.worth}<br>
    ${itemData.notes ? `<small>${itemData.notes}</small><br>` : ""}
    <div style="margin-top:8px;">
      <button onclick="editItem(this)">✏️ Edit</button>
      <button onclick="deleteItem(this)">🗑️ Delete</button>
    </div>
  `;
  li.onclick = () => showPopup(itemData);
  itemList.appendChild(li);
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

  document.getElementById("item-worth").value = item.worth;
  document.getElementById("item-notes").value = item.notes;

  editingItem = index;
  const addButton = document.querySelector("button[onclick='addItem()']");
  addButton.textContent = "Save Changes";
  addButton.onclick = saveEdit;
}

/* 💾 Save edit */
function saveEdit() {
  if (editingItem === null) return;

  const category = document.getElementById("item-category").value;
  let worth = document.getElementById("item-worth").value.trim();
  if (!worth.includes("€")) worth += " €";
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
    extraData = {
      desc: document.getElementById("item-desc")?.value.trim()
    };
  }

  swaps[editingItem] = { ...swaps[editingItem], category, worth, notes, ...extraData };
  saveSwaps();
  renderSwaps();
  updateFeatured();
  editingItem = null;
  clearForm();

  const addButton = document.querySelector("button[onclick='saveEdit()']");
  addButton.textContent = "Add Item";
  addButton.onclick = addItem;
}

/* 🗑️ Delete item */
function deleteItem(button) {
  event.stopPropagation();
  const li = button.closest("li");
  const index = li.getAttribute("data-index");
  if (confirm("Are you sure you want to delete this item?")) {
    swaps.splice(index, 1);
    saveSwaps();
    renderSwaps();
    updateFeatured();
  }
}

/* 💾 Save to localStorage */
function saveSwaps() {
  localStorage.setItem("swaps", JSON.stringify(swaps));
}

/* 🪞 Render swaps */
function renderSwaps() {
  itemList.innerHTML = "";
  swaps.forEach((item, index) => createItemCard(item, index));
  filterSwaps();
}

/* 🌟 Featured swap */
function updateFeatured() {
  const featuredCard = document.getElementById("featured-card");
  if (!swaps.length) {
    featuredCard.innerHTML = `<p>✨ Add your first swap to see it featured here!</p>`;
    featuredCard.onclick = null;
    return;
  }

  const randomItem = swaps[Math.floor(Math.random() * swaps.length)];
  featuredCard.innerHTML = `
    <img src="${randomItem.img}" alt="${randomItem.category}" />
    <strong>${randomItem.category.toUpperCase()}</strong><br>
    ${randomItem.worth}<br>
    ${randomItem.notes ? `<small>${randomItem.notes}</small>` : ""}
  `;
  featuredCard.onclick = () => showPopup(randomItem);
}

/* 💬 Chat */
function sendMessage() {
  const msg = document.getElementById("chat-input").value.trim();
  if (!msg) return;
  const msgDiv = document.createElement("div");
  msgDiv.innerHTML = `<strong>${username || "Anon"}:</strong> ${msg}`;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  document.getElementById("chat-input").value = "";
}

/* 🌸 Popup */
function showPopup(item) {
  document.getElementById("popup-img").src = item.img;
  let info = `<strong>${item.category.toUpperCase()}</strong><br>${item.worth}<br>`;
  if (item.material) info += `Material: ${item.material}<br>`;
  if (item.wear) info += `Wear: ${item.wear}<br>`;
  if (item.colour) info += `Colour: ${item.colour}<br>`;
  if (item.genre) info += `Genre: ${item.genre}<br>`;
  if (item.time) info += `Time owned: ${item.time}<br>`;
  if (item.rating) info += `Rating: ${item.rating}<br>`;
  if (item.madeFrom) info += `Made from: ${item.madeFrom}<br>`;
  if (item.desc) info += `Description: ${item.desc}<br>`;
  if (item.notes) info += `Notes: ${item.notes}<br>`;
  document.getElementById("popup-info").innerHTML = info;
  document.getElementById("popup").style.display = "flex";
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}

/* 🌸 Filter swaps */
function filterSwaps() {
  const filterValue = document.getElementById("filter-category").value;
  itemList.innerHTML = "";
  const filtered = filterValue === "all"
    ? swaps
    : swaps.filter(item => item.category === filterValue);
  if (!filtered.length) {
    itemList.innerHTML = `<p style="text-align:center;color:#d45b7a;">No swaps found in this category 💭</p>`;
    return;
  }
  filtered.forEach((item, index) => createItemCard(item, index));
}

/* 🌸 Clear form */
function clearForm() {
  document.getElementById("item-category").value = "";
  document.getElementById("item-worth").value = "";
  document.getElementById("item-notes").value = "";
  document.getElementById("item-image").value = "";
  document.getElementById("category

