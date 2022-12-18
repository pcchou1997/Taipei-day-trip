let userName;
const BOOKING_HEADLINE = document.querySelector(".booking_headline");
const JOURNEY_ATTRACTION = document.querySelector(".journey_attraction");
const JOURNEY_DATE = document.querySelector(".journey_date");
const JOURNEY_TIME = document.querySelector(".journey_time");
const JOURNEY_PRICE = document.querySelector(".journey_price");
const JOURNEY_ADDRESS = document.querySelector(".journey_address");
const JOURNEY_IMG = document.querySelector(".journey_img");
const CONFIRM_TOTAL_COST = document.querySelector(".confirm_totalCost");

const JOURNEY_DELETE = document.querySelector(".journey_delete");
const JOURNEY_ORDER = document.querySelector(".journey_order");
const JOURNEY = document.querySelector(".journey");
const CONTACT = document.querySelector(".contact");
const PAYMENT = document.querySelector(".payment");
const CONFIRM = document.querySelector(".confirm");


// 連線取得「使用者資料」 /api/user/auth (GET)

fetch("/api/user/auth", { method: "GET" }).then(response => {
    return response.json();
}).then(function (userData) {
    console.log(userData)
    if (userData == null) {
        location.href = "/"
    }
    else {
        userName = userData["data"]["name"]
        console.log("userName: ", userName)
        BOOKING_HEADLINE.innerHTML = "您好，" + userName + "，待預定的行程如下："
    }
})

// 連線取得「預定行程資料」 /api/booking (GET)

fetch("/api/booking", { method: "GET" }).then(response => {
    return response.json();
}).then(function (data) {
    console.log("data: ", data)
    if (data["data"] == null) {
        BOOKING_HEADLINE.innerHTML = "您好，" + userName + "，目前無預定的行程。"
        JOURNEY.style.display = "none";
        CONTACT.style.display = "none";
        PAYMENT.style.display = "none";
        CONFIRM.style.display = "none";
        JOURNEY_DELETE.style.display = "none";
    }
    else {
        JOURNEY_ATTRACTION.innerHTML = "台北一日遊：" + data["data"]["attraction"]["name"]
        JOURNEY_DATE.innerHTML = "<b>日期： </b>" + data["date"];
        JOURNEY_TIME.innerHTML = "<b>時間： </b>" + data["time"];
        JOURNEY_PRICE.innerHTML = "<b>費用： </b>" + "新台幣" + data["price"] + "元";
        JOURNEY_ADDRESS.innerHTML = "<b>地點： </b>" + data["data"]["attraction"]["address"];
        JOURNEY_IMG.src = data["data"]["attraction"]["image"][0];
        CONFIRM_TOTAL_COST.innerHTML = "總價：新台幣" + data["price"] + "元";
    }
})

// 連線「刪除行程」 /api/booking (DELETE)

JOURNEY_DELETE.addEventListener('click', function () {
    fetch("/api/booking", {
        method: "DELETE",
        headers: { "Content-type": "application/json;" },
    }).then(response => {
        return response.json();
    }).then(function (data) {
        if (data["ok"] == true) {
            alert("已刪除「預定行程」");
            setTimeout(() => (location.href = "/booking"), 1000);
        }
        else if (data["error"] == true && data["message"] == "未登入系統") {
            alert("請先登入系統")
            let signup = document.querySelector(".signup");
            console.log(signup);
            signup.style.display = "block";
        }
        else {
            alert("Sorry，網頁存在內部錯誤，請再試一次")
        }
    });
}, false);

// 確認訂購且付款
// JOURNEY_ORDER.addEventListener('click', payJourney, false);
// let orderJourney = function () {

// }