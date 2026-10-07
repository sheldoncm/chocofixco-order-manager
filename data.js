// =========================================================
// CHOCOFIXCO - DATA / API CONFIGURATION
// =========================================================
//
// STUDY NOTE:
// data.js keeps API information separate from script.js.
//
// data.js   = WHERE the data comes from
// script.js = WHAT the application does
//
// JSONBin is the external SaaS/API used by this project.
// =========================================================


// =========================================================
// ===== JSONBIN BIN ID =====
// =========================================================
//
// This identifies our ChocoFixCo Orders JSON document.

const BIN_ID =
    "6ac5cc69ffd5d1605354cd60";


// =========================================================
// ===== JSONBIN API URLS =====
// =========================================================
//
// GET uses /latest to retrieve the latest version.
//
// PUT uses the base bin URL to replace/update
// the JSON document.

const JSONBIN_URL =
    `https://api.jsonbin.io/v3/b/${BIN_ID}`;

const JSONBIN_LATEST_URL =
    `${JSONBIN_URL}/latest`;


// =========================================================
// ===== ACCESS KEY =====
// =========================================================
//
// Paste your JSONBin Access Key between the quotes
// while running the assessment project.
//
// We do not commit a real secret into a public GitHub repo.
//
// The request header used by JSONBin is:
// X-Access-Key

const ACCESS_KEY =
    "";


// =========================================================
// ===== HTTP HEADERS =====
// =========================================================
//
// Content-Type tells the API that our data is JSON.
//
// X-Access-Key gives permission to access the bin.

const JSONBIN_HEADERS = {

    "Content-Type": "application/json",

    "X-Access-Key": ACCESS_KEY

};
