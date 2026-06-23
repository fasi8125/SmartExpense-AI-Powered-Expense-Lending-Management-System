document.addEventListener("DOMContentLoaded", () => {
    const expenseForm = document.getElementById("expenseForm");

    if (!expenseForm) return;

    expenseForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
            alert("Please login again.");
            window.location.href = "login.html";
            return;
        }

        const amount = document.getElementById("amount").value;
        const category = document.getElementById("category").value;
        const paymentMode = document.getElementById("paymentMode").value;
        const description = document.getElementById("description").value;
        const date = document.getElementById("date").value;

        try {
            const response = await fetch("http://127.0.0.1:5000/add-expense", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_id: user.id,
                    amount: amount,
                    category: category,
                    payment_mode: paymentMode,
                    description: description,
                    date: date
                })
            });

            const data = await response.json();
            if (response.ok) {
                const predictedCategory = data.category;

                alert(
                    predictedCategory
                    ? `Expense saved! Category predicted: ${predictedCategory}`
                    : "Expense saved successfully!"
                );

                expenseForm.reset();
            }

            else {
                alert(data.error || "Failed to save expense");
            }

        } catch (error) {
            alert("Server error. Try again later.");
        }
    });
});
