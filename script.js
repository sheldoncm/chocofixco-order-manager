// =========================================================
// CHOCOFIXCO - JAVASCRIPT NOTES
//
// HTML = WHAT is on the page
// CSS  = HOW it looks
// JS   = WHAT it does
//
// ===== ASSESSMENT EVIDENCE MAP =====
// LO4 Variables / functions / branching / loops:
//     orders, editingIndex, functions, if/else, for loops
// LO5 Arrays / objects:
//     orders[] and heroSlides[] contain objects
// LO6 Structured programming:
//     reusable functions divide responsibilities
// LO7 DOM:
//     selection + src / alt / value / disabled / textContent
// LO8 Events:
//     click, input and submit event listeners
// LO9 UI/UX:
//     responsive CSS, hamburger menu, carousel, accessible labels
// LO10 Async:
//     async functions + await
// LO11 AJAX / HTTP:
//     Axios GET + PUT
// LO12 REST API / SaaS:
//     JSONBin API configured in data.js
// CRUD:
//     Create, Read, Update and Delete/Cancel customer orders
// =========================================================


// =========================================================
// ===== ARRAY =====
// =========================================================
//
// Stores all our order objects.

// GET will replace this with the array stored in JSONBin,
// therefore this variable must be declared with let.

let orders = [];


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
    document.querySelector(".submit-order-button");




// =========================================================
// ===== RESPONSIVE HAMBURGER MENU =====
// ===== LO7: DOM SELECTION / LO8: EVENT HANDLER =====
// =========================================================
//
// ASSESSMENT / ORAL QUESTIONS:
//
// Q: How do you select an HTML element with JavaScript?
// A: I use DOM selection methods such as getElementById()
//    and querySelector().
//
// Q: What is an event handler?
// A: It is code that runs when an event happens.
//    Here, addEventListener("click", ...) waits for the
//    customer to click the hamburger button.
//
// Q: How do you manipulate the DOM?
// A: classList.toggle() adds/removes the "open" CSS class.
//    CSS uses that class to show or hide the mobile menu.
//
// Q: How is the website mobile responsive?
// A: CSS media queries change the layout on smaller screens,
//    and JavaScript controls the hamburger navigation.
// =========================================================

const menuToggle =
    document.getElementById("menu-toggle");

const navigationLinks =
    document.getElementById("nav-links");


// ===== MOBILE MENU CLICK EVENT =====

menuToggle.addEventListener("click", function() {

    // toggle() adds "open" when it is missing,
    // and removes "open" when it already exists.

    navigationLinks.classList.toggle("open");


    // contains() returns true when the class exists.
    // This Boolean value tells us whether the menu is open.

    const menuIsOpen =
        navigationLinks.classList.contains("open");


    // setAttribute() modifies an HTML attribute in the DOM.

    menuToggle.setAttribute(
        "aria-expanded",
        menuIsOpen
    );


    // ===== BRANCHING =====
    // Change the accessible label depending on state.

    if (menuIsOpen === true) {

        menuToggle.setAttribute(
            "aria-label",
            "Close navigation menu"
        );

    }

    else {

        menuToggle.setAttribute(
            "aria-label",
            "Open navigation menu"
        );

    }

});


// ===== CLOSE MOBILE MENU AFTER SELECTING A LINK =====
//
// querySelectorAll() returns all matching navigation links.
// for...of loops through the collection.

const mobileNavigationLinks =
    navigationLinks.querySelectorAll("a");

for (const navigationLink of mobileNavigationLinks) {

    navigationLink.addEventListener("click", function() {

        navigationLinks.classList.remove("open");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Open navigation menu"
        );

    });

}


// =========================================================
// ===== HERO CAROUSEL =====
// ===== ARRAY + INDEX + EVENTS + DOM MANIPULATION =====
// =========================================================
//
// CAROUSEL = multiple images displayed in the same area.
// The floating "Shop Chocolates" CTA is positioned in CSS.
// It is kept separate from the carousel logic.
//
// Q: Where is the ARRAY?
// A: heroSlides stores three OBJECTS inside an ARRAY.
//
// Q: What is an OBJECT?
// A: Each slide object groups related properties:
//    image and alt.
//
// Q: What is an INDEX?
// A: currentSlide stores the position in the array.
//    Arrays start at index 0.
//
// Q: Where is DOM manipulation used?
// A: showHeroSlide() changes heroCarouselImage.src,
//    heroCarouselImage.alt and the dot CSS classes.
//
// Q: Where are EVENT HANDLERS used?
// A: Previous, Next and each indicator dot listen for clicks.
//
// Q: Why use a FUNCTION?
// A: showHeroSlide() keeps the carousel update logic in
//    one reusable block instead of repeating the same code.
// =========================================================

