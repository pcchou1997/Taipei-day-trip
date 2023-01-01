const MEMBER_INFO_NAME = document.querySelector(".member_info_name");
const MEMBER_INFO_EMAIL = document.querySelector(".member_info_email");
const HISTORY_ORDERS = document.querySelector(".history_orders");

// 連線取得「使用者資料」 /api/user/auth (GET)

fetch("/api/user/auth", { method: "GET" }).then(response => {
    return response.json();
}).then(function (userData) {
    if (userData == null) {
        location.href = "/"
    }
    else {
        MEMBER_INFO_NAME.innerHTML = "姓名：" + userData["data"]["name"]
        MEMBER_INFO_EMAIL.innerHTML = "e-mail：" + userData["data"]["email"]
    }
})

// 連線取得「歷史訂單資料」 /api/history (GET)

fetch("/api/history", { method: "GET" }).then(response => {
    return response.json();
}).then(function (data) {
    if (data["orders"] == null) {
        HISTORY_ORDERS.innerHTML = "目前無訂單資料";
    }
    else {
        for (let i = data["orders"].length - 1; i > 0; i--) {
            let attractionId = data["orders"][i]["data"]["trip"]["attraction"]["id"];
            let attractionName = data["orders"][i]["data"]["trip"]["attraction"]["name"];
            let attractionAddress = data["orders"][i]["data"]["trip"]["attraction"]["address"];
            let attractionImage = data["orders"][i]["data"]["trip"]["attraction"]["image"];
            let orderPrice = data["orders"][i]["data"]["price"];
            let orderDate = data["orders"][i]["data"]["trip"]["date"];
            let orderTime = data["orders"][i]["data"]["trip"]["time"];
            let contactName = data["orders"][i]["data"]["contact"]["name"];
            let contactEmail = data["orders"][i]["data"]["contact"]["email"];
            let contactPhone = data["orders"][i]["data"]["contact"]["phone"];
            let serialNumber = data["orders"][i]["data"]["number"];
            let isPaid = data["orders"][i]["data"]["isPaid"];

            if (isPaid == 1) {
                isPaid = "已付款";
            }
            else {
                isPaid = "未付款";
            }

            let Element = document.createElement('div');
            Element.classList.add('history_order');
            let addContent =
                `
                <div class="orderNumber">
                    <h3>訂單編號：${serialNumber}</h3>
                </div>
                <div class="attraction_container">
                    <div class="attraction_image">
                        <img src="${attractionImage}" alt="attraction_image">
                    </div>
                    <div class="attraction_info">
                        <h3>預約景點資訊</h3>
                        <div>景點：${attractionName}</div>
                        <div>地點：${attractionAddress}</div>
                        <div>日期：${orderDate}</div>
                        <div>時間：${orderTime}</div>
                        <div>費用：${orderPrice} 元</div>
                        <div>訂單狀態：${isPaid}</div>
                    </div>
                    <div class="contact_info">
                        <h3>預約聯絡資訊</h3>
                        <div>聯絡姓名：${contactName}</div>
                        <div>聯絡信箱：${contactEmail}</div>
                        <div>手機號碼：${contactPhone}</div>
                    </div>
                </div>
                
            `
            Element.innerHTML = addContent;
            HISTORY_ORDERS.appendChild(Element);
        }
        let coll = document.getElementsByClassName('history_order');
        for (let i = 0; i < coll.length; i++) {
            coll[i].addEventListener("click", function () {
                let content = this.childNodes[3];
                if (content.style.display === "flex") {
                    content.style.display = "none";
                } else {
                    content.style.display = "flex";
                }
            });
        }
    }
})