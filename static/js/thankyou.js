const SERIAL_NUMBER = document.querySelector(".serialNumber")
const GO_INDEX = document.querySelector(".goIndex")

// 連線取得「使用者資料」 /api/user/auth (GET)

fetch("/api/user/auth", { method: "GET" }).then(response => {
    return response.json();
}).then(function (userData) {
    console.log("userData:", userData)
    if (userData == null) {
        location.href = "/"
    }
    else {
        let userName = userData["data"]["name"];
        let orderName;

        // 取得網址的流水號
        let getUrl = location.href;
        let url = new URL(getUrl);
        let serialNumber = url.searchParams.get('number');


        // 利用流水號查詢訂單內容
        fetch("/api/order/" + serialNumber, { method: "GET" }).then(response => {
            return response.json();
        }).then(function (data) {
            console.log(data)
            orderName = data["data"]["contact"]["name"];

            // 檢查登入名稱是否與訂購名稱相同
            if (userName == orderName) {
                // 網頁載入時，顯示流水號
                SERIAL_NUMBER.innerHTML = serialNumber
            }
            else {
                location.href = "/"
            }
        })
    }
})

// 「返回首頁」按鈕
GO_INDEX.addEventListener('click', function () {
    location.href = "/"
});