const heroSlides = [
    {
        image: "images/chocofixco-products/03_hero.jpg",
        alt: "ChocoFixCo handmade chocolate selection"
    },
    {
        image: "images/chocofixco-products/09_truffles-selection.jpg",
        alt: "ChocoFixCo chocolate truffle selection"
    },
    {
        image: "images/chocofixco-products/10_heart-chocolates.jpg",
        alt: "ChocoFixCo heart shaped chocolates"
    }
];

let currentSlide = 0;

const heroCarouselImage =
    document.getElementById("hero-carousel-image");

const carouselPreviousButton =
    document.getElementById("carousel-previous");

const carouselNextButton =
    document.getElementById("carousel-next");

const carouselDots =
    document.querySelectorAll(".carousel-dot");


function showHeroSlide(slideIndex) {

    // ===== BRANCHING =====
    // Wrap from the first slide to the last slide.

    if (slideIndex < 0) {
        slideIndex = heroSlides.length - 1;
    }

    // Wrap from the last slide back to the first slide.

    if (slideIndex >= heroSlides.length) {
        slideIndex = 0;
    }

    currentSlide = slideIndex;

    // ===== DOM PROPERTY CHANGES =====
    // Requirement evidence: we modify src and alt
    // on the hero <img> element.

    heroCarouselImage.src =
        heroSlides[currentSlide].image;

    heroCarouselImage.alt =
        heroSlides[currentSlide].alt;


    // ===== LOOP =====
    // Update which indicator dot has the active class.

    for (let index = 0; index < carouselDots.length; index++) {

        if (index === currentSlide) {
            carouselDots[index].classList.add("active");
        }

        else {
            carouselDots[index].classList.remove("active");
        }

    }

}


// ===== CAROUSEL EVENT: PREVIOUS =====

carouselPreviousButton.addEventListener("click", function() {

    showHeroSlide(currentSlide - 1);

});


// ===== CAROUSEL EVENT: NEXT =====

carouselNextButton.addEventListener("click", function() {

    showHeroSlide(currentSlide + 1);

});


// ===== CAROUSEL EVENT: INDICATOR DOTS =====
//
// for...of loops through every dot.
// dataset.slide reads the HTML data-slide attribute.
// Number() converts the String into a Number.

for (const carouselDot of carouselDots) {

    carouselDot.addEventListener("click", function() {

        const selectedSlide =
            Number(carouselDot.dataset.slide);

        showHeroSlide(selectedSlide);

    });

}


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
// ===== LO10 / LO11 / LO12: AJAX + ASYNC + API =====
// =========================================================
//
// ORAL ANSWER:
//
// AJAX allows JavaScript to send HTTP requests to an API
// and receive data without reloading the whole webpage.
//
// Axios is the library used to make the HTTP requests.
//
// async / await handles the asynchronous operation.
// JavaScript waits for the API response, then works
// with the returned result.
//
// JSONBin is our external SaaS REST API.
//
// HTTP GET = READ data.
// HTTP PUT = UPDATE/REPLACE the JSON document.
// =========================================================


// =========================================================
// ===== HTTP GET / CRUD READ =====
// =========================================================
//
// The lecturer's Axios style is:
//
// const { data } = await axios.get(...);
//
// { data } extracts the data property
// from the Axios response object.
//
// JSONBin returns:
//
// {
//     "record": {
//         "orders": []
//     }
// }
//
// Therefore the array is:
// data.record.orders

async function getOrders() {

    try {

        const { data } =
            await axios.get(
                JSONBIN_LATEST_URL,
                {
                    headers: JSONBIN_HEADERS
                }
            );

        // ===== ARRAY CHECK =====

        if (Array.isArray(data.record.orders)) {

            orders =
                data.record.orders;

        }

        else {

            orders =
                [];

        }


        // Function call:
        // display the API result in the DOM.

        displayOrders();

        console.log(
            "GET orders:",
            orders
        );

    }

    catch (error) {

        console.error(
            "Could not load orders:",
            error
        );

        orderList.innerHTML =
            "<p>Could not load orders.</p>";

    }

}


