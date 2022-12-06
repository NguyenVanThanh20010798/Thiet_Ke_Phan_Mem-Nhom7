var adminInfo = [{
    "username": "admin",
    "pass": "admin"
}];

function getListAdmin() {
    return JSON.parse(window.localStorage.getItem('ListAdmin'));
}

function setListAdmin(l) {
    window.localStorage.setItem('ListAdmin', JSON.stringify(l));
}

function khoiTao() {
    // get data từ localstorage
    list_products = getListProducts() || list_products;
    adminInfo = getListAdmin() || adminInfo;

    setupEventAccount();
    updateInfo_currentUser();
}

function setListProducts(newList) {
    window.localStorage.setItem('ListProducts', JSON.stringify(newList));
}

function getListProducts() {
    return JSON.parse(window.localStorage.getItem('ListProducts'));
}

function searchByName(list, ten) {
    var tempList = copyObject(list);
    var result = [];
    ten = ten.split(' ');

    for (var sp of tempList) {
        var correct = true;
        for (var t of ten) {
            if (sp.name.toUpperCase().indexOf(t.toUpperCase()) < 0) {
                correct = false;
                break;
            }
        }
        if (correct) {
            result.push(sp);
        }
    }

    return result;
}

function searchByKey(list, ma) {
    for (var l of list) {
        if (l.masp == ma) return l;
    }
}

function copyObject(o) {
    return JSON.parse(JSON.stringify(o));
}

function animateCartNumber() {
    var cn = document.getElementsByClassName('header__cart-notice')[0];
    cn.style.transform = 'scale(2)';
    cn.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
    cn.style.color = 'white';
    setTimeout(function () {
        cn.style.transform = 'scale(1)';
        cn.style.backgroundColor = 'white';
        cn.style.color = 'black';
    }, 1200);
}

function addProductToCart(masp) {
    var user = getCurrentUser();
    if (!user) {
        alert('Bạn cần đăng nhập để mua hàng !');
        showAccount(true);
        return;
    }
    if (user.off) {
        alert('Tài khoản của bạn hiện đang bị khóa nên không thể mua hàng!');
        addAlertBox('Tài khoản của bạn đã bị khóa bởi Admin.', '#aa0000', '#fff', 10000);
        return;
    }
    var t = new Date();
    var daCoSanPham = false;;

    for (var i = 0; i < user.products.length; i++) {
        if (user.products[i].ma == masp) {
            user.products[i].soluong++;
            daCoSanPham = true;
            break;
        }
    }

    if (!daCoSanPham) {
        user.products.push({
            "ma": masp,
            "soluong": 1,
            "date": t
        });
    }

    animateCartNumber();

    setCurrentUser(user);
    updateListUser(user); 
    updateInfo_currentUser();
}

//Tài Khoản

function getCurrentUser() {
    return JSON.parse(window.localStorage.getItem('CurrentUser'));
}

function setCurrentUser(u) {
    window.localStorage.setItem('CurrentUser', JSON.stringify(u));
}

function getListUser() {
    var data = JSON.parse(window.localStorage.getItem('ListUser')) || []
    var l = [];
    for (var d of data) {
        l.push(d);
    }
    return l;
}

function setListUser(l) {
    window.localStorage.setItem('ListUser', JSON.stringify(l));
}

function updateListUser(u, newData) {
    var list = getListUser();
    for (var i = 0; i < list.length; i++) {
        if (equalUser(u, list[i])) {
            list[i] = (newData ? newData : u);
        }
    }
    setListUser(list);
}

function logIn(form) {
    var name = form.username.value;
    var pass = form.pass.value;
    var newUser = new User(name, pass);

    var listUser = getListUser();

    for (var u of listUser) {
        if (equalUser(newUser, u)) {
            if(u.off) {
                alert('Tài khoản này đang bị khoá. Không thể đăng nhập.');
                return false;
            }

            setCurrentUser(u);

            location.reload();
            return false;
        }
    }

    for (var ad of adminInfo) {
        if (equalUser(newUser, ad)) {
            window.localStorage.setItem('admin', true);
            window.location.assign('Admin.html');
            return false;
        }
    }

    alert('Nhập sai tên hoặc mật khẩu !!!');
    form.username.focus();
    return false;
}

