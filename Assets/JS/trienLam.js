var currentuser;
window.onload = function () {
    khoiTao();

    list_exhibition = getListExhibitions() || list_exhibition;

    currentuser = getCurrentUser();
    addItem();
    ShowItem();
}

function setListExhibitions(newList) {
    window.localStorage.setItem('ListExhibition', JSON.stringify(newList));
}

function getListExhibitions() {
    return JSON.parse(window.localStorage.getItem('ListExhibition'));
}

function addItem() {
    var div = document.getElementsByClassName("home-exhibition__list")[0];
    var s = `
    <div class="home-exhibition__label">
                                <h1 class="home-exhibition__title">
                                    TRIỂN LÃM
                                </h1>
                            </div>
    `

    for(var i = 0; i <list_exhibition.length; i++) {
        var p = list_exhibition[i];
        s += `
        <div class="grid__column-2-6 home-exhibition__item">
        <img src="`+p.img+`" alt="`+p.alt+`"
            class="home-exhibition__item-img"
            title="`+p.title+`">
        <div class="home-exhibition__item-modal">
            <span class="close">&times;</span>

            <img class="home-exhibition__item-content">

            <div class="home-exhibition__item-caption"></div>
            <div class="home-exhibition__item-des"></div>
        </div>
        </div>
        `
    }
    div.innerHTML = s;
}


function ShowItem() {
    for(var i = 0; i <list_exhibition.length; i++) {    
        var modal = document.querySelectorAll(".home-exhibition__item-modal")[i];
    
        var img = document.querySelectorAll(".home-exhibition__item-img")[i];
        var modalImg = document.querySelectorAll(".home-exhibition__item-content")[i];
        var captionText = document.querySelectorAll(".home-exhibition__item-caption")[i];
        var des = document.querySelectorAll(".home-exhibition__item-des")[i];
        img.onclick = function () {
            modal.style.display = "block";
            modalImg.src = this.src;
            captionText.innerHTML = this.alt;
            des.innerHTML = this.title;
        }
    
        var span = document.querySelectorAll(".close")[i];
    
        span.onclick = function () {
            modal.style.display = "none";
        }
    }
}