// =========================================================
// ===== HTTP PUT =====
// =========================================================
//
// JSONBin stores ONE JSON document:
//
// {
//     "orders": [ ... ]
// }
//
// Our application changes objects inside the orders array,
// then PUT saves the complete updated document.
//
// IMPORTANT ORAL ANSWER:
//
// The app has CRUD functionality for individual orders.
//
// JSONBin itself stores the orders as one document,
// therefore Create/Edit/Delete modify the JavaScript array
// and HTTP PUT persists the changed array.
//
// Calling JSONBin DELETE would delete the whole bin,
// not one order.

async function saveOrders() {

    const updatedData = {

        orders: orders

    };

    await axios.put(
        JSONBIN_URL,
        updatedData,
        {
            headers: JSONBIN_HEADERS
        }
    );

    console.log(
        "PUT orders:",
        orders
    );

}


// =========================================================
// ===== DOM MANIPULATION / CRUD READ =====
// =========================================================
//
// displayOrders() changes the webpage using the DOM.
//
// Examples below include:
//
// innerHTML
// textContent
// classList.add()
// createElement()
// appendChild()
//
// These satisfy DOM interaction requirements.
// =========================================================


// =========================================================
// ===== LO6: FUNCTION RETURN VALUE PASSED AS ARGUMENT =====
// =========================================================
//
// ASSESSMENT REQUIREMENT:
//
// Have at least one function whose RETURN VALUE
// is passed as an ARGUMENT to another function.
//
// Step 1:
// createOrderCardContent(order)
// RETURNS the HTML text for one order.
//
// Step 2:
// That returned value is passed directly into:
//
// setOrderCardContent(orderCard, RETURNED VALUE)
//
// The actual function call is:
//
// setOrderCardContent(
//     orderCard,
//     createOrderCardContent(order)
// );
//
// ORAL ANSWER:
//
// createOrderCardContent() returns a value.
// I pass that returned value as the second argument
// of setOrderCardContent().
// =========================================================

function createOrderCardContent(order) {

    // || is a LOGICAL OPERATOR.
    // It provides a fallback for older saved orders.

    return `
        <h3>${order.customerName}</h3>
        <p>Product: ${order.product}</p>
        <p>Quantity: ${order.quantity}</p>
        <p>Collection Date: ${order.collectionDate}</p>
        <p>Status: <strong>${order.orderStatus || "Order Received"}</strong></p>
        <p>Payment: <strong>${order.paymentStatus || "Pending"}</strong></p>
    `;

}


function setOrderCardContent(element, content) {

    element.innerHTML =
        content;

}


