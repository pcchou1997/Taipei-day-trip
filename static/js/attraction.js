const name = document.querySelector(".name")
const catMrt = document.querySelector(".catMrt")
const description = document.querySelector(".description")
const addressTitle = document.querySelector(".addressTitle")
const address = document.querySelector(".address")
const transTitle = document.querySelector(".transTitle")
const transportation = document.querySelector(".transportation")
const carouselTrack = document.querySelector(".carousel_track");
const carouselNav = document.querySelector(".carousel_nav");

const BOOKING_MSG = document.querySelector(".order_msg");
const BOOKING_MSG_ICON = document.querySelector(".order_msg_icon");
const BOOKING_MSG_TEXT = document.querySelector(".order_msg_text");
const BOOKING_BUTTON = document.querySelector(".boooking_button");
const BOOKING_DATE = document.querySelector(".date");
const BOOKING_PRICE = document.querySelector(".price");
const MORNING = document.querySelector("#morning");
const AFTERNOON = document.querySelector("#afternoon");

let track;
let slides;
let slideWidth;
let dots;
let attractionId;

// 點按「上半天」顯示「2000元」
orderMoring = function () {
    BOOKING_PRICE.innerHTML = "新台幣 2000 元";
    BOOKING_PRICE.className = 'price 2000';
    AFTERNOON.removeAttribute("checked");
    MORNING.setAttribute("checked", "checked");

}

// 點按「下半天」顯示「2500元」
orderAfternoon = function () {
    BOOKING_PRICE.innerHTML = "新台幣 2500 元";
    BOOKING_PRICE.className = 'price 2500';
    MORNING.removeAttribute("checked");
    AFTERNOON.setAttribute("checked", "checked");
}

fetch("/api" + window.location.pathname).then(response => {
    return response.json();
}).then(function (data) {
    // console.log(data);
    attractionId = data["data"]["id"];
    name.innerHTML = data["data"]["name"];
    catMrt.innerHTML = data["data"]["category"] + " at " + data["data"]["mrt"];
    description.innerHTML = data["data"]["description"];
    addressTitle.innerHTML = "<b>景點地址：</b>";
    address.innerHTML = data["data"]["address"];
    transTitle.innerHTML = "<b>交通方式：</b>";
    transportation.innerHTML = data["data"]["transport"];
    for (let i = 0; i < data["data"]["images"].length; i++) {
        let slide = document.createElement("li");
        if (i == 0) {
            slide.classList.add("carousel_slide", "current-slide");
        }
        else {
            slide.className = "carousel_slide";
        }
        let img = document.createElement("img");
        img.src = `${data["data"]["images"][i]}`;
        img.className = "carousel_image";
        slide.appendChild(img);
        carouselTrack.appendChild(slide);
        let dot = document.createElement("button");
        if (i == 0) {
            dot.classList.add("carousel_indicator", "current-slide");
        }
        else {
            dot.className = "carousel_indicator";
        }
        carouselNav.appendChild(dot)
    }
    track = document.querySelector(".carousel_track");
    slides = Array.from(track.children);
    console.log(slides);
    slideWidth = slides[0].getBoundingClientRect().width;
    dots = Array.from(carouselNav.children);
    slides.forEach(setSlidePosition);
})

// let track = document.querySelector(".carousel_track");
// let slides = Array.from(track.children);

let nextButton = document.querySelector(".carousel_button_right");
let prevButton = document.querySelector(".carousel_button_left");
let dotsNav = document.querySelector(".carousel_nav");
// let dots = Array.from(dotsNav.children);
// let slideWidth = slides[0].getBoundingClientRect().width;

// 把slides排成向右接續

// slides[0].style.left = slideWidth * 0 + 'px';
// slides[1].style.left = slideWidth * 1 + 'px';
// slides[2].style.left = slideWidth * 2 + 'px';

let setSlidePosition = (slide, index) => {
    slide.style.left = slideWidth * index + 'px';
}
// slides.forEach(setSlidePosition);

let moveToSlide = (track, currentSlide, targetSlide) => {
    track.style.transform = "translateX(-" + targetSlide.style.left + ")";
    currentSlide.classList.remove("current-slide");
    targetSlide.classList.add("current-slide");
}

let updateDots = (currentDot, targetDot) => {
    currentDot.classList.remove("current-slide");
    targetDot.classList.add("current-slide");
}

// /* 讓使用者在第一頁不可使用往前一頁、在最後一頁不可使用往後一頁 */
// let hideShowArrows = (slides, prevButton, nextButton, targetIndex) => {
//     if (targetIndex === 0) {
//         prevButton.classList.add("is-hidden");
//         nextButton.classList.remove("is-hidden");
//     }
//     else if (targetIndex === slides.length - 1) {
//         prevButton.classList.remove("is-hidden");
//         nextButton.classList.add("is-hidden");
//     }
//     else {
//         prevButton.classList.remove("is-hidden");
//         nextButton.classList.remove("is-hidden");
//     }
// }

// 左按鈕：上一個slide
prevButton.addEventListener("click", e => {
    let currentSlide = track.querySelector(".current-slide");
    let prevSlide = currentSlide.previousElementSibling;
    let currentDot = dotsNav.querySelector(".current-slide");
    let prevDot = currentDot.previousElementSibling;
    // /* 讓使用者在第一頁不可使用往前一頁、在最後一頁不可使用往後一頁 */
    // let prevIndex = slides.findIndex(slide => slide === prevSlide);

    moveToSlide(track, currentSlide, prevSlide);
    updateDots(currentDot, prevDot);
    // /* 讓使用者在第一頁不可使用往前一頁、在最後一頁不可使用往後一頁 */
    // hideShowArrows(slides, prevButton, nextButton, prevIndex);
})

