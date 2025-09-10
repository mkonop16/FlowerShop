const cartBtn = document.getElementById("cartBtn");
const cart = document.getElementById("cart");
const cartItems = document.getElementById("cartItems");
const totalEl = document.getElementById("total");
const clearCartBtn = document.getElementById("clearCart");
const navLinks = document.querySelectorAll("header nav a");
const sortByPriceBtn = document.querySelector(".sort-bar a:first-child");
const productsContainer = document.querySelector(".products");
const submitCartBtn = document.getElementById("submitCart");

let cartData = [];
let sortAsc = true;

navLinks.forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove("active"));
        e.target.classList.add("active");
        if (e.target.id === "cartBtn") {
            cart.classList.add("show");
        } else {
            cart.classList.remove("show");
        }
    });
});

document.querySelectorAll(".product button").forEach(btn => {
    btn.addEventListener("click", e => {
        const product = e.target.closest(".product");
        const name = product.dataset.name;
        const price = parseFloat(product.dataset.price);

        let existing = cartData.find(item => item.name === name);
        if (existing) {
            existing.quantity += 1;
        } else {
            cartData.push({ name, price, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cartData));
        renderCart();
        showToast(`${name} added to cart`);
    });
});

clearCartBtn.addEventListener("click", () => {
    cartData = [];
    localStorage.removeItem("cart");
    renderCart();
});

function renderCart() {
    cartItems.innerHTML = "";
    let total = 0;

    cartData.forEach((item, index) => {
        const li = document.createElement("li");
        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "center";

        const text = document.createElement("span");
        text.textContent = `${item.name} - $${item.price} x ${item.quantity}`;

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "❌";
        removeBtn.style.background = "transparent";
        removeBtn.style.border = "none";
        removeBtn.style.cursor = "pointer";
        removeBtn.style.color = "red";
        removeBtn.style.fontSize = "16px";
        removeBtn.onclick = () => {
            cartData.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cartData));
            renderCart();
        };

        li.appendChild(text);
        li.appendChild(removeBtn);
        cartItems.appendChild(li);

        total += item.price * item.quantity;
    });

    totalEl.textContent = "Total: $" + total;
}

window.addEventListener("DOMContentLoaded", () => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
        cartData = JSON.parse(savedCart);
        renderCart();
    }
});

sortByPriceBtn.addEventListener("click", e => {
    e.preventDefault();
    const products = Array.from(productsContainer.querySelectorAll(".product"));
    products.sort((a, b) => {
        const priceA = parseFloat(a.dataset.price);
        const priceB = parseFloat(b.dataset.price);
        return sortAsc ? priceA - priceB : priceB - priceA;
    });
    productsContainer.innerHTML = "";
    products.forEach(p => productsContainer.appendChild(p));
    sortAsc = !sortAsc;
});

submitCartBtn.addEventListener("click", () => {
    if (cartData.length === 0) {
        showToast("Cart is empty", "error");
        return;
    }
    window.location.href = "../pages/checkout.html";
});

function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = "";
    toast.classList.add("show");
    if (type === "error") {
        toast.classList.add("error");
    }
    setTimeout(() => {
        toast.classList.remove("show");
        toast.classList.remove("error");
    }, 2500);
}
