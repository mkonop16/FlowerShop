let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartList = document.getElementById("cartList");
const cartTotal = document.getElementById("cartTotal");

function renderCart() {
    cartList.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        const li = document.createElement("li");

        const text = document.createElement("span");
        text.textContent = `${item.name} - $${item.price}`;

        const qtyInput = document.createElement("input");
        qtyInput.type = "number";
        qtyInput.min = "1";
        qtyInput.value = item.quantity;
        qtyInput.onchange = (e) => {
            cart[index].quantity = parseInt(e.target.value) || 1;
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCart();
        };

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "❌";
        removeBtn.style.background = "transparent";
        removeBtn.style.border = "none";
        removeBtn.style.cursor = "pointer";
        removeBtn.style.color = "red";
        removeBtn.style.fontSize = "16px";
        removeBtn.onclick = () => {
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCart();
        };

        li.appendChild(text);
        li.appendChild(qtyInput);
        li.appendChild(removeBtn);

        cartList.appendChild(li);

        total += item.price * item.quantity;
    });

    cartTotal.textContent = "Total: $" + total;
}

renderCart();

const form = document.getElementById("checkoutForm");
form.addEventListener("submit", e => {
    e.preventDefault();
    alert("✅ Thank you! Your order has been placed.");

    localStorage.removeItem("cart");
    window.location.href = "index.html";
});