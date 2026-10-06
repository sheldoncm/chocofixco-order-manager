// =========================================================
// CHOCOFIXCO - JAVASCRIPT NOTES
//
// HTML = WHAT is on the page
// CSS  = HOW it looks
// JS   = WHAT it does
// =========================================================


// =========================================================
// ===== ARRAY =====
// =========================================================
//
// Stores all our order objects.

const orders = [];


// =========================================================
// ===== EDITING STATE =====
// =========================================================
//
// JavaScript needs to remember whether we are:
//
// 1. Creating a NEW order
// 2. Updating an EXISTING order
//
// -1 means we are NOT editing.
//
// Example:
//
// editingIndex = -1
// → creating a new order
//
// editingIndex = 0
// → editing the first order
//
// editingIndex = 1
// → editing the second order

let editingIndex = -1;


// =========================================================
// ===== DOM SELECTION =====
// =========================================================
//
// JavaScript finds the HTML elements
// that it needs to work with.

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


// querySelector() finds an element
// using a CSS selector.
//
// #order-form > button
//
// means:
//
// Find the button directly inside
// the order form.

const submitButton =
    document.querySelector("#order-form > button");


// =========================================================
// ===== QUANTITY LIMITS =====
// =========================================================

const minimumQuantity = 1;

const maximumQuantity = 10;


// =========================================================
// ===== UPDATE QUANTITY BUTTONS =====
// =========================================================

function updateQuantityButtons() {

    const currentQuantity =
        Number(quantityInput.value);

    decreaseQuantityButton.disabled =
        currentQuantity === minimumQuantity;

    increaseQuantityButton.disabled =
        currentQuantity === maximumQuantity;

}


// =========================================================
// ===== QUANTITY - BUTTON =====
// =========================================================

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


// =========================================================
// ===== QUANTITY + BUTTON =====
// =========================================================

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


// =========================================================
// ===== MANUAL QUANTITY INPUT =====
// =========================================================

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


// Quantity starts at 1,
// so the - button starts disabled.

updateQuantityButtons();


// =========================================================
// ===== DATE PICKER =====
// =========================================================

collectionDateInput.addEventListener("click", function() {

    collectionDateInput.showPicker();

});


// =========================================================
// ===== DATE VALIDATION =====
// =========================================================
//
// Collection dates cannot be in the past.

const today =
    new Date();

const year =
    today.getFullYear();


// JavaScript counts months from 0,
// so we add 1.
//
// padStart() ensures two digits.

const month =
    String(today.getMonth() + 1).padStart(2, "0");

const day =
    String(today.getDate()).padStart(2, "0");


// HTML date inputs require:
//
// YYYY-MM-DD

const todayDate =
    `${year}-${month}-${day}`;

collectionDateInput.min =
    todayDate;


// =========================================================
// ===== DISPLAY ORDERS FUNCTION =====
// =========================================================
//
// Reads our orders array and displays
// the orders on the webpage.

function displayOrders() {


    // ===== CLEAR OLD DISPLAY =====

    orderList.innerHTML = "";


    // =====================================================
    // ===== LOOP =====
    // =====================================================
    //
    // Start at index 0.
    //
    // Keep going while index is smaller
    // than the number of orders.
    //
    // index++ means move to the next number.

    for (let index = 0; index < orders.length; index++) {


        // Get the current order.

        const order =
            orders[index];


        // =================================================
        // ===== CREATE ORDER CARD =====
        // =================================================
        //
        // JavaScript creates a new <div>.

        const orderCard =
            document.createElement("div");


        // =================================================
        // ===== ADD CSS CLASS =====
        // =================================================
        //
        // classList.add() gives our new <div>
        // a CSS class.
        //
        // JavaScript creates:
        //
        // <div class="order-card">
        //
        // CSS can now style it using:
        //
        // .order-card

        orderCard.classList.add("order-card");


        // ===== DISPLAY ORDER INFORMATION =====

        orderCard.innerHTML = `
            <h3>${order.customerName}</h3>
            <p>Product: ${order.product}</p>
            <p>Quantity: ${order.quantity}</p>
            <p>Collection Date: ${order.collectionDate}</p>
        `;


        // =================================================
        // ===== CRUD: UPDATE - EDIT BUTTON =====
        // =================================================

        const editButton =
            document.createElement("button");

        editButton.textContent =
            "Edit Order";


        // Give the Edit button a CSS class.

        editButton.classList.add("edit-button");


        // ===== EDIT EVENT =====

        editButton.addEventListener("click", function() {


            // Remember which order
            // is being edited.

            editingIndex =
                index;


            // Put existing order data
            // back into the form.

            customerNameInput.value =
                order.customerName;

            productInput.value =
                order.product;

            quantityInput.value =
                order.quantity;

            collectionDateInput.value =
                order.collectionDate;


            // Update quantity buttons.

            updateQuantityButtons();


            // Change submit button text.

            submitButton.textContent =
                "Update Order";


            // =================================================
            // ===== SCROLL TO FORM =====
            // =================================================
            //
            // Move the user back to the form
            // after clicking Edit Order.

            orderForm.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        });


        // Put Edit button into order card.

        orderCard.appendChild(editButton);


        // =================================================
        // ===== CRUD: DELETE =====
        // =================================================

        const deleteButton =
            document.createElement("button");

        deleteButton.textContent =
            "Delete Order";


        // Give Delete button a CSS class.

        deleteButton.classList.add("delete-button");


        // ===== DELETE EVENT =====

        deleteButton.addEventListener("click", function() {


            // Remove ONE order
            // at the current index.

            orders.splice(index, 1);


            // Display the updated array.

            displayOrders();

        });


        // Put Delete button into order card.

        orderCard.appendChild(deleteButton);


        // =================================================
        // ===== ADD ORDER CARD TO DOM =====
        // =================================================

        orderList.appendChild(orderCard);

    }


    // =====================================================
    // ===== EMPTY ORDER LIST =====
    // =====================================================

    if (orders.length === 0) {

        orderList.innerHTML =
            "<p>No orders yet.</p>";

    }

}


// =========================================================
// ===== FORM SUBMIT EVENT =====
// =========================================================

orderForm.addEventListener("submit", function(event) {


    // Stop browser page refresh.

    event.preventDefault();


    // =====================================================
    // ===== READ INPUT VALUES =====
    // =====================================================

    const customerName =
        customerNameInput.value;

    const product =
        productInput.value;

    const quantity =
        quantityInput.value;

    const collectionDate =
        collectionDateInput.value;


    // =====================================================
    // ===== OBJECT =====
    // =====================================================
    //
    // One order = one object.

    const order = {

        customerName: customerName,

        product: product,

        quantity: quantity,

        collectionDate: collectionDate

    };


    // =====================================================
    // ===== BRANCHING =====
    // =====================================================
    //
    // JavaScript decides:
    //
    // CREATE or UPDATE?


    // =====================================================
    // ===== CRUD: CREATE =====
    // =====================================================

    if (editingIndex === -1) {

        orders.push(order);

    }


    // =====================================================
    // ===== CRUD: UPDATE =====
    // =====================================================

    else {

        orders[editingIndex] =
            order;


        // Editing is finished.

        editingIndex =
            -1;


        // Change button back.

        submitButton.textContent =
            "Add Order";

    }


    // =====================================================
    // ===== CRUD: READ =====
    // =====================================================

    displayOrders();


    // =====================================================
    // ===== RESET FORM =====
    // =====================================================

    orderForm.reset();

    updateQuantityButtons();

});