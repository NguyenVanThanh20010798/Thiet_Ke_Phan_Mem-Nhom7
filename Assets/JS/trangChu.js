window.onload = function () {
    khoiTao();

    var sanPhamPhanTich
    var sanPhamPhanTrang;

    var filters = getFilterFromURL();
    if (filters.length) { // có filter
        sanPhamPhanTich = phanTich_URL(filters, true);
        sanPhamPhanTrang = tinhToanPhanTrang(sanPhamPhanTich, filtersFromUrl.page || 1);
        addProductsFrom(sanPhamPhanTrang);

        document.getElementsByClassName('contain-products')[0].style.display = '';
        document.getElementsByClassName('home-slide__wrap')[0].style.display = 'none';
        document.getElementsByClassName('category__wrap')[0].style.display = 'none';
        document.getElementsByClassName('main-category__header')[0].style.display = '';
        document.getElementsByClassName('main__content')[0].style.paddingTop = '0';
        document.getElementsByClassName('main__content')[0].style.marginTop = '0';
    } else {

        var soLuong = (window.innerWidth < 1200 ? 4 : 5);

        // Thêm các khung sản phẩm
        var div = document.getElementsByClassName('home-product__general')[0];
        addKhungSanPham('Cây Cảnh', ['promo=caycanh', 'sort=price'], soLuong, div);
        addKhungSanPham('Cây Công Trình', ['promo=caycongtrinh', 'sort=price'], soLuong, div);
        addKhungSanPham('Cây Giống', ['promo=caygiong', 'sort=price'], soLuong, div);
        addKhungSanPham('Cây Ăn Quả', ['promo=cayanqua', 'sort=price'], soLuong, div);
        addKhungSanPham('Hoa Chậu', ['promo=hoachau', 'sort=price'], soLuong, div);
        addKhungSanPham('Hoa Sự Kiện', ['promo=hoasukien', 'sort=price'], soLuong, div);
        addKhungSanPham('Hạt Giống', ['promo=hatgiong', 'sort=price'], soLuong, div);
        addKhungSanPham('Chậu Cảnh', ['promo=chaucanh', 'sort=price'], soLuong, div);
        addKhungSanPham('Tiểu Cảnh/Sân Vườn', ['promo=tieucanh', 'sort=price'], soLuong, div);

        var ul = document.getElementsByClassName("category-list")[0];
        addCategory('Cây Cảnh', ['promo=caycanh'], ul)
        addCategory('Cây Công Trình', ['promo=caycongtrinh'], ul)
        addCategory('Cây Giống', ['promo=caygiong'], ul)
        addCategory('Cây Ăn Quả', ['promo=cayanqua'], ul)
        addCategory('Hoa Chậu', ['promo=hoachau'], ul)
        addCategory('Hoa Sự Kiện', ['promo=hoasukien'], ul)
        addCategory('Hạt Giống', ['promo=hatgiong'], ul)
        addCategory('Chậu Cảnh', ['promo=chaucanh'], ul)
        addCategory('Tiểu Cảnh/Sân Vườn', ['promo=tieucanh'], ul)
    }
    addPricesRange(0, 200000);
    addPricesRange(200000, 400000);
    addPricesRange(500000, 700000);
    addPricesRange(700000, 0);

    addSortFilter('ascending', 'price', 'Giá tăng dần');
	addSortFilter('decrease', 'price', 'Giá giảm dần');
	addSortFilter('ascending', 'name', 'Tên A-Z');
	addSortFilter('decrease', 'name', 'Tên Z-A');
};

var soLuongSanPhamMaxTrongMotTrang = 15;

var filtersFromUrl = {
    company: '',
    search: '',
    price: '',
    promo: '',
    page: '',
    sort: {
        by: '',
        type: 'ascending'
    }
}

function getFilterFromURL() {
    var fullLocation = window.location.href;
    fullLocation = decodeURIComponent(fullLocation);
    var dauHoi = fullLocation.split('?');

    if (dauHoi[1]) {
        var dauVa = dauHoi[1].split('&');
        return dauVa;
    }

    return [];
}


