// ==============================
// REGISTER
// ==============================
document.addEventListener("DOMContentLoaded", () => {

    const registerForm = document.getElementById("registerForm");

    if (registerForm) {

        registerForm.addEventListener("submit", async (e) => {

            e.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            if (password !== confirmPassword) {
                alert("Passwords do not match.");
                return;
            }

            try {

                const response = await fetch("http://127.0.0.1:5000/register", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })

                });

                const data = await response.json();

                if (response.ok) {

                    alert("Registration Successful!");

                    setTimeout(() => {

                        window.location.href = "login.html";

                    },1000);

                }

                else{

                    alert(data.error || "Registration Failed");

                }

            }

            catch(error){

                console.error(error);

                alert("Unable to connect to server.");

            }

        });

    }

});

// ==============================
// LOGIN
// ==============================

document.addEventListener("DOMContentLoaded",()=>{

    const loginForm=document.getElementById("loginForm");

    if(loginForm){

        loginForm.addEventListener("submit",async(e)=>{

            e.preventDefault();

            const email=document.getElementById("loginEmail").value.trim();

            const password=document.getElementById("loginPassword").value;

            try{

                const response=await fetch("http://127.0.0.1:5000/login",{

                    method:"POST",

                    headers:{
                        "Content-Type":"application/json"
                    },

                    body:JSON.stringify({

                        email,
                        password

                    })

                });

                const data=await response.json();

                if(response.ok){

                    localStorage.setItem("user",JSON.stringify(data.user));

                    window.location.href="dashboard.html";

                }

                else{

                    alert(data.error || "Invalid Email or Password");

                }

            }

            catch(error){

                console.error(error);

                alert("Unable to connect to server.");

            }

        });

    }

}); 