let username = "";
let chatBox = document.getElementById("chat-box");
let itemList = document.getElementById("item-list");
let editingItem = null;

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
  const file = document.getElementById("item-image").files[0];

  if (!name || !material || !worth || !notes || !file) {
    alert("Please fill in all fields and choose an image!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const itemData = {
      name,
      material,
      worth,
      notes,
      img: e.target.result,
    };
    createItemCard(itemData);
    showPopup(itemData);
    clearForm();
  };
  reader.readAsDataURL(file);
}

function createItemCard(itemData) {
  const li = document.createElement("li");
  li.innerHTML = `
    <img src="${itemData.img}" alt="${itemData.name}" class="item-img" />
    <strong>${itemData.name}</strong><br>
    <em>Material:</em> ${itemData.material}<br>
    <em>Worth:</em> ${itemData.worth}<br>
    <em>Notes:</em> ${itemData.notes}
    <div style="margin-top:8px;">
      <button onclick="editItem(this)">✏️ Edit</button>
      <button onclick="deleteItem(this)">🗑️ Delete</button>
    </div>
  `;
  itemList.appendChild(li);
}

function editItem(button) {
  const li = button.parentElement.parentElement;
  const imgSrc = li.querySelector("img").src;
  const [name, material, worth, notes] = Array.from(li.querySelectorAll("strong, em + text"))
    .map(el => el.textContent);

  document.getElementById("item-name").value = name || "";
  document.getElementById("item-material").value = li.innerHTML.match(/Material:<\/em>\s*(.*?)<br>/)?.[1] || "";
  document.getElementById("item-worth").value = li.innerHTML.match(/Worth:<\/em>\s*(.*?)<br>/)?.[1] || "";
  document.getElementById("item-notes").value = li.innerHTML.match(/Notes:<\/em>\s*(.*?)$/)?.[1] || "";

  editingItem = { li, imgSrc };
  window.scrollTo(0, 0);
  alert("Edit your item details and click 'Save Changes' below!");

  // Change Add button to Save
  const addButton = document.querySelector("button[onclick='addItem()']");
  addButton.textContent = "Save Changes";
  addButton.onclick = saveEdit;
}

function saveEdit() {
  if (!editingItem) return;

  const name = document.getElementById("item-name").value.trim();
  const material = document.getElementById("item-material").value.trim();
  const worth = document.getElementById("item-worth").value.trim();
  const notes = document.getElementById("item-notes").value.trim();

  const li = editingItem.li;
  const img = editingItem.imgSrc;

  li.innerHTML = `
    <img src="${img}" alt="${name}" class="item-img" />
    <strong>${name}</strong><br>
    <em>Material:</em> ${material}<br>
    <em>Worth:</em> ${worth}<br>
    <em>Notes:</em> ${notes}
    <div style="margin-top:8px;">
      <button onclick="editItem(this)">✏️ Edit</button>
      <button onclick="deleteItem(this)">🗑️ Delete</button>
    </div>
  `;

  clearForm();
  editingItem = null;

  const addButton = document.querySelector("button[onclick='saveEdit()']");
  addButton.textContent = "Add Item";
  addButton.onclick = addItem;
}

function deleteItem(button) {
  if (confirm("Are you sure you want to delete this item?")) {
    button.parentElement.parentElement.remove();
  }
}

function showPopup(item) {
  document.getElementById("popup-img").src = item.img;
  document.getElementById("popup-info").innerHTML = `
    <strong>${item.name}</strong><br>
    Material: ${item.material}<br>
    Worth: ${item.worth}<br>
    Notes: ${item.notes}
  `;
  document.getElementById("popup").style.display = "block";
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
    document.getElementById("welcome").innerText = `Welcome back to OnlySwaps, ${username}! 💕`;
  }
};
