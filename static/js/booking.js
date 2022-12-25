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

const CONTACT_NAME = document.querySelector(".contact_name");
const CONTACT_EMAIL = document.querySelector(".contact_email");
const CONTACT_PHONE = document.querySelector(".contact_phone");

let oderPrice;
let oderDate;
let oderTime;

let attractionId;
let attractionName;
let attractionAddress;
let attractionImage;

let prime;

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
        attractionId = data["data"]["attraction"]["id"];
        attractionName = data["data"]["attraction"]["name"];
        attractionAddress = data["data"]["attraction"]["address"];
        attractionImage = data["data"]["attraction"]["image"][0];
        oderPrice = data["price"];
        oderDate = data["date"];
        oderTime = data["time"];
        JOURNEY_ATTRACTION.innerHTML = "台北一日遊：" + attractionName;
        JOURNEY_DATE.innerHTML = "<b>日期： </b>" + oderDate;
        JOURNEY_TIME.innerHTML = "<b>時間： </b>" + oderTime;
        JOURNEY_PRICE.innerHTML = "<b>費用： </b>" + "新台幣" + oderPrice + "元";
        JOURNEY_ADDRESS.innerHTML = "<b>地點： </b>" + attractionAddress;
        JOURNEY_IMG.src = attractionImage;
        CONFIRM_TOTAL_COST.innerHTML = "總價：新台幣" + oderPrice + "元";
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


// 初始化金鑰
TPDirect.setupSDK(126978, 'app_vz7D4ifWryGUutM9U0SdQHGnhgIpH8HgrUAb0wnazIENvLuZ1hDfHAVPtusx', 'sandbox')

let fields = {
    // Display ccv field
    number: {
        // css selector
        element: '#card-number',
        placeholder: '**** **** **** ****'
    },
    expirationDate: {
        // DOM object
        element: document.getElementById('card-expiration-date'),
        placeholder: 'MM / YY'
    },
    ccv: {
        element: '#card-ccv',
        placeholder: 'ccv'
    }
}

// 植入輸入卡號表單
TPDirect.card.setup({
    fields: fields,
    styles: {
        // Style all elements
        'input': {
            'color': 'gray'
        },
        // Styling ccv field
        'input.ccv': {
            // 'font-size': '16px'
        },
        // Styling expiration-date field
        'input.expiration-date': {
            // 'font-size': '16px'
        },
        // Styling card-number field
        'input.card-number': {
            // 'font-size': '16px'
        },
        // style focus state
        ':focus': {
            // 'color': 'black'
        },
        // style valid state
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    },
    // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
    isMaskCreditCardNumber: true,
    maskCreditCardNumberRange: {
        beginIndex: 6,
        endIndex: 11
    }
})

TPDirect.card.onUpdate(function (update) {
    // update.canGetPrime === true
    // --> you can call TPDirect.card.getPrime()
    if (update.canGetPrime) {
        // Enable submit Button to get prime.
        JOURNEY_ORDER.removeAttribute('disabled')
    } else {
        // Disable submit Button to get prime.
        JOURNEY_ORDER.setAttribute('disabled', true)
    }

    // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unionpay','unknown']
    if (update.cardType === 'visa') {
        // Handle card type visa.
    }

    // number 欄位是錯誤的
    if (update.status.number === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.number === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }

    if (update.status.expiry === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.expiry === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }

    if (update.status.ccv === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.ccv === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }
})

// 觸發 getPrime 方法
JOURNEY_ORDER.addEventListener('click', function (event) {
    TPDirect.card.getPrime(function (result) {
        // 取得 TapPay Fields 的 status
        const tappayStatus = TPDirect.card.getTappayFieldsStatus()

        // 確認是否可以 getPrime
        if (tappayStatus.canGetPrime === false) {
            alert('can not get prime');
            return;
        }

        // Get prime: tappay 會將客戶敏感的卡片轉為一個不具敏感資訊, 得到的值稱為prime token, 需再將此值給後端
        TPDirect.card.getPrime((result) => {
            if (result.status !== 0) {
                alert('get prime error ' + result.msg);
                return;
            }
            alert('get prime 成功，prime: ' + result.card.prime);

            // 連線至後端，帶上所有訂購資訊
            prime = result.card.prime;
            fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                body: JSON.stringify({
                    "prime": prime,
                    "order": {
                        "price": oderPrice,
                        "trip": {
                            "attraction": {
                                "id": attractionId,
                                "name": attractionName,
                                "address": attractionAddress,
                                "image": attractionImage
                            },
                            "date": oderDate,
                            "time": oderTime
                        },
                        "contact": {
                            "name": CONTACT_NAME.value,
                            "email": CONTACT_EMAIL.value,
                            "phone": CONTACT_PHONE.value
                        }
                    }
                })
            }).then(response => {
                return response.json();
            }).then(function (data) {
                console.log(data)
                console.log(data["data"]["payment"]["status"])
                if (data["data"]["payment"]["status"] == 0) {
                    location.href = "/thankyou?number=" + data["data"]["number"]
                }
                else if (data.message == "登入身份、訂購者名稱不符，訂單建立失敗") {
                    alert("訂購者請填寫自己名字");
                }
                else if (data.message == "任一資訊欄未填寫，訂單建立失敗") {
                    alert("任一資訊欄不可留白");
                }
                else {
                    alert("很抱歉，伺服器內部錯誤，請再試一次");
                    console.log("很抱歉，伺服器內部錯誤，請再試一次");
                }
            })
            // send prime to your server, to pay with Pay by Prime API .
            // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
        })
    })
}
)
