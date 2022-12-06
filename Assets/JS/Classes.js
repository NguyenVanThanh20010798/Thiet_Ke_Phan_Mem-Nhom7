function User(username, pass, ho, ten, email, products, donhang) {
	this.ho = ho || '';
	this.ten = ten || '';
	this.email = email || '';

	this.username = username;
	this.pass = pass;
	this.products = products || [];
	this.donhang = donhang || [];
}

function equalUser(u1, u2) {
	return (u1.username == u2.username && u1.pass == u2.pass);
}

function Promo(name) {
	this.name = name;
}

function Product(masp, name, img, price, promo) {
	this.masp = masp;
	this.img = img;
	this.name = name;
	this.price = price;
	this.promo = promo;
}

function addToWeb(p, ele, returnString) {
	var price = `<strong>` + p.price + `&#8363;</strong>`;

	var chitietSp = 'chiTietSanPham.html?' + p.name.split(' ').join('-');

	var newLi =
	`<div class="grid__column-2-4 home-product__detail">
        <a href="` + chitietSp + `" class="home-product-item">
            <div class="home-product-item-img__wrap">
                <img src=` + p.img + ` alt="Ảnh cây"
                    class="home-product-item__img">
            </div>
            <h4 class="home-product-item__name">` + p.name + `</h4>
            <div class="home-product-item-price">
                <span class="home-product-item-price-current">` + price + `</span>
            </div>
            <div class="home-product-item__state">
                <div class="home-product-item__status">
                    <i class="home-product-item__status-icon fa-solid fa-check"></i>
                    <span class="home-product-item__status-name">Còn hàng</span>
                </div>
            </div>
        </a>
		<button class="themvaogio home-product-item__add-cart" onclick=" showSuccessToast(); addProductToCart('`+p.masp+`'); return false;">
			<i class="home-product-item__cart-icon fa-solid fa-cart-shopping">
			</i>
		</button>
    </div>`;

	if(returnString) return newLi;

	var products = ele || document.getElementById('products');
	products.innerHTML += newLi;
}