function signUp(form) {
    var ho = form.ho.value;
    var ten = form.ten.value;
    var email = form.email.value;
    var username = form.newUser.value;
    var pass = form.newPass.value;
    var newUser = new User(username, pass, ho, ten, email);

    var listUser = getListUser();

    for (var ad of adminInfo) {
        if (newUser.username == ad.username) {
            alert('Tên đăng nhập đã có người sử dụng !!');
            return false;
        }
    }

    for (var u of listUser) {
        if (newUser.username == u.username) {
            alert('Tên đăng nhập đã có người sử dụng !!');
            return false;
        }
    }

    listUser.push(newUser);
    window.localStorage.setItem('ListUser', JSON.stringify(listUser));

    window.localStorage.setItem('CurrentUser', JSON.stringify(newUser));
    alert('Đăng kí thành công, Bạn sẽ được tự động đăng nhập!');
    location.reload();

    return false;
}

function logOut() {
    window.localStorage.removeItem('CurrentUser');
    location.reload();
}

function showAccount(show) {
    var value = (show ? "scale(1)" : "scale(0)");
    var div = document.getElementsByClassName('containTaikhoan')[0];
    div.style.transform = value;
}

function checkAccount() {
    if (!getCurrentUser()) {
        showAccount(true);
    }
}

function setupEventAccount() {
    var taikhoan = document.getElementsByClassName('taikhoan')[0];
    var list = taikhoan.getElementsByTagName('input');

    ['blur', 'focus'].forEach(function (evt) {
        for (var i = 0; i < list.length; i++) {
            list[i].addEventListener(evt, function (e) {
                var label = this.previousElementSibling;
                if (e.type === 'blur') {
                    if (this.value === '') {
                        label.classList.remove('active');
                        label.classList.remove('highlight');
                    } else {
                        label.classList.remove('highlight');
                    }
                } else if (e.type === 'focus') {
                    label.classList.add('active');
                    label.classList.add('highlight');
                }
            });
        }
    })

    // Event chuyển tab login-signup
    var tab = document.getElementsByClassName('tab');
    for (var i = 0; i < tab.length; i++) {
        var a = tab[i].getElementsByTagName('a')[0];
        a.addEventListener('click', function (e) {
            e.preventDefault();

            this.parentElement.classList.add('active');


            if (this.parentElement.nextElementSibling) {
                this.parentElement.nextElementSibling.classList.remove('active');
            }
            if (this.parentElement.previousElementSibling) {
                this.parentElement.previousElementSibling.classList.remove('active');
            }

            var target = this.href.split('#')[1];
            document.getElementById(target).style.display = 'block';

            var hide = (target == 'login' ? 'signup' : 'login');
            document.getElementById(hide).style.display = 'none';
        })
    }
}

function updateInfo_currentUser() {
    var u = getCurrentUser();
    if (u) {
        document.getElementsByClassName('header__cart-notice')[0].innerHTML = getTotalNumberProductInCart(u);

        document.getElementsByClassName('member')[0]
            .getElementsByTagName('a')[0].childNodes[2].nodeValue = ' ' + u.username;

        document.getElementsByClassName('menuMember')[0]
            .classList.remove('hide');
    }
}

function getTotalNumberProductInCart(u) {
    var soluong = 0;
    for (var p of u.products) {
        soluong += p.soluong;
    }
    return soluong;
}

function getTotalNumberProductOnUser(tenSanPham, user) {
    for (var p of user.products) {
        if (p.name == tenSanPham)
            return p.soluong;
    }
    return 0;
}

function numToString(num, char) {
    return num.toLocaleString().split(',').join(char || '.');
}

function stringToNum(str, char) {
    return Number(str.split(char || '.').join(''));
}

function addProduct(p, ele, returnString) {
	promo = new Promo(p.promo.name);
	product = new Product(p.masp, p.name, p.img, p.price, p.star, p.rateCount, promo);

	return addToWeb(product, ele, returnString);
}

