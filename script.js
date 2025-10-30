let username = "";
let chatBox = document.getElementById("chat-box");
let itemList = document.getElementById("item-list");

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
  const name = document.getElementById("item-name").value;
  const desc = document.getElementById("item-desc").value;
  const imageInput = document.getElementById("item-image");
  const file = imageInput.files[0];

  if (!name || !desc || !file) {
    alert("Please fill in all fields and choose an image!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${e.target.result}" alt="${name}" class="item-img" />
      <strong>${name}</strong>: ${desc}
    `;
    itemList.appendChild(li);

    document.getElementById("item-name").value = "";
    document.getElementById("item-desc").value = "";
    document.getElementById("item-image").value = "";
  };
  reader.readAsDataURL(file);
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

// Auto-load username if saved
window.onload = () => {
  const savedName = localStorage.getItem("username");
  if (savedName) {
    username = savedName;
    document.getElementById("welcome").innerText = `Welcome back to OnlySwaps, ${username}! 💕`;
  }
};
