const basket = document.querySelector("#basket");
const basketLink = document.querySelector("#basketLink");
const basketClose = document.querySelector("#basketClose");
const basketEmpty = document.querySelector("#basketEmpty");
const basketContent = document.querySelector("#basketContent");
const basketList = document.querySelector("#basketList");
const basketReset = document.querySelector("#basketReset");
const basketCounter = document.querySelector("#basketCounter");
const basketPrice = document.querySelector("#basketPrice");
const headerProductsCounter = document.querySelector("#headerProductsCounter");
const catalogList = document.querySelector("#catalogList");

renderBasketList();
updateHeaderProductsCounter();
checkLocalStorage();

// Function to update the header products counter with the number of items in the basket
function updateHeaderProductsCounter() {
    const productsId = JSON.parse(localStorage.getItem('productsId')) || [];
    headerProductsCounter.textContent = productsId.length;
}

// Function to show the basket by adding the "open" class
function showBasket() {
    basket.classList.add("open");
}

// Function to hide the basket by removing the "open" class
function hideBasket() {
    basket.classList.remove("open");
}

// Event listener for clicking on the basket link to toggle its visibility
basketLink.addEventListener("click", function () {
    if (basket.classList.contains("open")) {
        hideBasket();
    } else {
        showBasket();
    }
});

// Event listener for clicking on the basket close button to hide the basket
basketClose.addEventListener("click", hideBasket);

// Event listener for clicking on the basket reset button to clear the basket
basketReset.addEventListener("click", clearBasket);

// Event listener using event delegation for adding items to the basket
catalogList.addEventListener('click', event => {
    const clickedElement = event.target.closest('.product-btn');
    if (clickedElement) {
        clickedElement.setAttribute('disabled', 'true');
        const currentProduct = clickedElement.closest('.product');

        addToLocalStorage(currentProduct.id);
        updateHeaderProductsCounter();
        checkLocalStorage();
        renderBasketList();
    }
});

// Function to add an item's ID to the localStorage "productsId" array
function addToLocalStorage(itemId) {
    let productsId = JSON.parse(localStorage.getItem('productsId')) || [];
    productsId.push(itemId);
    localStorage.setItem('productsId', JSON.stringify(productsId));
}

// Function to remove an item's ID from the localStorage "productsId" array
function removeFromLocalStorage(itemId) {
    let productsId = JSON.parse(localStorage.getItem('productsId')) || [];
    productsId = productsId.filter(id => id !== itemId);
    localStorage.setItem('productsId', JSON.stringify(productsId));
}

// Function to check the localStorage and update the basket content visibility
function checkLocalStorage() {
    const productsId = JSON.parse(localStorage.getItem('productsId')) || [];

    if (productsId.length != 0) {
        basketEmpty.classList.add("hide");
        basketContent.classList.add("show");
    } else {
        basketEmpty.classList.remove("hide");
        basketContent.classList.remove("show");
    }
}

// Function to render the basket list with items from the localStorage
function renderBasketList() {
    const productsId = JSON.parse(localStorage.getItem('productsId')) || [];

    // Initialize variables to store item quantity and total price
    let itemQuantity = 0;
    let totalPrice = 0;

    // Clear the basket content before rendering
    basketList.innerHTML = '';
    basketCounter.innerText = '';
    basketPrice.innerText = '';

    productsId.forEach(itemId => {
        // Find the product by its ID
        const product = document.getElementById(itemId);

        if (product) {
            // Disable the "Add to Cart" button for the product
            product.querySelector(".product-btn").setAttribute('disabled', 'true');

            // Create a copy of the product card for the basket
            const productInBasket = product.cloneNode(true);

            // Remove the "Add to Cart" button from the product card in the basket
            productInBasket.querySelector('.product-btn').remove();

            // Create a new "Delete" button with an icon
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('product-delete', 'btn', 'btn-primary');
            deleteButton.type = 'button';
            deleteButton.innerHTML = '<i class="fas fa-trash" style="margin-right: 5px;"></i>Видалити';

            // Add an event listener for the new "Delete" button
            deleteButton.addEventListener('click', () => {
                // Enable the "Add to Cart" button for the product
                product.querySelector(".product-btn").removeAttribute('disabled');
                // Remove the item from localStorage
                removeFromLocalStorage(itemId);
                // Update the header products counter and basket content visibility
                updateHeaderProductsCounter();
                checkLocalStorage();
                // Render the updated basket list
                renderBasketList();
            });

            // Add the new "Delete" button to the product card in the basket
            productInBasket.appendChild(deleteButton);

            // Add the product card to the basket
            basketList.appendChild(productInBasket);

            // Update the item quantity and total price
            itemQuantity++;
            totalPrice += parseFloat(product.querySelector(".product-price span").innerText);
        }
    });

    // Update the basket counter and total price in the UI
    basketCounter.innerText = itemQuantity;
    basketPrice.innerText = totalPrice;
}

// Function to clear the basket and update the UI
function clearBasket() {
    const productsId = JSON.parse(localStorage.getItem('productsId')) || [];
    productsId.forEach(itemId => {
        const product = document.getElementById(itemId);

        // Enable the "Add to Cart" button for the product
        product.querySelector(".product-btn").removeAttribute('disabled');
    });

    // Remove the "productsId" key from localStorage
    localStorage.removeItem('productsId');
    // Update the header products counter and basket content visibility
    updateHeaderProductsCounter();
    checkLocalStorage();
    // Render the empty basket list
    renderBasketList();
}
