// =========================================================
// CHOCOFIXCO - JAVASCRIPT NOTES
//
// HTML = WHAT is on the page
// CSS  = HOW it looks
// JS   = WHAT it does
// =========================================================


// ===== ARRAY =====
//
// Stores all our order objects.

const orders = [];


// ===== DOM SELECTION =====

const orderForm =
    document.getElementById("order-form");

const customerNameInput =
    document.getElementById("customer-name");

const productInput =
    document.getElementById("product");

const quantityInput =
    document.getElementById("quantity");

const collectionDateInput =
    document.getElementById("collection-date");

const decreaseQuantityButton =
    document.getElementById("decrease-quantity");

const increaseQuantityButton =
    document.getElementById("increase-quantity");

const orderList =
    document.getElementById("order-list");


// ===== QUANTITY LIMITS =====

const minimumQuantity = 1;
const maximumQuantity = 10;


// ===== UPDATE QUANTITY BUTTONS =====

function updateQuantityButtons() {

    const currentQuantity =
        Number(quantityInput.value);

    decreaseQuantityButton.disabled =
        currentQuantity === minimumQuantity;

    increaseQuantityButton.disabled =
        currentQuantity === maximumQuantity;

}


// ===== QUANTITY - BUTTON =====

decreaseQuantityButton.addEventListener("click", function() {

    let currentQuantity =
        Number(quantityInput.value);

    if (currentQuantity > minimumQuantity) {

        currentQuantity =
            currentQuantity - 1;

        quantityInput.value =
            currentQuantity;

    }

    updateQuantityButtons();

});


// ===== QUANTITY + BUTTON =====

increaseQuantityButton.addEventListener("click", function() {

    let currentQuantity =
        Number(quantityInput.value);

    if (currentQuantity < maximumQuantity) {

        currentQuantity =
            currentQuantity + 1;

        quantityInput.value =
            currentQuantity;

    }

    updateQuantityButtons();

});


// ===== MANUAL QUANTITY INPUT =====

quantityInput.addEventListener("input", function() {

    let currentQuantity =
        Number(quantityInput.value);

    if (currentQuantity < minimumQuantity) {
        quantityInput.value =
            minimumQuantity;
    }

    if (currentQuantity > maximumQuantity) {
        quantityInput.value =
            maximumQuantity;
    }

    updateQuantityButtons();

});


// Set the correct button state
// when the page first loads.

updateQuantityButtons();


// ===== DATE PICKER =====

collectionDateInput.addEventListener("click", function() {

    collectionDateInput.showPicker();

});


// =========================================================
// ===== DISPLAY ORDERS FUNCTION =====
// =========================================================
//
// This function displays all the orders
// currently stored inside our array.

function displayOrders() {

    // Clear the old display first.

    orderList.innerHTML = "";


    // ===== LOOP =====
    //
    // We need the index because it tells us
    // which order we want to delete.
    //
    // index starts at 0.
    //
    // Example:
    //
    // orders[0] = first order
    // orders[1] = second order
    // orders[2] = third order

    for (let index = 0; index < orders.length; index++) {

        const order = orders[index];


        // ===== CREATE ORDER CARD =====

        const orderCard =
            document.createElement("div");


        // ===== DISPLAY ORDER INFORMATION =====

        orderCard.innerHTML = `
            <h3>${order.customerName}</h3>
            <p>Product: ${order.product}</p>
            <p>Quantity: ${order.quantity}</p>
            <p>Collection Date: ${order.collectionDate}</p>
        `;


        // =================================================
        // ===== CRUD: DELETE =====
        // =================================================

        // Create a Delete button using JavaScript.

        const deleteButton =
            document.createElement("button");


        // Put text inside the button.

        deleteButton.textContent =
            "Delete Order";


        // Listen for the Delete button being clicked.

        deleteButton.addEventListener("click", function() {


            // ===== SPLICE =====
            //
            // splice() removes something from an array.
            //
            // index = where to start.
            //
            // 1 = remove ONE item.
            //
            // Example:
            //
            // orders.splice(1, 1)
            //
            // means:
            // start at index 1
            // and remove 1 order.

            orders.splice(index, 1);


            // Display the array again.
            //
            // Because the order has now been removed,
            // it will disappear from the webpage.

            displayOrders();

        });


        // Put the Delete button
        // inside the order card.

        orderCard.appendChild(deleteButton);


        // Put the completed order card
        // onto the webpage.

        orderList.appendChild(orderCard);

    }


    // ===== EMPTY ORDER LIST =====
    //
    // When all orders have been deleted,
    // show the original message again.

    if (orders.length === 0) {

        orderList.innerHTML =
            "<p>No orders yet.</p>";

    }

}


// =========================================================
// ===== FORM SUBMIT EVENT =====
// =========================================================

orderForm.addEventListener("submit", function(event) {

    event.preventDefault();


    // ===== READ INPUT VALUES =====

    const customerName =
        customerNameInput.value;

    const product =
        productInput.value;

    const quantity =
        quantityInput.value;

    const collectionDate =
        collectionDateInput.value;


    // ===== OBJECT =====
    //
    // One order = one object.

    const order = {

        customerName: customerName,

        product: product,

        quantity: quantity,

        collectionDate: collectionDate

    };


    // ===== CRUD: CREATE =====
    //
    // Add the new order to our array.

    orders.push(order);


    // ===== CRUD: READ =====
    //
    // Display the orders.

    displayOrders();

});