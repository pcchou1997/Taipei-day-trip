let login = document.querySelector(".login");
let logout = document.querySelector(".logout");
let signin = document.querySelector(".signin");
let signup = document.querySelector(".signup");
let signin_errorMsg = document.querySelector(".signin_errorMsg");
let signup_errorMsg = document.querySelector(".signup_errorMsg");
let signin_email = document.querySelector(".signin_email");
let signin_password = document.querySelector(".signin_password");
let signup_name = document.querySelector(".signup_name");
let signup_email = document.querySelector(".signup_email");
let signup_password = document.querySelector(".signup_password");
let BOOKING = document.querySelector(".booking");

// signin 

let signinClose = function () {
    signin.style.display = "none";
    signin_errorMsg.style.display = "none"
    signin_email.value = ""
    signin_password.value = "";
}

let signinOpen = function () {
    signup_name.value = "";
    signup_email.value = "";
    signup_password.value = "";
    signup_errorMsg.style.display = "none";
    if (signup.style.display == "block") {
        signup.style.display = "none";
    }
    signin.style.display = "block";
}

let signinAccount = function () {
    // 使用者登入資訊
    signin_email_val = signin_email.value;
    signin_password_val = signin_password.value;

    // 偵測登入欄位留白
    if (signin_email_val == "" || signin_password_val == "") {
        signin_errorMsg.innerHTML = "任一欄位不可空白"
        signin_errorMsg.style.display = "block"
    }

    // 登入資訊送入後端檢驗
    else {
        fetch("/api/user/auth", {
            method: "PUT",
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({ "email": signin_email_val, "password": signin_password_val })
        }).then(response => {
            return response.json();
        }).then(function (data) {
            // console.log("data: ", data)
            if (data["ok"] == true) {
                window.location.reload();
            }
            else if (data["message"] == "email或密碼錯誤") {
                signin_errorMsg.innerHTML = "email或密碼錯誤";
                signin_errorMsg.style.display = "block"
            }
            else {
                signin_errorMsg.innerHTML = "伺服器內部錯誤";
                signin_errorMsg.style.display = "block"
            }
        })
    }
}

// signup 

let signupClose = function () {
    signup.style.display = "none";
    signup_errorMsg.style.display = "none";
    signup_name.value = "";
    signup_email.value = "";
    signup_password.value = "";
}

let signupOpen = function () {
    signin_email.value = "";
    signin_password.value = "";
    signin_errorMsg.style.display = "none"
    if (signin.style.display == "block") {
        signin.style.display = "none";
    }
    signup.style.display = "block";
}

let signupAccount = function () {
    signup_errorMsg.style.display = "none";
    // 使用者註冊資訊
    signup_name_val = signup_name.value;
    signup_email_val = signup_email.value;
    signup_password_val = signup_password.value;
    // console.log("signup_name: ", signup_name_val, "signup_email: ", signup_email_val, "signup_password: ", signup_password_val)

    // 偵測註冊欄位留白
    if (signup_name_val == "" || signup_email_val == "" || signup_password_val == "") {
        signup_errorMsg.innerHTML = "任一欄位不可空白";
        signup_errorMsg.style.display = "block";
    }

    // 註冊資訊送入後端檢驗
    else {
        fetch("/api/user", {
            method: "POST",
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({ "name": signup_name_val, "email": signup_email_val, "password": signup_password_val })
        }).then(response => {
            return response.json();
        }).then(function (data) {
            //console.log("data: ", data)
            if (data["ok"] == true) {
                signup_errorMsg.innerHTML = "註冊成功！"
                signup_errorMsg.style.display = "block"
            }
            else if (data["message"] == "已有使用者註冊過") {
                signup_errorMsg.innerHTML = "email已被註冊";
                signup_errorMsg.style.display = "block";
            }
            else {
                signup_errorMsg.innerHTML = "伺服器內部錯誤";
                signup_errorMsg.style.display = "block";
            }
        })
    }
}

// check login status
// method: "GET"

let checkLogin = function () {
    fetch("/api/user/auth").then(response => {
        return response.json();
    }).then(function (data) {
        // console.log("data: ", data)
        if (data != null) {
            login.style.display = "none"
            logout.style.display = "block"
        }
    })
}

checkLogin();

// logout 

let signout = function () {
    fetch("/api/user/auth", {
        method: "DELETE"
    }).then(response => {
        return response.json();
    }).then(function (data) {
        // console.log("data: ", data)
        if (data["ok"] == true) {
            window.location.reload();
        }
    })
}

// booking

BOOKING.addEventListener('click', function () {
    fetch("/api/user/auth", { method: "GET" }).then(response => {
        return response.json();
    }).then(function (userData) {
        if (userData == null) {
            signinOpen();
        }
        else {
            location.href = "/booking";
        }

    })
}, false);