function addTopNav() {
    document.write(`    
	<nav class="header__navbar">
        <ul class="header__navbar-list">
            <li class="header__navbar-item header__navbar-item-separate">
                <a href="gioiThieu.html" class="header__navbar-item-link">Giới thiệu</a>
            </li>
            <li class="header__navbar-item">Hotline: <a href="tel:+84 123456789">+84 123456789</a></li>
        </ul>

        <ul class="header__navbar-list">
            <li class="header__navbar-item">
                <a href="hoTro.html" class="header__navbar-item-link">
                    <i class="header__navbar-icon fa-regular fa-circle-question"></i>
                    Hỗ trợ
                </a>
            </li>
            <li class="header__navbar-item header__navbar-item--bold">
            <div class="member">
                <a onclick="checkAccount()">
                    <i class="fa fa-user"></i>
                    Tài khoản
                </a>
                <div class="menuMember hide">
                    <a href="nguoidung.html">Trang người dùng</a>
                    <a onclick="if(window.confirm('Xác nhận đăng xuất ?')) logOut();">Đăng xuất</a>
                </div>
            </div>
            </li>
        </ul>
    </nav>`);
}

function addHeader() {
    document.write(`        
	<div class="header-with-search">
        <div class="header__logo">
            <a href="trangChu.html" class="header__logo-link">
                <img src="./Assets/Img/logo.png" alt="Ảnh logo" class="header__logo-img">
            </a>
        </div>

        <div class="header__search">
            <div class="header__search-input-wrap">
                <form class="input-search" method="get" action="trangChu.html">
                    <div class="autocomplete">
                        <input id="search-box" name="search" type="text" class="header__search-input" autocomplete="off" placeholder="Tìm Kiếm">
                        <button type="submit" class="header__search-btn">
                            <i class="fa fa-search header__search-btn-icon"></i>
                        </button>
                    </div>
                </form>

                <!-- Search History -->
                <div class="header__search-history">
                    <h3 class="header__search-history-heading">Lịch sử tìm kiếm</h3>
                    <ul class="header__search-history-list">
                        <li class="header__search-history-item">
                            <a href="">Cây Tùng Bách</a>
                        </li>
                        <li class="header__search-history-item">
                            <a href="">Cây vạn tuế</a>
                        </li>
                        <li class="header__search-history-item">
                            <a href="">Cây trúc quân tử</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="header__cart">
            <a href="gioHang.html" class="header__cart-link">
                <div class="header__cart-wrap">
                    <i class="header__cart-icon fa-solid fa-cart-shopping"></i>
                    <p class="header-cart__icon-label">Giỏ hàng</p>
                    <span class="header__cart-notice">0</span>
                </div>
            </a>
        </div>
        <div class="header__festival">
            <a href="trienLam.html" class="header__festival-wrap">
                <i class="header__festival-icon fa-solid fa-tree"></i>
                <p class="header-festival__icon-label">Triển lãm</p>
            </a>
        </div>
    </div>`)
}

