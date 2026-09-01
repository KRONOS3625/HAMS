document.addEventListener("DOMContentLoaded", async () => {

    if (!isLoggedIn()) {

        location.href = "login.html";

        return;

    }

    try {

        const response = await api.get("/auth/me");

        const user = response.user;

        localStorage.setItem("user", JSON.stringify(user));

        document.getElementById("username").innerText =
            user.name;

        createSidebar(user.role);

        Router.navigate("dashboard");

        document
            .getElementById("logoutBtn")
            .onclick = logout;

    }

    catch {

        logout();

    }

});

function createSidebar(role){

let menu=[];

if(role==="employee"){

menu=[

["dashboard","Dashboard"],

["raise","Raise Complaint"],

["complaints","My Complaints"],

["profile","Profile"]

];

}

if(role==="technician"){

menu=[

["dashboard","Dashboard"],

["complaints","Assigned Work"],

["profile","Profile"]

];

}

if(role==="admin"){

menu=[

["dashboard","Dashboard"],

["complaints","Complaints"],

["assets","Assets"],

["users","Users"],

["reports","Reports"],

["profile","Profile"]

];

}

document.getElementById("sidebarMenu").innerHTML=

menu.map(item=>`

<button

class="nav-item nav-link"

data-page="${item[0]}">

${item[1]}

</button>

`).join("");

document.querySelectorAll(".nav-link")

.forEach(btn=>{

btn.onclick=()=>{

Router.navigate(btn.dataset.page);

};

});

}
