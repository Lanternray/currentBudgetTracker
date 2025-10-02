// ---- Helper for cookies ----
function setCookie(name, value, days = 7) {
  const d = new Date();
  d.setTime(d.getTime() + (days*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/`;
}

function getCookie(name) {
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  name = name + "=";
  for (let c of ca) {
    while (c.charAt(0) === ' ') c = c.substring(1);
    if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
  }
  return "";
}

let currentValue = 0;
let current = document.getElementById("current");
let inputCurrent = document.getElementById("inputCurrent");
let inputDescrip = document.getElementById("inputDescrip");
let inputAmount = document.getElementById("inputAmount");
const list = document.querySelector("ul");

// ---- Load state from cookies on refresh ----
window.addEventListener("load", () => {
  const savedValue = getCookie("currentValue");
  const savedList = getCookie("listItems");

  if (savedValue) {
    currentValue = Number(savedValue);
    current.textContent = `Current: ${currentValue.toFixed(2)}`;
  }

  if (savedList) {
    const items = JSON.parse(savedList);
    items.forEach(({descrip, amount}) => addListItem(descrip, amount, false));
  }
});

// ---- Save state to cookies ----
function saveState() {
  setCookie("currentValue", currentValue, 7);
  const items = [];
  list.querySelectorAll("li").forEach(li => {
    const text = li.querySelector("span").textContent.split(" ");
    const amount = parseFloat(text.pop());
    const descrip = text.join(" ");
    items.push({descrip, amount});
  });
  setCookie("listItems", JSON.stringify(items), 7);
}

function addListItem(itemDescrip, itemAmount, updateValue = true) {
  const listItem = document.createElement("li");
  const listText = document.createElement("span");
  const listBtn = document.createElement("button");

  listItem.appendChild(listBtn);
  listBtn.textContent = "x";
  listItem.appendChild(listText);
  listText.textContent = `${itemDescrip} ${itemAmount.toFixed(2)}`;
  list.appendChild(listItem);

  if (updateValue) {
    currentValue += itemAmount;
    current.textContent = `Current: ${currentValue.toFixed(2)}`;
  }

  saveState();

  listBtn.addEventListener("click", () => {
    list.removeChild(listItem);
    currentValue -= itemAmount;
    current.textContent = `Current: ${currentValue.toFixed(2)}`;
    saveState();
  });
}

const customPrompt = document.getElementById("customPrompt");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");

let pendingAction = null;

function showPrompt(actionFn) {
  pendingAction = actionFn;
  customPrompt.classList.remove("hidden");
  customPrompt.setAttribute("aria-hidden", "false");
}

function hidePrompt() {
  pendingAction = null;
  customPrompt.classList.add("hidden");
  customPrompt.setAttribute("aria-hidden", "true");
}

confirmYes.addEventListener("click", () => {
  if (typeof pendingAction === "function") pendingAction();
  hidePrompt();
});

confirmNo.addEventListener("click", hidePrompt);

customPrompt.addEventListener("click", (e) => {
  if (e.target === customPrompt) hidePrompt();
});

document.getElementById("inputCurrentBtn").addEventListener("click", () => {
  showPrompt(() => {
    currentValue = Number(inputCurrent.value);
    current.textContent = `Current: ${currentValue.toFixed(2)}`;
    saveState();
  });
});

document.getElementById("addListBtn").addEventListener("click", () => {
  const itemDescrip = inputDescrip.value;
  const itemAmount = Number(inputAmount.value);
  if (!itemDescrip || isNaN(itemAmount)) return;
  addListItem(itemDescrip, itemAmount);
});