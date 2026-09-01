function saveLogin(data){

    localStorage.setItem("token",data.token);

    localStorage.setItem(

        "user",

        JSON.stringify(data.user)

    );

}

function logout(){

    localStorage.clear();

    location.href="login.html";

}

function isLoggedIn(){

    return localStorage.getItem("token")!==null;

}

function currentUser(){

    const user = localStorage.getItem("user");

    return user ? JSON.parse(

        user

    ) : null;

}
