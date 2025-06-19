const PRODUCTS = {
  apple: { name: "Apple", emoji: "🍏" },
  banana: { name: "Banana", emoji: "🍌" },
  lemon: { name: "Lemon", emoji: "🍋" },
};

function getBasket() {
  const basket = localStorage.getItem("basket");
  return basket ? JSON.parse(basket) : {};
}

function getTotalItemCount(basket) {
  return Object.values(basket).reduce((sum, qty) => sum + qty, 0);
  
}

function showBasketLimitError() {
  let errorBox = document.querySelector(".basket-error");
  if (!errorBox) {
    errorBox = document.createElement("div");
    errorBox.className = "basket-error";
    errorBox.style.color = "red";
    errorBox.style.marginTop = "10px";
    errorBox.style.fontWeight = "bold";
    document.body.appendChild(errorBox);
  }
  errorBox.textContent = "Your basket is full. You cannot add more than 10 items.";
  errorBox.style.display = "block";
  setTimeout(() => {
    errorBox.style.display = "none";
  }, 3000);
}

function updateAddButtonsState() {
  const basket = getBasket();
  const totalCount = getTotalItemCount(basket);
  const addButtons = document.querySelectorAll(".add-to-basket");

  addButtons.forEach((btn) => {
    if (totalCount >= 10) {
      btn.disabled = true;
      btn.title = "Basket full – cannot add more than 10 items.";
    } else {
      btn.disabled = false;
      btn.title = "";
    }
  });
}

function addToBasket(product) {
  const basket = getBasket();
  const totalCount = getTotalItemCount(basket);

  if (totalCount >= 10) {
    showBasketLimitError();
    return;
  }

  if (basket[product]) {
    basket[product] += 1;
  } else {
    basket[product] = 1;
  }

  localStorage.setItem("basket", JSON.stringify(basket));
}

function clearBasket() {
  localStorage.removeItem("basket");
}

function renderBasket() {
  const basket = getBasket();
  const basketList = document.getElementById("basketList");
  const cartButtonsRow = document.querySelector(".cart-buttons-row");
  if (!basketList) return;
  basketList.innerHTML = "";

  const productKeys = Object.keys(basket);
  if (productKeys.length === 0) {
    basketList.innerHTML = "<li>No products in basket.</li>";
    if (cartButtonsRow) cartButtonsRow.style.display = "none";
    return;
  }

  productKeys.forEach((key) => {
    const item = PRODUCTS[key];
    const quantity = basket[key];
    if (item && quantity > 0) {
      const li = document.createElement("li");
      li.innerHTML = `<span class='basket-emoji'>${item.emoji}</span> <span>${quantity}x ${item.name}</span>`;
      basketList.appendChild(li);
    }
  });

  if (cartButtonsRow) cartButtonsRow.style.display = "flex";
}

function renderBasketIndicator() {
  const basket = getBasket();
  let totalItems = getTotalItemCount(basket);

  let indicator = document.querySelector(".basket-indicator");
  if (!indicator) {
    const basketLink = document.querySelector(".basket-link");
    if (!basketLink) return;
    indicator = document.createElement("span");
    indicator.className = "basket-indicator";
    basketLink.appendChild(indicator);
  }

  if (totalItems > 0) {
    indicator.textContent = totalItems;
    indicator.style.display = "flex";
  } else {
    indicator.style.display = "none";
  }
}

function initializeBasketUI() {
  renderBasketIndicator();
  renderBasket();
  updateAddButtonsState();
}

if (document.readyState !== "loading") {
  initializeBasketUI();
} else {
  document.addEventListener("DOMContentLoaded", initializeBasketUI);
}

// Patch basket functions to update UI
const origAddToBasket = window.addToBasket || addToBasket;
window.addToBasket = function (product) {
  origAddToBasket(product);
  renderBasketIndicator();
  renderBasket();
  updateAddButtonsState();
};

const origClearBasket = window.clearBasket || clearBasket;
window.clearBasket = function () {
  origClearBasket();
  renderBasketIndicator();
  renderBasket();
  updateAddButtonsState();
};
