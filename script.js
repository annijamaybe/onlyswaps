let username = "";
let chatBox = document.getElementById("chat-box");
let itemList = document.getElementById("item-list");
let editingItem = null;
let swaps = JSON.parse(localStorage.getItem("swaps")) || [];

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
}

function login() {
  username = document.getElementById("username").value.trim();
  if (username) {
    document.getElementById("welcome").innerText = `Welcome to OnlySwaps, ${username}! 💕`;
    localStorage.setItem("username", username);
  }
}

function addItem() {
  const name = document.getElementById("item-name").value.trim();
  const material = document.getElementById("item-material").value.trim();
  const worth = document.getElementById("item-worth").value.trim();
  const notes = document.getElementById("item-notes").value.trim();
  const category = document.getElementById("item-category").value;
  const file = document.getElementById("item-image").files[0];

  if (!name || !material || !worth || !notes || !file) {
    alert("Please fill in all fields and choose an image!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const itemData = { name, material, worth, notes, category, img: e.target.result };
    swaps.push(itemData);
    saveSwaps();
    renderSwaps();
    showPopup(itemData);
    clearForm();
  };
  reader.readAsDataURL(file);
}

function createItemCard(itemData, index = swaps.length - 1) {
  const li = document.createElement("li");
  li.setAttribute("data-index", index);
  li.setAttribute("data-category", itemData.category);
  li.innerHTML = `
    <img src="${itemData.img}" alt="${itemData.name}" class="item-img" />
    <strong>${itemData.name}</strong><br>
    <em>${itemData.category}</em><br>
    Material: ${itemData.material}<br>
    Worth: ${itemData.worth}<br>
    Notes: ${itemData.notes}
    <div style="margin-top:8px;">
      <button onclick="editItem(this)">✏️ Edit</button>
      <button onclick="deleteItem(this)">🗑️ Delete</button>
    </div>
  `;
  itemList.appendChild(li);
}

function editItem(button) {
  const li = button.closest("li");
  const index = li.getAttribute("data-index");
  const item = swaps[index];

  document.getElementById("item-name").value = item.name;
  document.getElementById("item-material").value = item.material;
  document.getElementById("item-worth").value = item.worth;
  document.getElementById("item-notes").value = item.notes;
  document.getElementById("item-category").value = item.category;

  editingItem = index;
  window.scrollTo(0, 0);
  alert("Edit your item and click 'Save Changes'!");

  const addButton = document.querySelector("button[onclick='addItem()']");
  addButton.textContent = "Save Changes";
  addButton.onclick = saveEdit;
}

function saveEdit() {
  if (editingItem === null) return;

  const name = document.getElementById("item-name").value.trim();
  const material = document.getElementById("item-material").value.trim();
  const worth = document.getElementById("item-worth").value.trim();
  const notes = document.getElementById("item-notes").value.trim();
  const category = document.getElementById("item-category").value;

  const updatedItem = { ...swaps[editingItem], name, material, worth, notes, category };
  swaps[editingItem] = updatedItem;
  saveSwaps();
  renderSwaps();

  editingItem = null;
  clearForm();

  const addButton = document.querySelector("button[onclick='saveEdit()']");
  addButton.textContent = "Add Item";
  addButton.onclick = addItem;
}

function deleteItem(button) {
  const li = button.closest("li");
  const index = li.getAttribute("data-index");
  if (confirm("Delete this swap?")) {
    swaps.splice(index, 1);
    saveSwaps();
    renderSwaps();
  }
}

function saveSwaps() {
  localStorage.setItem("swaps", JSON.stringify(swaps));
}

function renderSwaps() {
  itemList.innerHTML = "";
  swaps.forEach((item, index) => createItemCard(item, index));
  filterSwaps();
}

function filterSwaps() {
  const selected = document.getElementById("filter-category").value;
  document.querySelectorAll("#item-list li").forEach(li => {
    if (selected === "all" || li.getAttribute("data-category") === selected) {
      li.style.display = "block";
    } else {
      li.style.display = "none";
    }
  });
}

function showPopup(item) {
  document.getElementById("popup-img").src = item.img;
  document.getElementById("popup-info").innerHTML = `
    <strong>${item.name}</strong><br>
    Category: ${item.category}<br>
    Material: ${item.material}<br>
    Worth: ${item.worth}<br>
    Notes: ${item.notes}
  `;
  document.getElementById("popup").style.display = "flex";
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}

function clearForm() {
  document.getElementById("item-name").value = "";
  document.getElementById("item-material").value = "";
  document.getElementById("item-worth").value = "";
  document.getElementById("item-notes").value = "";
  document.getElementById("item-image").value = "";
}

function sendMessage() {
  const input = document.getElementById("chat-input");
  const msg = input.value.trim();
  if (!msg || !username) return;

  const p = document.createElement("p");
  p.innerHTML = `<strong>${username}:</strong> ${msg}`;
  chatBox.appendChild(p);
  chatBox.scrollTop = chatBox.scrollHeight;
  input.value = "";
}

window.onload = () => {
  const savedName = localStorage.getItem("username");
  if (savedName) {
    username = savedName;
    document.getElementById("welcome").innerText = `Welcome back, ${username}! 💕`;
  }
  renderSwaps();
};