// =========================================================
// ===== LO7: DOM MANIPULATION =====
// =========================================================
//
// The customer order cards below demonstrate DOM selection
// and DOM property changes.
//
// ASSESSMENT: modify at least 3 properties across 2 DOM elements.
//
// Examples in this project:
// 1. heroCarouselImage.src
// 2. heroCarouselImage.alt
// 3. quantityInput.value
// 4. decreaseQuantityButton.disabled
// 5. submitButton.textContent
//
// We therefore exceed the minimum requirement.
//
// Other DOM methods used:
// innerHTML, classList.add(), createElement(), appendChild().
//
// ORAL ANSWER:
// "I use JavaScript to select HTML elements and change
// their properties when the customer interacts with the page."
// =========================================================


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
        //
        // createOrderCardContent(order) RETURNS the HTML.
        //
        // That return value is passed as an ARGUMENT
        // into setOrderCardContent().
        //
        // This directly demonstrates the assessment
        // requirement for function return values.

        setOrderCardContent(
            orderCard,
            createOrderCardContent(order)
        );


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
            "Cancel Order";


        // Give Delete button a CSS class.

        deleteButton.classList.add("delete-button");


        // ===== DELETE EVENT =====

        deleteButton.addEventListener("click", async function() {

            // confirm() protects the customer from
            // cancelling an order by accident.

            const customerConfirmed =
                confirm("Cancel this order?");

            if (customerConfirmed === false) {
                return;
            }


            // Remove ONE order from the ARRAY.
            //
            // splice() changes the array.

            orders.splice(index, 1);


            // HTTP PUT saves the changed array
            // to JSONBin.

            try {

                await saveOrders();

                displayOrders();

            }

            catch (error) {

                console.error(
                    "Could not delete order:",
                    error
                );


                // Reload the API version so our
                // local array stays in sync.

                await getOrders();

            }

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
// ===== PRODUCT CARD EVENTS =====
// =========================================================
//
// querySelectorAll() selects ALL product order links.
// for...of loops through them.
// A click fills the product dropdown automatically.
//
// This gives the customer a smoother journey from
// browsing a product to placing an order.
// =========================================================

const productOrderLinks =
    document.querySelectorAll(".product-order-link");

for (const productOrderLink of productOrderLinks) {

    productOrderLink.addEventListener("click", function() {

        productInput.value =
            productOrderLink.dataset.product;

    });

}


// =========================================================
// ===== LO8: EVENT DRIVEN PROGRAMMING =====
// ===== FORM SUBMIT EVENT =====
// =========================================================
//
// ORAL ANSWER:
//
// Event-driven programming means the program responds
// when the user performs an action.
//
// Examples in this project:
//
// click  -> hamburger, carousel, quantity, Edit, Delete
// input  -> manual quantity change
// submit -> Add/Update order
//
// addEventListener() connects the event to a function.
// =========================================================

orderForm.addEventListener("submit", async function(event) {


    // preventDefault() stops the browser
    // from refreshing when the form submits.

    event.preventDefault();


    // =====================================================
    // ===== READ INPUT VALUES =====
    // =====================================================

    const customerName =
        customerNameInput.value;

    const product =
        productInput.value;

    const quantity =
        Number(quantityInput.value);

    const collectionDate =
        collectionDateInput.value;

    // =====================================================
    // ===== LO5: OBJECT =====
    // =====================================================
    //
    // One order is represented by one object.
    //
    // It has properties:
    // customerName, product, quantity, collectionDate,
// orderStatus and paymentStatus.
//
// The customer does not choose operational status.
// New orders start as Order Received and Pending payment.

    // Default values for a NEW order.

    let orderStatus =
        "Order Received";

    let paymentStatus =
        "Pending";


    // When editing, keep the existing status values.
    // || is a LOGICAL OPERATOR and provides a fallback.

    if (editingIndex !== -1) {

        orderStatus =
            orders[editingIndex].orderStatus || "Order Received";

        paymentStatus =
            orders[editingIndex].paymentStatus || "Pending";

    }


    const order = {

        customerName: customerName,

        product: product,

        quantity: quantity,

        collectionDate: collectionDate,

        orderStatus: orderStatus,

        paymentStatus: paymentStatus

    };


    // =====================================================
    // ===== LO4: BRANCHING / COMPARISON =====
    // =====================================================
    //
    // === is a comparison operator.
    //
    // if / else is branching.
    //
    // The program decides whether the user
    // is creating or updating an order.


    // =====================================================
    // ===== CRUD: CREATE =====
    // =====================================================

    if (editingIndex === -1) {

        // push() adds the object to the ARRAY.

        orders.push(order);

    }


    // =====================================================
    // ===== CRUD: UPDATE =====
    // =====================================================

    else {

        orders[editingIndex] =
            order;

        editingIndex =
            -1;

        // DOM property modification:
        // textContent changes the button text.

        submitButton.textContent =
            "Place Order";

    }


    try {

        // =================================================
        // ===== LO10: ASYNCHRONOUS OPERATION =====
        // ===== LO11: AJAX HTTP PUT =====
        // =================================================
        //
        // await waits until saveOrders() finishes.

        await saveOrders();


        // =================================================
        // ===== CRUD: READ / DOM UPDATE =====
        // =================================================

        displayOrders();


        // Reset the HTML form.

        orderForm.reset();

        updateQuantityButtons();

    }

    catch (error) {

        console.error(
            "Could not save order:",
            error
        );

        await getOrders();

    }

});


// =========================================================
// ===== LO6: STRUCTURED PROGRAMMING =====
// =========================================================
//
// ORAL ANSWER:
//
// Instead of putting everything into one large block,
// the application is divided into functions with
// specific responsibilities.
//
// Examples:
//
// updateQuantityButtons()
// getOrders()
// saveOrders()
// displayOrders()
//
// This makes the program easier to read,
// test and maintain.
// =========================================================


// =========================================================
// ===== INITIAL API CALL =====
// =========================================================
//
// When the webpage opens:
//
// 1. getOrders() sends an AJAX HTTP GET.
// 2. Axios receives JSON from JSONBin.
// 3. orders receives the array.
// 4. displayOrders() updates the DOM.

getOrders();
