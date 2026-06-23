const API = "http://127.0.0.1:5000";

document.addEventListener("DOMContentLoaded", () => {

    // ==========================
    // CHECK LOGIN
    // ==========================

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    // ==========================
    // LOAD PROFILE
    // ==========================

    const nameInput = document.getElementById("userName");
    const emailInput = document.getElementById("userEmail");

    nameInput.value = user.name || "";
    emailInput.value = user.email || "";

    // ==========================
    // SAVE PROFILE
    // ==========================

    document.getElementById("saveProfile").addEventListener("click", () => {

        user.name = nameInput.value;

        localStorage.setItem("user", JSON.stringify(user));

        alert("Profile Updated Successfully");

    });

    // ==========================
    // CHANGE PASSWORD (Demo)
    // ==========================

    document.getElementById("changePassword").addEventListener("click", () => {

        const password = document.getElementById("newPassword").value;

        if (password.length < 6) {

            alert("Password should contain at least 6 characters.");

            return;

        }

        alert("Password Changed Successfully (Demo)");

        document.getElementById("newPassword").value = "";

    });

    // ==========================
    // DARK MODE
    // ==========================

    const darkSwitch = document.getElementById("darkMode");

    if (localStorage.getItem("darkMode") === "true") {

        darkSwitch.checked = true;

        document.body.classList.add("dark-mode");

    }

    darkSwitch.addEventListener("change", () => {

        if (darkSwitch.checked) {

            document.body.classList.add("dark-mode");

            localStorage.setItem("darkMode", "true");

        } else {

            document.body.classList.remove("dark-mode");

            localStorage.setItem("darkMode", "false");

        }

    });

    // ==========================
    // EXPORT EXPENSES
    // ==========================

    document.getElementById("exportBtn").addEventListener("click", async () => {

        try {

            const response = await fetch(`${API}/expenses/${user.id}`);

            const data = await response.json();

            const blob = new Blob(

                [JSON.stringify(data.expenses, null, 2)],

                {

                    type: "application/json"

                }

            );

            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");

            a.href = url;

            a.download = "expenses.json";

            a.click();

            URL.revokeObjectURL(url);

        }

        catch {

            alert("Unable to export expenses.");

        }

    });

    // ==========================
    // CLEAR EXPENSES
    // ==========================

    document.getElementById("clearExpenses").addEventListener("click", async () => {

        const confirmDelete = confirm(

            "Are you sure you want to delete ALL expenses?"

        );

        if (!confirmDelete) return;

        try {

            const response = await fetch(`${API}/clear-expenses/${user.id}`, {

                method: "DELETE"

            });

            const result = await response.json();

            alert(result.message);

        }

        catch {

            alert("Unable to delete expenses.");

        }

    });

    // ==========================
    // LOGOUT
    // ==========================

    document.getElementById("logoutBtn").addEventListener("click", () => {

        localStorage.removeItem("user");

        localStorage.removeItem("darkMode");

        window.location.href = "login.html";

    });

});