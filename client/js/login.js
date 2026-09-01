document
.getElementById("loginForm")
.addEventListener("submit",login);

async function login(e){

    e.preventDefault();
    document.getElementById("message").innerText = "";

    const email=document.getElementById("email").value;

    const password=document.getElementById("password").value;

    const role=document.getElementById("role").value;

    try {

        const response=await api.post(

            "/auth/login",

            {

                email,

                password,

                role

            }

        );

        saveLogin(response);

        location.href="index.html";

    }

    catch(error){

        document.getElementById("message").innerText =

        error.message;

    }

}   