function phanTich_URL(filters, saveFilter) {
    var result = copyObject(list_products);

    for (var i = 0; i < filters.length; i++) {
        var dauBang = filters[i].split('=');

        switch (dauBang[0]) {
            case 'search':
                dauBang[1] = dauBang[1].split('+').join(' ');
                result = searchByName(result, dauBang[1]);
                if (saveFilter) filtersFromUrl.search = dauBang[1];
                break;

            case 'price':
                if (saveFilter) filtersFromUrl.price = dauBang[1];

                var prices = dauBang[1].split('-');
                prices[1] = Number(prices[1]) || 1E10;
                result = searchByPrice(result, prices[0], prices[1]);
                break;

            case 'promo':
                result = searchByTree(result, dauBang[1]);
                if (saveFilter) filtersFromUrl.promo = dauBang[1];
                break;

            case 'category':
                result = searchByCategory(result, dauBang[1]);
                if (saveFilter) filtersFromUrl.company = dauBang[1];
                break;

            case 'page':
                if (saveFilter) filtersFromUrl.page = dauBang[1];
                break;

            case 'sort':
                var s = dauBang[1].split('-');
                var tenThanhPhanCanSort = s[0];

                switch (tenThanhPhanCanSort) {
                    case 'price':
                        if (saveFilter) filtersFromUrl.sort.by = 'price';
                        result.sort(function (a, b) {
                            var giaA = parseInt(a.price.split('.').join(''));
                            var giaB = parseInt(b.price.split('.').join(''));
                            return giaA - giaB;
                        });
                        break;

                    case 'name':
                        if (saveFilter) filtersFromUrl.sort.by = 'name';
                        result.sort(function (a, b) {
                            return a.name.localeCompare(b.name);
                        });
                        break;
                }

                if (s[1] == 'decrease') {
                    if (saveFilter) filtersFromUrl.sort.type = 'decrease';
                    result.reverse();
                }

                break;
        }
    }

    return result;
}

function addProductsFrom(list, vitri, soluong) {
    var start = vitri || 0;
    var end = (soluong ? start + soluong : list.length);
    for (var i = start; i < end; i++) {
        addProduct(list[i]);
    }
}

function clearAllProducts() {
    document.getElementById('products').innerHTML = "";
}

function addKhungSanPham(tenKhung, filter, len, ele) {
    var s = `
            <div class="home-product">
                <div class="grid__row">
                    <div class="home__product-label">
                        <h2 class="home__product-label-category">`+ tenKhung + `</h2>
                        <a target="_blank" href="trangChu.html?` + filter.join('&') + `" class="home__product-view-all">Xem tất cả</a>
                    </div>
            `;
    var spResult = phanTich_URL(filter, false);
    if (spResult.length < len) len = spResult.length;

    for (var i = 0; i < len; i++) {
        s += addProduct(spResult[i], null, true);
    }
    s += `</div>
    </div>`

    ele.innerHTML += s;
}

function addCategory(tenCategory, filter, ele) {
    var s = `
                <li class="category-item">
                    <a target="_blank" href="trangChu.html?` + filter.join('&') + `" class="category-item__link">` + tenCategory + `</a>
                </li>
    `;
    ele.innerHTML += s;
}

function themNutPhanTrang(soTrang, trangHienTai) {
    var divPhanTrang = document.getElementsByClassName('pagination')[0];

    var k = createLinkFilter('remove', 'page');
    if (k.indexOf('?') > 0) k += '&';
    else k += '?';

    if (trangHienTai > 1)
        divPhanTrang.innerHTML = `
        <a href="` + k + `page=` + (trangHienTai - 1) + `"><i class="fa fa-angle-left"></i></a>
        `;

    if (soTrang > 1)
        for (var i = 1; i <= soTrang; i++) {
            if (i == trangHienTai) {
                divPhanTrang.innerHTML += `<a href="javascript:;" class="current">` + i + `</a>`

            } else {
                divPhanTrang.innerHTML += `<a href="` + k + `page=` + (i) + `">` + i + `</a>`
            }
        }

    if (trangHienTai < soTrang) {
        divPhanTrang.innerHTML += `<a href="` + k + `page=` + (trangHienTai + 1) + `"><i class="fa fa-angle-right"></i></a>`
    }
}

