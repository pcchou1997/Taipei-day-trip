let booking_headline = document.querySelector(".booking_headline");
let journey_delete = document.querySelector(".journey_delete");
let journey_pay = document.querySelector(".journey_pay");
let journey = document.querySelector(".journey");
let parentJourney = journey.parentNode;

// 連線取得資料
// fetch("/api/booking", {
//     method: "PUT",
//     headers: { 'Content-type': 'application/json; charset=UTF-8' },
//     body: JSON.stringify({ "email": signin_email_val, "password": signin_password_val })
// }).then(response => {
//     return response.json();
// }).then(function (data) {
//     // console.log("data: ", data)
//     if (data["ok"] == true) {
//         window.location.reload();
//     }
//     else if (data["message"] == "email或密碼錯誤") {
//         signin_errorMsg.innerHTML = "email或密碼錯誤";
//         signin_errorMsg.style.display = "block"
//     }
//     else {
//         signin_errorMsg.innerHTML = "伺服器內部錯誤";
//         signin_errorMsg.style.display = "block"
//     }
// })

// 刪除行程
journey_delete.addEventListener('click', delJourney, false);
let delJourney = function () {
    parentJourney.removeChild(journey);
}

// 確認訂購且付款
// journey_pay.addEventListener('click', payJourney, false);
// let payJourney = function () {

// }