function addFooter() {
    document.write(`
    <div class="footer-one">
        <div class="footer-one__contact">
            <h2 class="footer-one__heading">Liên Hệ</h2>
            <ul class="footer-one__list">
                <li class="footer-one__item">
                    <i class="footer-one-item__icon fa-sharp fa-solid fa-earth-americas"></i>
                    Công Ty CP Beautiful Tree - MST 0107782800 do Sở Kế hoạch và Đầu tư Tp. Hà Nội cấp
                    ngày 02/04/2017
                </li>
                <li class="footer-one__item">
                    <i class="footer-one-item__icon fa-solid fa-location-dot"></i>
                    Nhà Vườn: Xã Trung Nghĩa, Huyện Yên Phong, Tỉnh Bắc Ninh.
                </li>
                <li class="footer-one__item">
                    <i class="footer-one-item__icon fa-solid fa-phone"></i>
                    Tel: 0987654321
                </li>
                <li class="footer-one__item">
                    <i class="footer-one-item__icon fa-solid fa-envelope"></i>
                    Email: beautifulTree@gmail.com
                </li>
            </ul>
        </div>

        <div class="footer-one__fast-access">
            <h2 class="footer-one__heading">Truy cập nhanh</h2>
            <ul class="footer-one__list">
                <li class="footer-one__item">
                    <a href="" class="footer-one-item__link">
                        Giới Thiệu
                    </a>
                </li>
                <li class="footer-one__item">
                    <a href="" class="footer-one-item__link">
                        Cộng Đồng
                    </a>
                </li>
                <li class="footer-one__item">
                    <a href="" class="footer-one-item__link">
                        Hỗ Trợ
                    </a>
                </li>
                <li class="footer-one__item">
                    <a href="" class="footer-one-item__link">
                        Chính sách đổi trả hàng
                    </a>
                </li>
            </ul>
        </div>
    </div>

    <div class="footer-two">
        <div class="grid">
            <p class="footer-two__text">Copyright © 2016 CÔNG TY CP Beautiful Tree All rights reserved
            </p>
        </div>
    </div>
    `);
}

function addContainTaiKhoan() {
    document.write(`
	<div class="containTaikhoan">
        <span class="close" onclick="showAccount(false);">&times;</span>
        <div class="taikhoan">

            

            <div class="tab-content">
                <div id="login">
                    <h1>Đăng Nhập</h1>

                    <form onsubmit="return logIn(this);">

                        <div class="field-wrap">
                            <label>
                                Tên đăng nhập<span class="req">*</span>
                            </label>
                            <input name='username' type="text" required autocomplete="off" />
                        </div>

                        <div class="field-wrap">
                            <label>
                                Mật khẩu<span class="req">*</span>
                            </label>
                            <input name="pass" type="password" required autocomplete="off" />
                        </div> <!-- pass -->

                        <button type="submit" class="button button-block" />Đăng Nhập</button>

                    </form>

                </div>

                <div id="signup">
                    <h1>Đăng kí miễn phí</h1>

                    <form onsubmit="return signUp(this);">

                        <div class="top-row">
                            <div class="field-wrap">
                                <label>
                                    Họ<span class="req">*</span>
                                </label>
                                <input name="ho" type="text" required autocomplete="off" />
                            </div>

                            <div class="field-wrap">
                                <label>
                                    Tên<span class="req">*</span>
                                </label>
                                <input name="ten" type="text" required autocomplete="off" />
                            </div>
                        </div> <!-- / ho ten -->

                        <div class="field-wrap">
                            <label>
                                Địa chỉ Email<span class="req">*</span>
                            </label>
                            <input name="email" type="email" required autocomplete="off" />
                        </div> <!-- /email -->

                        <div class="field-wrap">
                            <label>
                                Tên đăng nhập<span class="req">*</span>
                            </label>
                            <input name="newUser" type="text" required autocomplete="off" />
                        </div> <!-- /user name -->

                        <div class="field-wrap">
                            <label>
                                Mật khẩu<span class="req">*</span>
                            </label>
                            <input name="newPass" type="password" required autocomplete="off" />
                        </div>

                        <button type="submit" class="button button-block" />Tạo tài khoản</button>

                    </form>

                </div>
            </div>
            <ul class="tab-group">
                <li class="tab active"><a href="#login">Đăng nhập</a></li>
                <li class="tab"><a href="#signup">Đăng kí</a></li>
            </ul>

        </div>
    </div>`);
}

function shuffleArray(array) {
    let currentIndex = array.length,  randomIndex;

    while (currentIndex != 0) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
}

function checkLocalStorage() {
    if (typeof (Storage) == "undefined") {
        alert('Máy tính không hỗ trợ LocalStorage. Không thể lưu thông tin sản phẩm, khách hàng!!');
    } else {
        console.log('LocaStorage OKE!');
    }
}

function gotoTop() {
    if (window.jQuery) {
        jQuery('html,body').animate({
            scrollTop: 0
        }, 100);
    } else {
        document.getElementsByClassName('header__navbar')[0].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
