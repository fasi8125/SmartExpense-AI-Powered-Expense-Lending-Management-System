document.addEventListener("DOMContentLoaded", async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const lendingList = document.getElementById("lendingList");
    const pendingAmountEl = document.getElementById("pendingAmount");
    const repaidAmountEl = document.getElementById("repaidAmount");
    const lendingForm = document.getElementById("lendingForm");

    // Load lending records
    async function loadLending() {
        try {
            const res = await fetch(
                `http://127.0.0.1:5000/lending/${user.id}`
            );
            const data = await res.json();

            lendingList.innerHTML = "";

            if (data.length === 0) {
                lendingList.innerHTML =
                    `<li class="list-group-item text-muted">No lending records yet</li>`;
                return;
            }

            data.forEach(item => {
                const li = document.createElement("li");
                li.className =
                    "list-group-item d-flex justify-content-between align-items-center";

                li.innerHTML = `
                    <div>
                        <strong>${item.name}</strong><br>
                        <span class="text-muted">₹${item.amount}</span>
                    </div>
                    <span class="badge ${
                        item.status === "repaid"
                            ? "bg-success"
                            : "bg-warning"
                    }">
                        ${item.status.toUpperCase()}
                    </span>
                `;

                lendingList.appendChild(li);
            });
        } catch (e) {
            lendingList.innerHTML =
                `<li class="list-group-item text-danger">Failed to load data</li>`;
        }
    }

    // Load summary
    async function loadSummary() {
        try {
            const res = await fetch(
                `http://127.0.0.1:5000/lending/summary/${user.id}`
            );
            const data = await res.json();

            pendingAmountEl.textContent = `₹${data.total_pending}`;
            repaidAmountEl.textContent = `₹${data.total_repaid}`;
        } catch {
            pendingAmountEl.textContent = "₹0";
            repaidAmountEl.textContent = "₹0";
        }
    }

    // Add lending record
    lendingForm.addEventListener("submit", async e => {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const amount = document.getElementById("amount").value;
        const status = document.getElementById("status").value;

        try {
            await fetch("http://127.0.0.1:5000/lending", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: user.id,
                    name,
                    amount,
                    status
                })
            });

            lendingForm.reset();
            loadLending();
            loadSummary();
        } catch {
            alert("Failed to add lending record");
        }
    });

    loadLending();
    loadSummary();
});
