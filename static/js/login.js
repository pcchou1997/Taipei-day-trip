const LOGIN = document.querySelector(".login");
const LOGOUT = document.querySelector(".logout");
const SIGNIN = document.querySelector(".signin");
const SIGNUP = document.querySelector(".signup");
const SIGNIN_ERROR_MSG = document.querySelector(".signin_errorMsg");
const SIGNUP_ERROR_MSG = document.querySelector(".signup_errorMsg");
const SIGNIN_EMAIL = document.querySelector(".signin_email");
const SIGNIN_PASSWORD = document.querySelector(".signin_password");
const SIGNUP_NAME = document.querySelector(".signup_name");
const SIGNUP_EMAIL = document.querySelector(".signup_email");
const SIGNUP_PASSWORD = document.querySelector(".signup_password");
const BOOKING = document.querySelector(".booking");
const SIGNIN_EMAIL_MSG_TEXT = document.querySelector(".signin_email_msg_text");
const SIGNUP_EMAIL_MSG_TEXT = document.querySelector(".signup_email_msg_text");
const SIGNIN_EMAIL_MSG = document.querySelector(".signin_email_msg");
const SIGNUP_EMAIL_MSG = document.querySelector(".signup_email_msg");
const REGEX_EMAIL = new RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)

const MEMBER = document.querySelector(".member");

// signin 

let signinClose = function () {
    SIGNIN.style.display = "none";
    SIGNIN_ERROR_MSG.style.display = "none"
    SIGNIN_EMAIL.value = ""
    SIGNIN_PASSWORD.value = "";
}

let signinOpen = function () {
    SIGNUP_NAME.value = "";
    SIGNUP_EMAIL.value = "";
    SIGNUP_PASSWORD.value = "";
    SIGNUP_ERROR_MSG.style.display = "none";
    if (SIGNUP.style.display == "block") {
        SIGNUP.style.display = "none";
    }
    SIGNIN.style.display = "block";
    SIGNUP_EMAIL_MSG.style.display = "none";
}

let signinAccount = function () {
    // 使用者登入資訊
    SIGNIN_EMAIL_VALUE = SIGNIN_EMAIL.value;
    SIGNIN_PASSWORD_VALUE = SIGNIN_PASSWORD.value;

    // 偵測登入欄位留白
    if (SIGNIN_EMAIL_VALUE == "" || SIGNIN_PASSWORD_VALUE == "") {
        SIGNIN_ERROR_MSG.innerHTML = "任一欄位不可空白"
        SIGNIN_ERROR_MSG.style.display = "block"
    }

    // 登入資訊送入後端檢驗
    else {
        fetch("/api/user/auth", {
            method: "PUT",
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({ "email": SIGNIN_EMAIL_VALUE, "password": SIGNIN_PASSWORD_VALUE })
        }).then(response => {
            return response.json();
        }).then(function (data) {
            // console.log("data: ", data)
            if (data["ok"] == true) {
                window.location.reload();
            }
            else if (data["message"] == "email或密碼錯誤") {
                SIGNIN_ERROR_MSG.innerHTML = "email或密碼錯誤";
                SIGNIN_ERROR_MSG.style.display = "block"
            }
            else {
                SIGNIN_ERROR_MSG.innerHTML = "伺服器內部錯誤";
                SIGNIN_ERROR_MSG.style.display = "block"
            }
        })
    }
}

// signup 

let signupClose = function () {
    SIGNUP.style.display = "none";
    SIGNUP_ERROR_MSG.style.display = "none";
    SIGNUP_NAME.value = "";
    SIGNUP_EMAIL.value = "";
    SIGNUP_PASSWORD.value = "";
}

let signupOpen = function () {
    SIGNIN_EMAIL.value = "";
    SIGNIN_PASSWORD.value = "";
    SIGNIN_ERROR_MSG.style.display = "none"
    if (SIGNIN.style.display == "block") {
        SIGNIN.style.display = "none";
    }
    SIGNUP.style.display = "block";
    SIGNIN_EMAIL_MSG.style.display = "none";
}

