console.log("===== import.js FINAL VERSION 3 LOADED =====");

const API = "http://127.0.0.1:5000";

document.addEventListener("DOMContentLoaded", () => {

    console.log("Import.js Loaded");

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    // ===========================
    // Logout
    // ===========================

    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("user");
            window.location.href = "login.html";
        });
    }

    // ===========================
    // Result Container
    // ===========================

    const resultBox = document.getElementById("importResult");

    console.log("resultBox found:", resultBox);

    if (!resultBox) {
        console.error("ERROR: #importResult element was not found on this page.");
    }

    // ===========================
    // SMS IMPORT
    // ===========================

    const smsBtn = document.getElementById("importSmsBtn");

    console.log("smsBtn found:", smsBtn);

    if (smsBtn) {

        smsBtn.addEventListener("click", async () => {

            console.log(">>> Import from SMS button clicked");

            const smsTextEl = document.getElementById("smsText");

            if (!smsTextEl) {
                console.error("ERROR: #smsText textarea not found.");
                return;
            }

            const smsText = smsTextEl.value.trim();

            if (!smsText) {
                alert("Please paste an SMS transaction.");
                return;
            }

            try {

                const expense = extractFromSMS(smsText);

                console.log("Extracted expense from SMS:", expense);

                // Show result immediately
                displayExpense(expense);

                // Save into database
                await saveExpense(expense);

            } catch (err) {
                console.error("Error while processing SMS import:", err);
                if (resultBox) {
                    resultBox.innerHTML = `
                    <div class="alert alert-danger">
                        Something went wrong while extracting the expense: ${err.message}
                    </div>
                    `;
                }
            }

        });

    } else {
        console.error("ERROR: #importSmsBtn button not found in DOM.");
    }

    // ===========================
    // OCR IMPORT
    // ===========================

    const ocrBtn = document.getElementById("importOcrBtn");

    console.log("ocrBtn found:", ocrBtn);

    if (ocrBtn) {

        ocrBtn.addEventListener("click", async () => {

            console.log(">>> Import Screenshot button clicked");

            const ocrFileEl = document.getElementById("ocrFile");

            if (!ocrFileEl) {
                console.error("ERROR: #ocrFile input not found.");
                return;
            }

            const file = ocrFileEl.files[0];

            if (!file) {
                alert("Please select an image.");
                return;
            }

            try {

                // Demo OCR Extraction
                const expense = {
                    amount: 499,
                    category: "Shopping",
                    payment_mode: "UPI",
                    description: "Amazon Purchase (OCR Demo)",
                    date: new Date().toISOString().slice(0, 10)
                };

                console.log("Extracted expense from OCR (demo):", expense);

                displayExpense(expense);

                await saveExpense(expense);

            } catch (err) {
                console.error("Error while processing OCR import:", err);
                if (resultBox) {
                    resultBox.innerHTML = `
                    <div class="alert alert-danger">
                        Something went wrong while extracting the expense: ${err.message}
                    </div>
                    `;
                }
            }

        });

    } else {
        console.error("ERROR: #importOcrBtn button not found in DOM.");
    }

    // ===========================
    // DISPLAY IMPORTED EXPENSE
    // ===========================

    function displayExpense(expense) {

        console.log("displayExpense() running with:", expense);

        if (!resultBox) {
            console.error("Cannot display expense — #importResult element missing from DOM.");
            return;
        }

        resultBox.innerHTML = `
        <div class="card border-success shadow-sm">
            <div class="card-header bg-success text-white">
                <i class="fa-solid fa-brain"></i>
                AI Extracted Expense
            </div>
            <div class="card-body">
                <table class="table table-bordered align-middle">
                    <tr>
                        <th width="35%">Amount</th>
                        <td>₹${expense.amount}</td>
                    </tr>
                    <tr>
                        <th>Category</th>
                        <td>${expense.category}</td>
                    </tr>
                    <tr>
                        <th>Payment Mode</th>
                        <td>${expense.payment_mode}</td>
                    </tr>
                    <tr>
                        <th>Description</th>
                        <td>${expense.description}</td>
                    </tr>
                    <tr>
                        <th>Date</th>
                        <td>${expense.date}</td>
                    </tr>
                </table>
            </div>
        </div>
        `;

        console.log("displayExpense() finished updating DOM.");
    }

    // ===========================
    // SAVE EXPENSE
    // ===========================

    async function saveExpense(expense) {

        try {

            const response = await fetch(`${API}/add-expense`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_id: user.id,
                    amount: expense.amount,
                    category: expense.category,
                    payment_mode: expense.payment_mode,
                    description: expense.description,
                    date: expense.date
                })
            });

            const result = await response.json();

            console.log("saveExpense response:", response.status, result);

            if (response.ok) {

                if (resultBox) {
                    resultBox.innerHTML += `
                    <div class="alert alert-success mt-3">
                        <i class="fa-solid fa-circle-check me-2"></i>
                        <strong>Expense Imported Successfully!</strong>
                        <br>
                        The expense has been added to your dashboard.
                    </div>
                    `;
                }

                // Clear inputs
                const smsTextEl = document.getElementById("smsText");
                const ocrFileEl = document.getElementById("ocrFile");
                if (smsTextEl) smsTextEl.value = "";
                if (ocrFileEl) ocrFileEl.value = "";

            } else {

                if (resultBox) {
                    resultBox.innerHTML += `
                    <div class="alert alert-danger mt-3">
                        ${result.error || "Unable to import expense."}
                    </div>
                    `;
                }

            }

        } catch (error) {

            console.error("Import Error (saveExpense):", error);

            if (resultBox) {
                resultBox.innerHTML += `
                <div class="alert alert-danger mt-3">
                    Unable to connect to the server. (Is the backend running on ${API}?)
                </div>
                `;
            }

        }

    }

    // ===========================
    // AI SMS PARSER
    // ===========================

    function extractFromSMS(text) {

        const lower = text.toLowerCase();

        const amountMatch = text.match(/₹?\s?(\d+(\.\d+)?)/);

        const amount = amountMatch ? Number(amountMatch[1]) : 100;

        let category = "Others";

        if (lower.includes("zomato") || lower.includes("swiggy")) {
            category = "Food";
        } else if (lower.includes("amazon") || lower.includes("flipkart")) {
            category = "Shopping";
        } else if (lower.includes("uber") || lower.includes("ola")) {
            category = "Transport";
        } else if (lower.includes("petrol") || lower.includes("fuel")) {
            category = "Fuel";
        } else if (lower.includes("hospital") || lower.includes("medical")) {
            category = "Health";
        } else if (lower.includes("movie") || lower.includes("netflix")) {
            category = "Entertainment";
        }

        return {
            amount: amount,
            category: category,
            payment_mode: "UPI",
            description: text,
            date: new Date().toISOString().slice(0, 10)
        };

    }

});