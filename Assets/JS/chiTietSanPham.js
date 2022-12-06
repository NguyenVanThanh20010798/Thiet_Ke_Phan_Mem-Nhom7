var nameProduct, maProduct, productCurrent;

window.onload = function () {
    khoiTao();

    phanTich_URL_chiTietSanPham();
    slideImage();
    productCurrent && suggestion();
}

function phanTich_URL_chiTietSanPham() {
    nameProduct = decodeURI(window.location.href.split('?')[1]);

    nameProduct = decodeURI(nameProduct.split('-').join(' '));

    for (var p of list_products) {
        if (nameProduct == p.name) {
            maProduct = p.masp;
            break;
        }
    }

    productCurrent = searchByKey(list_products, maProduct);

    var divChiTiet = document.getElementsByClassName('product-detail')[0];

    document.title = decodeURI(nameProduct);

    var nameProductH1 = divChiTiet.getElementsByClassName('product-name__detail')[0];
    nameProductH1.innerHTML += nameProduct;

    var breadCrumProduct = document.getElementsByClassName("bread-crumb")[0];
    var detailbreadCrum =  addBreadCrum(productCurrent.category, nameProduct);
    breadCrumProduct.innerHTML = detailbreadCrum;

    var price = divChiTiet.getElementsByClassName('product-price__detail')[0];
    price.innerHTML = `<span class="product-price-current">` + productCurrent.price + `₫</span>`;

    var hinh = divChiTiet.getElementsByClassName('product-img__big')[0];
    hinh = hinh.getElementsByTagName('img')[0];
    hinh.src = productCurrent.img;

    addSmallImg(productCurrent.img, productCurrent.img2, productCurrent.img3, productCurrent.img4);

    var des = document.getElementsByClassName("prouduct-des__detail")[0];
    var s = addDescription(nameProduct,productCurrent.detail.description);
    des.innerHTML = s;

    var detailProduct = document.getElementsByClassName("product-description__content")[0];
    var content =  addDetailProduct(nameProduct, productCurrent.detail.detailProduct.gioithieu, productCurrent.detail.detailProduct.dacdiem,
        productCurrent.detail.detailProduct.congdung, productCurrent.detail.detailProduct.cachtrong);
    detailProduct.innerHTML = content;
}

function addBreadCrum(category, nameProduct) {
    return `
    <a href="trangChu.html" class="bread-crum__link">Trang Chủ</a>
    <i class="bread-crumb__icon fa-solid fa-angle-right"></i>
    <a href="" class="bread-crum__link bread-crumb__category">`+category+`</a>
    <i class="bread-crumb__icon fa-solid fa-angle-right"></i>
    <span class="bread-crum__name-product">`+nameProduct+`</span>
    `
}

function addSmallImg(img, img2, img3, img4) {
    var newDiv = `
                    <img src="` +img+`" alt=""
                        class="product-img__thumbnail-img">
                    <img src="`+img2+`" alt=""
                        class="product-img__thumbnail-img">
                    <img src="`+img3+`" alt=""
                        class="product-img__thumbnail-img">
                    <img src="`+img4+`" alt=""
                        class="product-img__thumbnail-img">`;
    var banner = document.getElementsByClassName('product-img__thumbnail')[0];
    banner.innerHTML += newDiv;
}

function slideImage() {
        var bigImg = document.getElementById("product-img__big");
        var thumbnailImg = document.getElementById("product-img__thumbnail").getElementsByTagName("img")

        for (var i = 0; i < thumbnailImg.length; i++) {
            thumbnailImg[i].addEventListener("click", full_image);
        }
        function full_image() {
            var imgSrc = this.getAttribute('src');
            bigImg.innerHTML = "<img src=" + imgSrc + " class=product-img__big-img>";
        }
}

function addDescription(nameProduct,description) {
    return `
    <span><b>`+nameProduct+` </b>` + description + `</span>`;
}

function addDetailProduct(nameProduct, gioithieu, dacdiem, congdung,cachtrong) {
    return `
    <p class="product-description__introduce">
        Giới thiệu `+nameProduct+`
    </p>
    <ul class="product-description__introduce-list">
        <li class="product-description__introduce-detail">`+gioithieu+`</li>
    </ul>
    <p class="product-description__characteristics">
        Đặc điểm
    </p>
    <ul class="product-description__characteristics-list">
        <li class="product-description__characteristics-detail">`+dacdiem+`</li>
    </ul>
    <p class="product-description__meaningful">
        Ý nghĩa/Công dụng
    </p>
    <ul class="product-description__meaningful-list">
        <li class="product-description__meaningful-detail">`+congdung+`</li>
    </ul>
    <p class="product-description__plant">Cách trồng/chăm sóc</p>
    <ul class="product-description__plant-list">
        <li class="product-description__plant-detail">`+cachtrong+`</li>
    </ul>
    `
}

function addKhungSanPham(list_products, ele) {
    var khungSanPham = `<div class="product-related__label">Các sản phẩm liên quan</div>
    <div class="grid__row product-related__wrap">`

    for (var i = 0; i < list_products.length; i++) {
		khungSanPham += addProduct(list_products[i], null, true);
	}

	ele.innerHTML += khungSanPham;
}

function suggestion(){
    const giaSanPhamHienTai = stringToNum(productCurrent.price);

    const sanPhamTuongTu = list_products
    .filter((_) => _.masp !== productCurrent.masp)
    .map(sanPham => {
        const giaSanPham = stringToNum(sanPham.price);
        let giaTienGanGiong = Math.abs(giaSanPham - giaSanPhamHienTai) < 1000000;

        let cungTheLoai = sanPham.category ===  productCurrent.category

        let cungLoai = sanPham.promo?.name === productCurrent.promo?.name;

        let diem = 0;
        if(giaTienGanGiong) diem += 20;
        if(cungTheLoai) diem += 15;
        if(cungLoai) diem += 10;

        return {
            ...sanPham,
            diem: diem
        };
    })
    .sort((a,b) => b.diem - a.diem)
    .slice(0, 10);

    if(sanPhamTuongTu.length) {
        let div = document.getElementsByClassName("product-related")[0];
        addKhungSanPham(sanPhamTuongTu, div);
    }
}