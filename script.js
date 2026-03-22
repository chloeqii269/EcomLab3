function validateLogin() 
{
    let email = document.querySelector('#accpanel input[type="text"]').value;
    let password = document.querySelector('#accpanel input[type="password"]').value;

    if (email === "" || password === "") 
    {
        alert("Please fill in all fields!");
        return;
    }

    if (!email.includes("@") || email.length < 5) 
    {
        alert("Invalid email!");
        return;
    }

    if (password.length < 6) 
    {
        alert("Password must be at least 6 characters!");
        return;
    }

    if (email === "admin@gmail.com" && password === "123456") 
    {
        alert("Login successful!");
    } 
    else 
    {
        alert("Invalid email or password!");
    }
}

document.addEventListener("DOMContentLoaded", function() 
{
    document.querySelector(".pbtn").addEventListener("click", validateLogin);
    updateCartCount();

    document.querySelector('a[href="#cartpanel"]').addEventListener("click", function() 
    {
        displayCart();
    });

    document.querySelectorAll('.modal').forEach(modal => 
    {
        modal.addEventListener('show.bs.modal', () => 
        {
            selectedSize = "";
        });
    });
});

function displayCart()
{
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartPanel = document.querySelector("#cartpanel");

    let html = `
        <a href="#" class="cbtn" onclick="location.href='#'">
            <span class="material-symbols-outlined">close_small</span>
        </a>
        <h2 style="text-align:center;">Cart</h2>
    `;

    if (cart.length === 0) 
    {
        html += "<p style='text-align:center;'>Cart is empty.</p>";
    } 
    else 
    {
        let total = 0;

        cart.forEach((item, index) => 
        {
            total += item.price * item.qty;

            html += `
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #ccc; padding:10px;">
                    
                    <div>
                        <b>${item.name}</b><br>
                        Size: ${item.size}<br>
                        RM ${item.price}
                    </div>

                    <div style="text-align:center;">
                        <button onclick="changeQty(${index}, -1)">-</button>
                        ${item.qty}
                        <button onclick="changeQty(${index}, 1)">+</button>
                    </div>

                    <div>
                        RM ${item.price * item.qty}
                        <br>
                        <button onclick="removeItem(${index})" style="color:red; border:none; background:none;">
                            Remove
                        </button>
                    </div>

                </div>
            `;
        });

        html += `
            <h4 style="text-align:right; margin-top:10px;">
                Total: RM ${total}
            </h4>
        `;
    }

    cartPanel.innerHTML = html;
}

function isCartOpen()
{
    return window.location.hash === "#cartpanel";
}

function validateEmail() 
{
    let emailInput = document.querySelector(".subsribe input");
    let email = emailInput.value;

    if (email === "") 
    {
        alert("Please enter your email!");
        return false;
    }

    if (!email.includes("@"))
    {
        alert("Invalid email!");
        return false;
    }

    alert("Subscribed successfully!");
    emailInput.value = "";
}

document.querySelector(".subsribe input").addEventListener("change", validateEmail);

let selectedSize = "";
function selectSize(btn, size) 
{
    selectedSize = size;

    let buttons = btn.parentElement.querySelectorAll(".size-btn");

    buttons.forEach(b => b.classList.remove("active"));

    btn.classList.add("active");
}

function addToCart(productName, price, btn)
{
    if (selectedSize === "")
    {
        alert("Please select the size first!");
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let existing = cart.find(item =>
        item.name === productName && item.size === selectedSize
    );

    if (existing)
    {
        existing.qty += 1;
    }
    else
    {
        cart.push({
            name: productName,
            price: price,
            size: selectedSize,
            qty: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();
    displayCart();

    showMessage("✔ Item added to cart!");

    if (btn)
    {
        btn.innerText = "Added ✔";
        btn.style.background = "green";
        btn.style.color = "white";

        setTimeout(() => 
        {
            btn.innerText = "Add to Cart";
            btn.style.background = "";
            btn.style.color = "";
        }, 2000);
    }

    selectedSize = "";
}

function updateCartCount()
{
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let count = 0;

    cart.forEach(item => 
    {
        count += item.qty;
    });

    document.getElementById("cart-count").innerText = count;
}

function changeQty(index, change)
{
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (!cart[index]) return;

    cart[index].qty += change;

    if (cart[index].qty <= 0)
    {
        cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    displayCart(); 
}

function removeItem(index)
{
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (!cart[index]) return;

    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    displayCart(); 
}

window.addEventListener("hashchange", function()
{
    if (window.location.hash === "#cartpanel")
    {
        displayCart();
    }
});

function showMessage(text)
{
    let msg = document.createElement("div");
    msg.innerText = text;

    msg.style.position = "fixed";
    msg.style.top = "120px";
    msg.style.right = "20px";
    msg.style.background = "green";
    msg.style.color = "white";
    msg.style.padding = "10px 20px";
    msg.style.borderRadius = "5px";
    msg.style.zIndex = "9999";

    document.body.appendChild(msg);

    setTimeout(() => {
        msg.remove();
    }, 2000);
}