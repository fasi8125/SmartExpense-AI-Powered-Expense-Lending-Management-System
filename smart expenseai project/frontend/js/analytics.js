const API = "http://127.0.0.1:5000";

document.addEventListener("DOMContentLoaded", async () => {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    // Logout
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("user");
            window.location.href = "login.html";
        });
    }

    const monthlyTotalEl = document.getElementById("monthlyTotal");
    const categoryList = document.getElementById("categoryList");
    const topCategoryEl = document.getElementById("topCategory");
    const predictionEl = document.getElementById("prediction");
    const riskEl = document.getElementById("riskLevel");

    try {

        // ==========================
        // Load Expenses
        // ==========================
        const res = await fetch(`${API}/expenses/${user.id}`);

        if (!res.ok) {
            throw new Error("Unable to fetch expenses");
        }

        const data = await res.json();
        const expenses = data.expenses || [];

        // ==========================
        // No Expenses
        // ==========================
        if (expenses.length === 0) {

            monthlyTotalEl.textContent = "₹0";
            predictionEl.textContent = "₹0";
            riskEl.textContent = "Low";

            topCategoryEl.textContent = "No expenses added yet";

            categoryList.innerHTML = `
                <li class="list-group-item text-center">
                    No Expenses Found
                </li>
            `;

            return;
        }

        // ==========================
        // Monthly Total
        // ==========================
        const currentMonth = new Date().toISOString().slice(0, 7);

        let monthTotal = 0;

        const categoryTotals = {};

        expenses.forEach(exp => {

            if (exp.date && exp.date.startsWith(currentMonth)) {

                const amount = Number(exp.amount);

                monthTotal += amount;

                categoryTotals[exp.category] =
                    (categoryTotals[exp.category] || 0) + amount;

            }

        });

        monthlyTotalEl.textContent = `₹${monthTotal}`;

        // ==========================
        // Category Breakdown
        // ==========================
        categoryList.innerHTML = "";

        const labels = [];
        const values = [];

        let highestCategory = "";
        let highestAmount = 0;

        Object.keys(categoryTotals).forEach(category => {

            labels.push(category);
            values.push(categoryTotals[category]);

            if (categoryTotals[category] > highestAmount) {

                highestAmount = categoryTotals[category];
                highestCategory = category;

            }

            categoryList.innerHTML += `
                <li class="list-group-item d-flex justify-content-between">
                    <span>${category}</span>
                    <strong>₹${categoryTotals[category]}</strong>
                </li>
            `;

        });

        topCategoryEl.innerHTML =
            highestCategory
                ? `Highest spending on <strong>${highestCategory}</strong>`
                : "No Category";

        // ==========================
        // Spending Risk
        // ==========================
        try {

            const riskRes = await fetch(`${API}/risk/${Math.round(monthTotal)}`);

            if (riskRes.ok) {

                const riskData = await riskRes.json();
                riskEl.textContent = riskData.risk;

            } else {

                riskEl.textContent = "Unavailable";

            }

        } catch {

            riskEl.textContent = "Unavailable";

        }

        // ==========================
        // Prediction
        // ==========================
        try {

            const predictionRes = await fetch(`${API}/predict-expense`);

            if (predictionRes.ok) {

                const prediction = await predictionRes.json();

                predictionEl.textContent =
                    `₹${Number(prediction.prediction).toFixed(2)}`;

            } else {

                predictionEl.textContent = "Unavailable";

            }

        } catch {

            predictionEl.textContent = "Unavailable";

        }

        // ==========================
        // Chart
        // ==========================
        const canvas = document.getElementById("expenseChart");

        if (canvas && labels.length > 0) {

            const ctx = canvas.getContext("2d");

            // Destroy old chart safely
            if (
                window.expenseChart &&
                typeof window.expenseChart.destroy === "function"
            ) {
                window.expenseChart.destroy();
            }

            window.expenseChart = new Chart(ctx, {

                type: "bar",

                data: {

                    labels: labels,

                    datasets: [{

                        label: "Expenses (₹)",

                        data: values,

                        backgroundColor: [
                            "#6d28d9",
                            "#8b5cf6",
                            "#9333ea",
                            "#7c3aed",
                            "#a855f7",
                            "#c084fc"
                        ],

                        borderRadius: 8

                    }]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {
                            display: false
                        }

                    },

                    scales: {

                        y: {
                            beginAtZero: true
                        }

                    }

                }

            });

        } else {

            categoryList.innerHTML += `
                <li class="list-group-item text-center text-muted">
                    No Chart Data Available
                </li>
            `;

        }

    } catch (error) {

        console.error("Analytics Error:", error);

        categoryList.innerHTML = `
            <li class="list-group-item text-danger text-center">
                Failed to load analytics.
            </li>
        `;

    }

});