// 右按鈕：下一個slide
nextButton.addEventListener("click", e => {
    let currentSlide = track.querySelector(".current-slide");
    let nextSlide = currentSlide.nextElementSibling;
    let currentDot = dotsNav.querySelector(".current-slide");
    let nextDot = currentDot.nextElementSibling;
    // /* 讓使用者在第一頁不可使用往前一頁、在最後一頁不可使用往後一頁 */
    // let nextIndex = slides.findIndex(slide => slide === nextSlide);

    moveToSlide(track, currentSlide, nextSlide);
    updateDots(currentDot, nextDot);
    // /* 讓使用者在第一頁不可使用往前一頁、在最後一頁不可使用往後一頁 */
    // hideShowArrows(slides, prevButton, nextButton, nextIndex);
})

// 直接到達slide

dotsNav.addEventListener("click", e => {
    //找到目前按的indicator
    let targetDot = e.target.closest("button");
    if (!targetDot) { return }
    else {
        let currentSlide = track.querySelector(".current-slide");
        let currentDot = dotsNav.querySelector(".current-slide");
        let targetIndex = dots.findIndex(dot => dot === targetDot);
        let targetSlide = slides[targetIndex];
        moveToSlide(track, currentSlide, targetSlide);
        updateDots(currentDot, targetDot);
        hideShowArrows(slides, prevButton, nextButton, targetIndex);
    }
})

// 預定行程按鈕，取得預定表單資訊傳入後端

function booking() {
    BOOKING_MSG.style.display = "none"
    BOOKING_DATE.style.borderColor = "black";

    const BOOKING_TIME = document.querySelector("[name=time]:checked");

    // 日期
    BOOKING_DATE_value = BOOKING_DATE.value;

    // 時間
    BOOKING_TIME_value = BOOKING_TIME.value;

    // 價格
    if (BOOKING_PRICE.getAttribute('class').indexOf('2000') > -1) { // 找到顯示開始index，找不到顯示-1
        BOOKING_PRICE_value = '2000'
    }
    else {
        BOOKING_PRICE_value = '2500'
    }

    // 圖片
    const BOOKING_IMAGE = document.querySelector(".carousel_image");
    BOOKING_IMAGE_src = BOOKING_IMAGE.src

    // 檢查登入狀態
    fetch('/api/user/auth').then(response => {
        return response.json();
    }).then(function (data) {

        // 未登入
        if (data == null) {
            BOOKING_MSG_TEXT.innerHTML = "請先登入系統";
            BOOKING_MSG.style.display = "flex"
            let signin = document.querySelector(".signin");

            setTimeout(() => (signin.style.display = "block"), 1000);
        }

        // 已登入
        else {

            // 檢查日期，js使用0~11表示1~12月

            // 日期為空
            if (BOOKING_DATE_value == "") {
                BOOKING_MSG_TEXT.innerHTML = "請選擇日期"
                BOOKING_MSG.style.display = "flex"
                BOOKING_DATE.style.borderColor = "red";

            }

            // 日期不為空
            else {
                let date_now = new Date();
                let order_date_split = BOOKING_DATE_value.split("-");
                let order_date = new Date(order_date_split[0], order_date_split[1] - 1, order_date_split[2]);

                // 日期為今日(含)以前的日期
                if (order_date <= date_now) {
                    BOOKING_MSG_TEXT.innerHTML = "請選擇今日(" + (date_now.getMonth() + 1) + "/" + date_now.getDate() + ")過後的日期"
                    BOOKING_MSG.style.display = "flex";
                    BOOKING_DATE.style.borderColor = "red";
                }

                // 日期為今日以後的日期
                else {

                    // 寫入資料庫
                    fetch('/api/booking', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                        body: JSON.stringify({
                            "attractionId": attractionId,
                            "date": BOOKING_DATE_value,
                            "time": BOOKING_TIME_value,
                            "price": BOOKING_PRICE_value,
                            "image": BOOKING_IMAGE_src
                        })
                    }).then(response => {
                        return response.json();
                    }).then(function (data) {
                        console.log(data)
                        if (data["ok"] == true) {
                            BOOKING_MSG_ICON.remove();
                            BOOKING_MSG_TEXT.innerHTML = "預約成功！"
                            BOOKING_MSG.style.display = "block"
                            BOOKING_MSG_TEXT.style.color = "#448899";
                            setTimeout(() => (location.href = "/booking"), 1000);
                        }
                        else if (data["error"] == true && data["message"] == "請選擇日期") {
                            BOOKING_MSG_TEXT.innerHTML = "請選擇日期";
                            BOOKING_MSG.style.display = "flex"
                            BOOKING_DATE.style.borderColor = "red";
                        }
                        else if (data["error"] == true && data["message"] == "未登入系統") {
                            BOOKING_MSG_TEXT.innerHTML = "請先登入系統";
                            BOOKING_MSG.style.display = "flex"
                            let signin = document.querySelector(".signin");

                            setTimeout(() => (signin.style.display = "block"), 1000);
                        }
                        else {
                            BOOKING_MSG_TEXT.innerHTML = "伺服器內部錯誤，請再試一次";
                            BOOKING_MSG.style.display = "flex"
                        }
                    })
                }
            }
        }
    })
}
BOOKING_BUTTON.addEventListener("click", booking, false);