function tinhToanPhanTrang(list, vitriTrang) {
    var sanPhamDu = list.length % soLuongSanPhamMaxTrongMotTrang;
    var soTrang = parseInt(list.length / soLuongSanPhamMaxTrongMotTrang) + (sanPhamDu ? 1 : 0);
    var trangHienTai = parseInt(vitriTrang < soTrang ? vitriTrang : soTrang);

    themNutPhanTrang(soTrang, trangHienTai);
    var start = soLuongSanPhamMaxTrongMotTrang * (trangHienTai - 1);

    var temp = copyObject(list);

    return temp.splice(start, soLuongSanPhamMaxTrongMotTrang);
}


function searchByPrice(list, giaMin, giaMax, soluong) {
    var count, result = [];
    if (soluong < list.length) count = soluong;
    else count = list.length;

    for (var i = 0; i < list.length; i++) {
        var gia = parseInt(list[i].price.split('.').join(''));
        if (gia >= giaMin && gia <= giaMax) {
            result.push(list[i]);
            count--;
            if (count <= 0) break;
        }
    }

    return result;
}

function searchByTree(list, tenLoai, soluong) {
    var count, result = [];
    if (soluong < list.length) count = soluong;
    else count = list.length;

    for (var i = 0; i < list.length; i++) {
        if (list[i].promo.name == tenLoai) {
            result.push(list[i]);
            count--;
            if (count <= 0) break;
        }
    }

    return result;
}

function searchByCategory(list, tenTheLoai, soluong) {
    var count, result = [];
    if (soluong < list.length) count = soluong;
    else count = list.length;

    for (var i = 0; i < list.length; i++) {
        if (list[i].category.toUpperCase().indexOf(tenTheLoai.toUpperCase()) >= 0) {
            result.push(list[i]);
            count--;
            if (count <= 0) break;
        }
    }
    return result;
}

function createLinkFilter(type, nameFilter, valueAdd) {
    var o = copyObject(filtersFromUrl);
    o.page = ''; // reset phân trang

    if (nameFilter == 'sort') {
        if (type == 'add') {
            o.sort.by = valueAdd.by;
            o.sort.type = valueAdd.type;

        } else if (type == 'remove') {
            o.sort.by = '';
        }

    } else {
        if (type == 'add') o[nameFilter] = valueAdd;
        else if (type == 'remove') o[nameFilter] = '';
    }

    var link = 'trangChu.html';
    var h = false;

    for (var i in o) {
        if (i != 'sort' && o[i]) {
            link += (h ? '&' : '?') + i + '=' + o[i];
            h = true;
        }
    }

    if (o.sort.by != '')
        link += (h ? '&' : '?') + 'sort=' + o.sort.by + '-' + o.sort.type;

    return link;
}

function alertNotHaveProduct(coSanPham) {
    var thongbao = document.getElementById('khongCoSanPham');
    if (!coSanPham) {
        thongbao.style.width = "auto";
        thongbao.style.opacity = "1";
        thongbao.style.margin = "auto";
        thongbao.style.transitionDuration = "1s";

    } else {
        thongbao.style.width = "0";
        thongbao.style.opacity = "0";
        thongbao.style.margin = "0";
        thongbao.style.transitionDuration = "0s";
    }
}

function addPricesRange(min, max) {
	var text = priceToString(min, max);
	var link = createLinkFilter('add', 'price', min + '-' + max);

	var mucgia = `<a href="` + link + `" class="select-input__link">` + text + `</a>`;
	document.getElementsByClassName('select-input__list')[0]
		.getElementsByClassName('select-input__item')[0].innerHTML += mucgia;
}

function priceToString(min, max) {
	if (min == 0) return 'Dưới ' + max / 1E3 + ' nghìn';
	if (max == 0) return 'Trên ' + min / 1E3 + ' nghìn';
	return 'Từ ' + min / 1E3 + ' - ' + max / 1E3 + ' nghìn';
}

function addSortFilter(type, nameFilter, text) {
	var link = createLinkFilter('add', 'sort', {
		by: nameFilter,
		type: type
	});
	var sortTag = `<a href="` + link + `" class="select-input__link">` + text + `</a>`;

	document.getElementsByClassName('select-input__list-price')[0]
		.getElementsByClassName('select-input__item')[0].innerHTML += sortTag;
}