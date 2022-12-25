// 取得網址的流水號
let getUrl = location.href;
let url = new URL(getUrl);
let serialNumber = url.searchParams.get('number');

const SERIAL_NUMBER = document.querySelector(".serialNumber")
const GO_INDEX = document.querySelector(".goIndex")

SERIAL_NUMBER.innerHTML = serialNumber

fetch("/api/order/" + serialNumber, { method: "GET" }).then(response => {
    return response.json();
}).then(function (data) {
    console.log(data)
})

GO_INDEX.addEventListener('click', function () {
    location.href = "/"
});
