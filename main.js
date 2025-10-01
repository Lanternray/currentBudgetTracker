let currentValue = 0;
let current = document.getElementById("current");
let inputCurrent = document.getElementById("inputCurrent");
const list = document.querySelector("ul");

document.getElementById("inputCurrentBtn").addEventListener("click", () => {
    currentValue = Number(inputCurrent.value);
    document.getElementById("current").textContent = `Current: ${currentValue}`;
    });

document.getElementById("addListBtn").addEventListener("click", () => {
    const itemDescrip = inputDescrip.value;
    const itemAmount = Number(inputAmount.value);

    const listItem = document.createElement("li");
    const listText = document.createElement("span");
    const listBtn = document.createElement("button");

    listItem.appendChild(listText);
    listText.textContent = `${itemDescrip} ${itemAmount}`;
    listItem.appendChild(listBtn);
    listBtn.textContent = "Delete";
    list.appendChild(listItem);
    
    currentValue += itemAmount;
    console.log(typeof(currentValue));
    document.getElementById("current").textContent = `Current: ${currentValue}`;

    listBtn.addEventListener("click", () => {
      list.removeChild(listItem);
      currentValue -= itemAmount;
      document.getElementById("current").textContent = `Current: ${currentValue}`;
    });

    });