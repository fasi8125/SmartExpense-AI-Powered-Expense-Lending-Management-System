document.addEventListener("DOMContentLoaded", async () => {

    const API = "http://127.0.0.1:5000";

    const user = JSON.parse(localStorage.getItem("user"));

    // ==========================
    // Authentication
    // ==========================

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    // ==========================
    // Logout
    // ==========================

    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener("click", () => {

            localStorage.removeItem("user");

            window.location.href = "login.html";

        });

    }

    try {

        // ==========================
        // Expenses
        // ==========================

        const expenseRes =
            await fetch(`${API}/expenses/${user.id}`);

        const expenseData =
            await expenseRes.json();

        const expenses =
            expenseData.expenses || [];

        const total =
            expenseData.total || 0;

        // Total Expense Card

        const totalExpense =
            document.getElementById("totalExpense");

        if (totalExpense)
            totalExpense.innerHTML = `₹${total}`;

        // This Month Card

        const monthTotal =
            document.getElementById("monthTotal");

        if (monthTotal)
            monthTotal.innerHTML = `₹${total}`;

        // ==========================
        // Top Category
        // ==========================

        let categoryTotals = {};

        expenses.forEach(exp => {

            const category = exp.category || "Other";

            categoryTotals[category] =
                (categoryTotals[category] || 0)
                + Number(exp.amount);

        });

        let topCategory = "No Data";

        if (Object.keys(categoryTotals).length > 0) {

            topCategory =
                Object.keys(categoryTotals).reduce((a, b) =>
                    categoryTotals[a] > categoryTotals[b]
                        ? a
                        : b
                );

        }

        const topCategoryEl =
            document.getElementById("topCategory");

        if (topCategoryEl)
            topCategoryEl.innerHTML = topCategory;

        // ==========================
        // Recent Expenses
        // ==========================

        const expenseList =
            document.getElementById("expenseList");

        if (expenseList) {

            expenseList.innerHTML = "";

            if (expenses.length === 0) {

                expenseList.innerHTML = `

                <li class="list-group-item text-center text-muted">

                    No expenses added yet.

                </li>

                `;

            } else {

                expenses
                .slice(0,5)
                .forEach(exp=>{

                    expenseList.innerHTML += `

                    <li class="list-group-item d-flex justify-content-between align-items-center">

                        <div>

                            <strong>${exp.category}</strong>

                            <br>

                            <small>

                            ${exp.description || "No Description"}

                            </small>

                        </div>

                        <strong>

                            ₹${exp.amount}

                        </strong>

                    </li>

                    `;

                });

            }

        }

        // ==========================
        // Lending Summary
        // ==========================

        try {

            const lendingRes =
                await fetch(`${API}/lending/summary/${user.id}`);

            const lendingData =
                await lendingRes.json();

            const pendingLending =
                document.getElementById("pendingLending");

            if (pendingLending) {

                pendingLending.innerHTML =
                    `₹${lendingData.pending || lendingData.total_pending || 0}`;

            }

        }

        catch {

            console.log("Lending API Failed");

        }

        // ==========================
        // AI Risk
        // ==========================

        try {

            const riskRes =
                await fetch(`${API}/risk/${Math.round(total)}`);

            const riskData =
                await riskRes.json();

            const risk =
                document.getElementById("riskLevel");

            if (risk)
                risk.innerHTML = riskData.risk;

        }

        catch {

            console.log("Risk API Failed");

        }

        // ==========================
        // AI Status
        // ==========================

        const metrics =
            document.querySelectorAll(".metric");

        if (metrics.length >= 3) {

            metrics[2].innerHTML = "Ready";

        }

    }

    catch (error) {

        console.error(error);

        alert("Unable to load dashboard.");

    }

});