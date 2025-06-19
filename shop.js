const PRODUCTS = {
  apple: { name: "Apple", emoji: "🍏" },
  banana: { name: "Banana", emoji: "🍌" },
  lemon: { name: "Lemon", emoji: "🍋" },
};

function getBasket() {
  const basket = localStorage.getItem("basket");
  return basket ? JSON.parse(basket) : {};
}

function addToBasket(product) {
  const basket = getBasket();
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
  let totalItems = 0;
  Object.values(basket).forEach((qty) => totalItems += qty);

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

// Call this on page load and after basket changes
function initializeBasketUI() {
  renderBasketIndicator();
  renderBasket();
}

if (document.readyState !== "loading") {
  initializeBasketUI();
} else {
  document.addEventListener("DOMContentLoaded", initializeBasketUI);
}

// Patch basket functions to update UI
const origAddToBasket = window.addToBasket;
window.addToBasket = function (product) {
  origAddToBasket(product);
  renderBasketIndicator();
  renderBasket();
};

const origClearBasket = window.clearBasket;
window.clearBasket = function () {
  origClearBasket();
  renderBasketIndicator();
  renderBasket();
};
