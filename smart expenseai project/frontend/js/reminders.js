const API = "http://127.0.0.1:5000";

// -------------------------
// Get Logged-in User
// -------------------------
const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    alert("Please login first.");
    window.location.href = "login.html";
}

const user_id = user.id;

// -------------------------
// Load Reminders
// -------------------------
async function loadReminders() {

    try {

        const res = await fetch(`${API}/reminders/${user_id}`);
        const reminders = await res.json();

        const list = document.getElementById("reminderList");
        list.innerHTML = "";

        if (reminders.length === 0) {
            list.innerHTML =
                `<li class="list-group-item text-center">
                    No reminders found.
                </li>`;
            return;
        }

        reminders.forEach(reminder => {

            list.innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center">

                <div>

                    <h6 class="mb-1">${reminder.title}</h6>

                    <small class="text-muted">
                        Due :
                        ${reminder.due_date}
                    </small>

                </div>

                <span class="badge bg-warning">
                    ${reminder.status}
                </span>

            </li>
            `;

        });

    }
    catch (err) {

        console.error(err);

    }

}

// -------------------------
// Add Reminder
// -------------------------
document
.getElementById("reminderForm")
.addEventListener("submit", async function(e){

    e.preventDefault();

    const person =
        document.getElementById("person").value;

    const amount =
        document.getElementById("amount").value;

    const date =
        document.getElementById("date").value;

    const title =
        `Collect ₹${amount} from ${person}`;

    const response = await fetch(`${API}/reminders`,{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            user_id:user_id,

            title:title,

            due_date:date

        })

    });

    const data = await response.json();

    if(response.ok){

        alert(data.message);

        document
        .getElementById("reminderForm")
        .reset();

        loadReminders();

    }
    else{

        alert(data.error);

    }

});

// -------------------------
// Logout
// -------------------------
const logoutBtn = document.getElementById("logoutBtn");

if(logoutBtn){

logoutBtn.onclick=function(){

localStorage.removeItem("user");

window.location="login.html";

};

}

// -------------------------
loadReminders();