let signupAccount = function () {
    SIGNUP_ERROR_MSG.style.display = "none";
    // 使用者註冊資訊
    SIGNUP_NAME_VALUE = SIGNUP_NAME.value;
    SIGNUP_EMAIL_VALUE = SIGNUP_EMAIL.value;
    SIGNUP_PASSWORD_VALUE = SIGNUP_PASSWORD.value;
    // console.log("signup_name: ", signup_name_val, "signup_email: ", signup_email_val, "signup_password: ", signup_password_val)

    // 偵測註冊欄位留白
    if (SIGNUP_NAME_VALUE == "" || SIGNUP_EMAIL_VALUE == "" || SIGNUP_PASSWORD_VALUE == "") {
        SIGNUP_ERROR_MSG.innerHTML = "任一欄位不可空白";
        SIGNUP_ERROR_MSG.style.display = "block";
    }

    // 註冊資訊送入後端檢驗
    else {
        fetch("/api/user", {
            method: "POST",
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({ "name": SIGNUP_NAME_VALUE, "email": SIGNUP_EMAIL_VALUE, "password": SIGNUP_PASSWORD_VALUE })
        }).then(response => {
            return response.json();
        }).then(function (data) {
            //console.log("data: ", data)
            if (data["ok"] == true) {
                SIGNUP_ERROR_MSG.innerHTML = "註冊成功！"
                SIGNUP_ERROR_MSG.style.display = "block"
            }
            else if (data["message"] == "已有使用者註冊過") {
                SIGNUP_ERROR_MSG.innerHTML = "email已被註冊";
                SIGNUP_ERROR_MSG.style.display = "block";
            }
            else {
                SIGNUP_ERROR_MSG.innerHTML = "伺服器內部錯誤";
                SIGNUP_ERROR_MSG.style.display = "block";
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
            LOGIN.style.display = "none"
            LOGOUT.style.display = "block"
            MEMBER.style.display = "block"
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

SIGNIN_EMAIL.addEventListener("change", function () {
    SIGNIN_EMAIL.style.borderColor = "#CCCCCC";
    SIGNIN_EMAIL_MSG.style.display = "none";

    let SIGNIN_EMAIL_VALUE = SIGNIN_EMAIL.value;

    if (SIGNIN_EMAIL_VALUE == "") {
        SIGNIN_EMAIL.style.borderColor = "red";
        SIGNIN_EMAIL_MSG_TEXT.innerHTML = "請輸入email欄位";
        SIGNIN_EMAIL_MSG.style.display = "flex"
    }
    else if (REGEX_EMAIL.exec(SIGNIN_EMAIL_VALUE)) {
        SIGNIN_EMAIL_MSG_TEXT.innerHTML = "";
    }
    else {
        SIGNIN_EMAIL.style.borderColor = "red";
        SIGNIN_EMAIL_MSG_TEXT.innerHTML = "請輸入正確的email格式";
        SIGNIN_EMAIL_MSG.style.display = "flex"
    }
});

SIGNUP_EMAIL.addEventListener("change", function () {
    SIGNUP_EMAIL.style.borderColor = "#CCCCCC";
    SIGNUP_EMAIL_MSG.style.display = "none";

    let SIGNUP_EMAIL_VALUE = SIGNUP_EMAIL.value;

    if (SIGNUP_EMAIL_VALUE == "") {
        SIGNUP_EMAIL.style.borderColor = "red";
        SIGNUP_EMAIL_MSG_TEXT.innerHTML = "請輸入email欄位";
        SIGNUP_EMAIL_MSG.style.display = "flex"
    }
    else if (REGEX_EMAIL.exec(SIGNUP_EMAIL_VALUE)) {
        SIGNUP_EMAIL_MSG_TEXT.innerHTML = "";
    }
    else {
        SIGNUP_EMAIL.style.borderColor = "red";
        SIGNUP_EMAIL_MSG_TEXT.innerHTML = "請輸入正確的email格式";
        SIGNUP_EMAIL_MSG.style.display = "flex"
    }
});

MEMBER.addEventListener('click', function () {
    fetch("/api/user/auth", { method: "GET" }).then(response => {
        return response.json();
    }).then(function (userData) {
        if (userData == null) {
            signinOpen();
        }
        else {
            location.href = "/member";
        }
    })
}, false);