let keyword = "";
let api_page = "/api/attractions?page=";
let loading = "ok";
let nextPage = 0;
let nowPage = -1;

let getMoreData = async function () {
    nowPage++;
    let response;
    let data;
    if (keyword != "") {
        response = await fetch(api_page + nextPage + "&keyword=" + keyword);
    }
    else {
        response = await fetch(api_page + nextPage);
    }
    data = await response.json();
    nextPage = data["nextPage"];
    if (nextPage == null) {
        loading = "no";
    }

    addDiv(data);

    function addDiv(data) {
        let head = 0;
        let tail;
        if (data["data"] != "") {
            let rows = Math.ceil(data["data"].length / 4);
            for (let i = 0; i < rows; i++) {
                let Element = document.createElement('div');
                Element.classList.add('grid_small');
                if (i + 1 == rows && data["data"].length % 4 != 0) {
                    tail = data["data"].length % 4;
                }
                else {
                    tail = 4;
                }

                let content = "";
                for (j = head; j < head + tail; j++) {
                    addContent = `
                    <a href="/attraction/${data["data"][j]["id"]}">
                    <div class="site site_${data["data"][j]["id"]}">
                        <div class="site_img" style="background-image: url(${data["data"][j]["images"][0]});">
                            <div class="site_name"><p>${data["data"][j]["name"]}</p></div>
                        </div>
                        <div class="site_info">
                            <div class="site_MRT"><p>${data["data"][j]["mrt"]}</p></div>
                            <div class="site_category"><p>${data["data"][j]["category"]}</p></div>
                        </div>
                    </div>
                </a>`
                    content = content + addContent
                }
                Element.innerHTML = content;

                container.appendChild(Element);
                head = head + 4;
            }
        }
    }
}

container = document.querySelector(".content");
getMoreData();

// infinite scroll

window.addEventListener('scroll', () => {
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
        //判斷何時載入與否？
        if (loading == "ok" && nowPage + 1 == nextPage) {
            console.log("I am at bottom")
            getMoreData();
        }
    }
})

// categories

let siteCategories = document.querySelector(".categories");
fetch("/api/categories").then(function (response) {
    return response.json();
}).then(function (data) {
    let content = "";
    for (let i = 0; i < data["data"].length; i++) {
        addContent = `<div class="category category${i + 1}" onclick="showCategory('category${i + 1}')">${data["data"][i]}</div>`
        content = content + addContent
    }
    siteCategories.innerHTML = content;
})

// 點選分類，自動顯示在輸入框上

let showCategory = function (categoryNo) {
    // 將分類顯示於輸入框
    document.querySelector('.search').value = document.querySelector('.' + categoryNo).innerHTML;
    // 關閉分類表
    document.querySelector('.categories').style.display = 'none'
}

// 點選輸入框，開/關分類表；點選輸入框以外，關閉分類表

let input = document.getElementsByClassName('search')
input = input[0];
let html = document.body.parentNode;

html.addEventListener('click', function (event) {
    //event.preventDefault();
    if (input.contains(event.target)) {
        document.querySelector('.categories').style.display = (document.querySelector('.categories').style.display == 'none') ? 'grid' : 'none';
    }
    else {
        document.querySelector('.categories').style.display = "none";
    }
})

//search

search = function () {
    nowPage = -1;
    loading = "ok";
    nextPage = 0;
    let container = document.querySelector(".content");
    // 抓出keyword
    keyword = document.querySelector(".search").value;
    container.innerHTML = "";
    getMoreData();
}