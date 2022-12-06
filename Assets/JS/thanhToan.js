var currentuser;
window.onload = function () {
    khoiTao();

    currentuser = getCurrentUser();
    addProductToPayment(currentuser);
}


function addProductToPayment(user) {
    var Div = document.getElementsByClassName('main__content')[0];

    var s =
        `
    <div class="delivery-address">
                        <div class="delivery-address__label">
                            <i class="delivery-address__icon fa-solid fa-location-dot"></i>
                            Địa chỉ nhận hàng
                        </div>
                        <form action="" method="POST" class="form" id="form-1">
                            <div class="spacer"></div>

                            <div class="form-group">
                                <label for="fullname" class="form-label">Họ tên</label>
                                <input id="fullname" name="fullname" type="text" placeholder="Họ và tên"
                                    class="form-control">
                                <span class="form-message"></span>
                            </div>

                            <div class="form-group">
                                <label for="telephone" class="form-label">Số điện thoại</label>
                                <input id="telephone" name="telephone" type="text" placeholder="Nhập số điện thoại"
                                    class="form-control">
                                <span class="form-message"></span>
                            </div>

                            <div class="form-group">
                                <label for="email" class="form-label">Email</label>
                                <input id="email" name="email" type="text" placeholder="Nhập email"
                                    class="form-control">
                                <span class="form-message"></span>
                            </div>

                            <div class="form-group">
                                <label for="province" class="form-label">Tỉnh/Thành phố</label>
                                <input id="province" name="province" placeholder="Tỉnh/Thành phố" type="text"
                                    class="form-control">
                                <span class="form-message"></span>
                            </div>

                            <div class="form-group">
                                <label for="district" class="form-label">Quận/Huyện</label>
                                <input id="district" name="district" placeholder="Tỉnh/Thành phố" type="text"
                                    class="form-control">
                                <span class="form-message"></span>
                            </div>

                            <div class="form-group">
                                <label for="wards" class="form-label">Phường/Xã</label>
                                <input id="wards" name="wards" placeholder="Phường/Xã" type="text" class="form-control">
                                <span class="form-message"></span>
                            </div>

                            <div class="form-group">
                                <label for="specific-address" class="form-label">Địa chỉ cụ thể</label>
                                <input id="specific-address" name="specific-address" placeholder="Số nhà, tên đường"
                                    type="text" class="form-control">
                                <span class="form-message"></span>
                            </div>
                        </form>
                    </div>
                    <div class="product__buy">
                        <div class="product-buy__label">
                            <i class="fa-solid fa-gift"></i>
                            Đơn hàng
                        </div>
                        <div class="transaction">
                            <div class="transaction-product-detail__label">
                                <p class="transaction__detail-content">Sản phẩm</p>
                                <p class="transaction__detail-price">Đơn giá</p>
                                <p class="transaction__detail-quantity">Số lượng</p>
                                <p class="transaction__detail-amount">Thành tiền</p>
                            </div>
    `

    var totalPrice = 0;
    for (var i = 0; i < user.products.length; i++) {
        var masp = user.products[i].ma;
        var soluongSp = user.products[i].soluong;
        var p = searchByKey(list_products, masp);
        var price = p.price;
        var thanhtien = stringToNum(price) * soluongSp;

        s += `
        <div class="transaction__product">
            <a target="_blank" href="chiTietSanPham.html?` + p.name.split(' ').join('-') + `" class="transaction-product__link">
                <img src="` + p.img + `" alt="Ảnh cỏ may mắn"
                    class="transaction-product__link-img">
            </a>
            <a target="_blank" href="chiTietSanPham.html?` + p.name.split(' ').join('-') + `" class="transaction-product__name-link">` + p.name + `</a>
            <div class="transaction-product__price">
                <span class="transaction-product__price-current">` + price + `đ</span>
            </div>
            <div class="transaction-product-quantity">
            ` + soluongSp + `
            </div>
            <p class="transaction-product__amount">` + numToString(thanhtien) + `đ</p>
        </div>
		`;
        totalPrice += thanhtien;
    }

    s +=
        `
    <div class="total-amount-wrap">
            <div class="total-amount">
                <p class="total-amount__label">Tổng tiền hàng</p>
                <p class="total-amount__price">` + numToString(totalPrice) + `đ</p>
            </div>
            <div class="transport-fee">
                <p class="transport-fee__label">Phí giao hàng</p>
                <p class="transport-fee__price">35.000đ</p>
            </div>
            <div class="total-payment">
                <p class="total-payment__label">Tổng thanh toán</p>
                <p class="total-payment__price">` + numToString(totalPrice+35000) + `đ</p>
            </div>
        </div>
        <div class="product-btn__buy">
            <a onclick="thanhToan()" class="product-btn__buy-link" >Đặt hàng</a>
        </div>
    </div>
</div>
    `
    Div.innerHTML = s;
}


function thanhToan() {
    var c_user = getCurrentUser();
    if (c_user.off) {
        alert('Tài khoản của bạn hiện đang bị khóa nên không thể mua hàng!');
        return;
    }

    if (!currentuser.products.length) {
        showErrorToast()
        return;
    }
    if (window.confirm('Bạn có muốn thanh toán đơn hàng này?')) {
        currentuser.donhang.push({
            "sp": currentuser.products,
            "ngaymua": new Date(),
            "tinhTrang": 'Đang chờ xử lý'
        });
        currentuser.products = [];
        showSuccessPayment()
        UpdateAll();
    }
}

function UpdateAll() {
	animateCartNumber();

	setCurrentUser(currentuser);
	updateListUser(currentuser);
	addProductToDiv(currentuser);
	updateInfo_currentUser();
}