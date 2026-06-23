const API = "http://127.0.0.1:5000";

// -------------------------
// Logged-in User
// -------------------------
const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    window.location.href = "login.html";
}

const user_id = user.id;

// -------------------------
// Load Khata
// -------------------------
async function loadKhata() {

    try {

        const response = await fetch(`${API}/khata/${user_id}`);

        if (!response.ok) {
            throw new Error("Unable to load Khata");
        }

        const data = await response.json();

        console.log("Khata Response:", data);

        const transactions = Array.isArray(data)
            ? data
            : (data.transactions || []);

        const list = document.getElementById("khataList");

        list.innerHTML = "";

        let totalGiven = 0;
        let totalReceived = 0;

        if (transactions.length === 0) {

            list.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-muted">
                        No Transactions Found
                    </td>
                </tr>
            `;

            document.getElementById("totalGiven").innerHTML = "₹0";
            document.getElementById("totalReceived").innerHTML = "₹0";
            document.getElementById("balance").innerHTML = "₹0";

            return;
        }

        transactions.forEach(t => {

            const amount = Number(t.amount) || 0;

            if (t.type === "gave") {
                totalGiven += amount;
            } else {
                totalReceived += amount;
            }

            list.innerHTML += `
                <tr>
                    <td>${t.person}</td>
                    <td>${t.description || "-"}</td>
                    <td>₹${amount}</td>
                    <td>
                        <span class="badge ${t.type === "gave" ? "bg-danger" : "bg-success"}">
                            ${t.type}
                        </span>
                    </td>
                    <td>${t.date || "-"}</td>
                </tr>
            `;
        });

        document.getElementById("totalGiven").innerHTML = `₹${totalGiven}`;
        document.getElementById("totalReceived").innerHTML = `₹${totalReceived}`;
        document.getElementById("balance").innerHTML = `₹${totalReceived - totalGiven}`;

    } catch (error) {

        console.error(error);

        document.getElementById("khataList").innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-danger">
                    Failed to load transactions.
                </td>
            </tr>
        `;
    }
}

// -------------------------
// Add Transaction
// -------------------------
async function addKhata(){

    const person=document.getElementById("person").value.trim();

    const description=document.getElementById("desc").value.trim();

    const amount=document.getElementById("amount").value;

    const type=document.getElementById("type").value;

    if(person==="" || amount===""){

        alert("Please fill all required fields");

        return;

    }

    const response=await fetch(`${API}/khata`,{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            user_id,
            person,
            description,
            amount,
            type

        })

    });

    const data=await response.json();

    if(response.ok){

        alert(data.message);

        document.getElementById("person").value="";
        document.getElementById("desc").value="";
        document.getElementById("amount").value="";

        loadKhata();

    }

    else{

        alert(data.error || "Unable to add transaction");

    }

}

// -------------------------
// Logout
// -------------------------
const logout=document.getElementById("logoutBtn");

if(logout){

logout.onclick=function(){

localStorage.removeItem("user");

window.location.href="login.html";

}

}

loadKhata();