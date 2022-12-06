var currentuser;
window.onload = function () {
    khoiTao();

    currentuser = getCurrentUser();
    addProductToCart(currentuser);
}

function addProductToCart(user) {
    var Div = document.getElementsByClassName('cart__detail-product')[0];

    var s = `<div class="cart__detail-label">
                <p class="cart__detail-content">Sản phẩm</p>
                <p class="cart__detail-price">Đơn giá</p>
                <p class="cart__detail-quantity">Số lượng</p>
                <p class="cart__detail-amount">Thành tiền</p>
                <i class="cart-detail__icon-delete fa-solid fa-trash" onclick="deleteAll()"></i>
            </div>`

    if (!user) {
        s += `
        <div>
            <h1 style="color:red; background-color:white; font-weight:bold; text-align:center; padding: 15px 0;">
            Bạn chưa đăng nhập, Vui lòng đăng nhập!
            </h1> 
        </div>
					
		`;
        Div.innerHTML = s;
        return;
    } else if (user.products.length == 0) {
        s += `
        <div style="text-align:center">
        <img src="Assets/Img/no-cart.png" alt="Ảnh giỏ hàng trống" style="width:20%">
        <h1 style="color:red;font-weight:bold; text-align:center; padding: 15px 0;">
        Giỏ hàng trống
        </h1> 
    </div>
		`;
        Div.innerHTML = s;
        return;
    }

    var totalPrice = 0;
    for (var i = 0; i < user.products.length; i++) {
        var masp = user.products[i].ma;
        var soluongSp = user.products[i].soluong;
        var p = searchByKey(list_products, masp);
        var price = p.price;
        var thanhtien = stringToNum(price) * soluongSp;

        s += `
        <div class="cart__product">
                <a target="_blank" href="chiTietSanPham.html?` + p.name.split(' ').join('-') + `" class="cart-product__link">
                    <img src="` + p.img + `" alt="Ảnh cỏ may mắn"
                        class="cart-product__link-img">
                </a>
                <a target="_blank" href="chiTietSanPham.html?` + p.name.split(' ').join('-') + `" class="cart-product__name-link">` + p.name + `</a>
                <div class="cart-product__price">
                    <span class="cart-product__price-current">` + price + `đ</span>
                </div>
                <div class="cart-product-quantity">
                    <button class="cart-product__subtract" onclick="reduce('` + masp + `')">
                        <i class="cart-product-subtract__icon fa-solid fa-minus"></i>
                    </button>
                    <input type="number" name="" min="1"
                        class="cart-product-input__quantity" onchange="updateQuantityOnInput(this, '` + masp + `')" value=` + soluongSp + `>
                    <button class="cart-product__add" onclick="increasing('` + masp + `')">
                        <i class="cart-product__add-icon fa-solid fa-plus"></i>
                    </button>
                </div>
                <p class="cart-product__amount">` + numToString(thanhtien) + `đ</p>
                <i class="cart-detail__icon-delete fa-solid fa-trash" onclick="deleteProductInCart(` + i + `)"></i>
            </div>
		`;
        // Chú ý nháy cho đúng ở reduce, increasing
        totalPrice += thanhtien;
    }

    s += `<div class="cart__pay">
                <p class="cart-amount-old">
                    <span class="cart-amount-old__label">Tạm Tính</span>
                    <span class="total-price-old">` + numToString(totalPrice) + `đ</span>
                </p>
                <p class="cart-amount-old">
                    <span class="cart-amount-old__label">Vat</span>
                    <span class="total-price-old">0đ</span>
                </p>
                <p class="cart-amount-current">
                    <span class="cart-amount-current__label">Thành tiền</span>
                    <span class="total-price-current">` + numToString(totalPrice) + `đ</span>
                </p>
                <div class="cart-pay__btn-submit">
                    <a href="thanhToan.html" class="cart-pay__btn-submit-link" onclick="checkPayment()">Tiến hành đặt hàng</a>
                </div>
            </div>`;
    Div.innerHTML = s;
}

function deleteProductInCart(i) {
	if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này chứ')) {
		currentuser.products.splice(i, 1);
		UpdateAll();
	}
}

function deleteAll() {
	if (currentuser.products.length) {
		if (window.confirm('Bạn có chắc chắn muốn xóa hết sản phẩm trong giỏ')) {
			currentuser.products = [];
			UpdateAll();
		}
	}
}

function updateQuantityOnInput(inp, masp) {
	var soLuongMoi = Number(inp.value);
	if (!soLuongMoi || soLuongMoi <= 0) soLuongMoi = 1;

	for (var p of currentuser.products) {
		if (p.ma == masp) {
			p.soluong = soLuongMoi;
		}
	}

	UpdateAll();
}

function increasing(masp) {
	for (var p of currentuser.products) {
		if (p.ma == masp) {
			p.soluong++;
		}
	}

	UpdateAll();
}

function reduce(masp) {
	for (var p of currentuser.products) {
		if (p.ma == masp) {
			if (p.soluong > 1) {
				p.soluong--;
			} else {
				return;
			}
		}
	}

	UpdateAll();
}

function UpdateAll() {
	animateCartNumber();

	setCurrentUser(currentuser);
	updateListUser(currentuser);
	addProductToDiv(currentuser);
	updateInfo_currentUser();
}