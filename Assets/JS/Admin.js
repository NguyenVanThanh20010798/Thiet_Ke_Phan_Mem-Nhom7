var TotalPrice = 0;

window.onload = function () {
    list_products = getListProducts() || list_products;
    adminInfo = getListAdmin() || adminInfo;

    addEventChangeTab();

    if (window.localStorage.getItem('admin')) {
        addTableProducts();
        addTableOder();
        addTableCustomer();
        addStatistical();

        openTab('Trang Chủ')
    } else {
        document.body.innerHTML = `<h1 style="color:red; with:100%; text-align:center; margin: 50px;"> Truy cập bị từ chối</h1>`;
    }
}

function logOutAdmin() {
    window.localStorage.removeItem('admin');
}

function getListRandomColor(length) {
    let result = [];
    for (let i = length; i--;) {
        result.push(getRandomColor());
    }
    return result;
}

function addChart(id, chartOption) {
    var ctx = document.getElementById(id).getContext('2d');
    var chart = new Chart(ctx, chartOption);
}


function createChartConfig(
    title = 'Title',
    charType = 'bar',
    labels = ['nothing'],
    data = [2],
    colors = ['red'],
) {
    return {
        type: charType,
        data: {
            labels: labels,
            datasets: [{
                label: title,
                data: data,
                backgroundColor: colors,
                borderColor: colors,
            }]
        },
        options: {
            title: {
                fontColor: '#fff',
                fontSize: 25,
                display: true,
                text: title
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    };
}

function addStatistical() {
    var danhSachDonHang = getListOder(true);

    var thongKeHang = {};

    danhSachDonHang.forEach(donHang => {
        if (donHang.tinhTrang === 'Đã hủy') return;

        donHang.sp.forEach(sanPhamTrongDonHang => {
            let tenHang = sanPhamTrongDonHang.sanPham.category;
            let soLuong = sanPhamTrongDonHang.soLuong;
            let donGia = stringToNum(sanPhamTrongDonHang.sanPham.price);
            let thanhTien = soLuong * donGia;

            if (!thongKeHang[tenHang]) {
                thongKeHang[tenHang] = {
                    soLuongBanRa: 0,
                    doanhThu: 0,
                }
            }

            thongKeHang[tenHang].soLuongBanRa += soLuong;
            thongKeHang[tenHang].doanhThu += thanhTien;
        })
    })


    // Lấy mảng màu ngẫu nhiên để vẽ đồ thị
    let colors = getListRandomColor(Object.keys(thongKeHang).length);

    // Thêm thống kê
    addChart('myChart1', createChartConfig(
        'Số lượng bán ra',
        'bar',
        Object.keys(thongKeHang),
        Object.values(thongKeHang).map(_ => _.soLuongBanRa),
        colors,
    ));

    addChart('myChart2', createChartConfig(
        'Doanh thu',
        'doughnut',
        Object.keys(thongKeHang),
        Object.values(thongKeHang).map(_ => _.doanhThu),
        colors,
    ));
}

function addEventChangeTab() {
    var sidebar = document.getElementsByClassName('sidebar')[0];
    var list_a = sidebar.getElementsByTagName('a');
    for (var a of list_a) {
        if (!a.onclick) {
            a.addEventListener('click', function () {
                turnOff_Active();
                this.classList.add('active');
                var tab = this.childNodes[1].data.trim()
                openTab(tab);
            })
        }
    }
}

function turnOff_Active() {
    var sidebar = document.getElementsByClassName('sidebar')[0];
    var list_a = sidebar.getElementsByTagName('a');
    for (var a of list_a) {
        a.classList.remove('active');
    }
}

function openTab(nameTab) {
    var main = document.getElementsByClassName('main')[0].children;
    for (var e of main) {
        e.style.display = 'none';
    }

    switch (nameTab) {
        case 'Trang Chủ': document.getElementsByClassName('home')[0].style.display = 'block'; break;
        case 'Sản Phẩm': document.getElementsByClassName('sanpham')[0].style.display = 'block'; break;
        case 'Đơn Hàng': document.getElementsByClassName('donhang')[0].style.display = 'block'; break;
        case 'Khách Hàng': document.getElementsByClassName('khachhang')[0].style.display = 'block'; break;
    }
}

// Sản Phẩm
function addTableProducts() {
    var tc = document.getElementsByClassName('sanpham')[0].getElementsByClassName('table-content')[0];
    var s = `<table class="table-outline hideImg">`;

    for (var j = 0; j < list_products.length; j++) {
        var p = list_products[j];
        s += `<tr>
            <td style="width: 5%">` + (j + 1) + `</td>
            <td style="width: 10%">` + p.masp + `</td>
            <td style="width: 40%">
                <a title="Xem chi tiết" target="_blank" href="chiTietSanPham.html?` + p.name.split(' ').join('-') + `">` + p.name + `</a>
                <img src="` + p.img + `"></img>
            </td>
            <td style="width: 15%">` + p.price + `</td>
            <td style="width: 15%">
                <div class="tooltip">
                    <i class="fa fa-wrench" onclick="addTableUpdateProduct('` + p.masp + `')"></i>
                    <span class="tooltiptext">Sửa</span>
                </div>
                <div class="tooltip">
                    <i class="fa fa-trash" onclick="deleteProduct('` + p.masp + `', '` + p.name + `')"></i>
                    <span class="tooltiptext">Xóa</span>
                </div>
            </td>
        </tr>`;
    }
    s += `</table>`;

    tc.innerHTML = s;
}

function findProduct(inp) {
    var kieuTim = document.getElementsByName('kieuTimSanPham')[0].value;
    var text = inp.value;

    var vitriKieuTim = { 'ma': 1, 'ten': 2 };

    var listTr_table = document.getElementsByClassName('sanpham')[0].getElementsByClassName('table-content')[0].getElementsByTagName('tr');
    for (var tr of listTr_table) {
        var td = tr.getElementsByTagName('td')[vitriKieuTim[kieuTim]].innerHTML.toLowerCase();

        if (td.indexOf(text.toLowerCase()) < 0) {
            tr.style.display = 'none';
        } else {
            tr.style.display = '';
        }
    }
}

function getProductInfoTable(id) {
    var khung = document.getElementById(id);
    var tr = khung.getElementsByTagName('tr');

    var masp = tr[1].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value;
    var name = tr[2].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value;
    var categoris = tr[3].getElementsByTagName('td')[1].getElementsByTagName('select')[0].value;
    var img = tr[4].getElementsByTagName('td')[1].getElementsByTagName('img')[0].src;
    var img1 = tr[6].getElementsByTagName('td')[1].getElementsByTagName('img')[0].src;
    var img2 = tr[7].getElementsByTagName('td')[1].getElementsByTagName('img')[0].src;
    var img3 = tr[8].getElementsByTagName('td')[1].getElementsByTagName('img')[0].src;
    var price = tr[9].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value;
    var filter = tr[10].getElementsByTagName('td')[1].getElementsByTagName('select')[0].value;

    var description = tr[12].getElementsByTagName('td')[1].getElementsByTagName('textarea')[0].value;
    var introduce = tr[14].getElementsByTagName('td')[1].getElementsByTagName('textarea')[0].value;
    var characteristics = tr[15].getElementsByTagName('td')[1].getElementsByTagName('textarea')[0].value;
    var meaningful = tr[16].getElementsByTagName('td')[1].getElementsByTagName('textarea')[0].value;
    var howtoplant = tr[17].getElementsByTagName('td')[1].getElementsByTagName('textarea')[0].value;


    if (isNaN(price)) {
        showErrorNumber();
        return false;
    }

    try {
        return {
            "name": name,
            "category": categoris,
            "img": img,
            "img2": img1,
            "img3": img2,
            "img4": img3,
            "price": numToString(Number.parseInt(price, 10)),
            "masp": masp,
            "promo": {
                "name": filter
            },
            "detail": {
                "description": description,
                "detailProduct": {
                    "gioithieu": introduce,
                    "dacdiem": characteristics,
                    "congdung": meaningful,
                    "cachtrong": howtoplant
                }
            },
        }
    } catch (e) {
        alert('Lỗi: ' + e.toString());
        return false;
    }
}


function addProduct() {
    var newSp = getProductInfoTable('khungThemSanPham');
    if (!newSp) return;

    for (var p of list_products) {
        if (p.masp == newSp.masp) {
            showErrorMaSp();
            return false;
        }

        if (p.name == newSp.name) {
            showErrorTenSp();
            return false;
        }
    }
    list_products.push(newSp);

    setListProducts(list_products);

    addTableProducts();

    showSuccessAddProduct();
    document.getElementById('khungaddProduct').style.transform = 'scale(0)';
}

function deleteProduct(masp, tensp) {
    if (window.confirm('Bạn có chắc muốn xóa ' + tensp)) {
        for (var i = 0; i < list_products.length; i++) {
            if (list_products[i].masp == masp) {
                list_products.splice(i, 1);
            }
        }

        setListProducts(list_products);

        addTableProducts();
    }
}

function updateProduct(masp) {
    var sp = getProductInfoTable('khungSuaSanPham');
    if (!sp) return;

    for (var p of list_products) {
        if (p.masp == masp && p.masp != sp.masp) {
            showErrorMaSp();
            return false;
        }

        if (p.name == sp.name && p.masp != sp.masp) {
            showErrorTenSp();
            return false;
        }
    }

    for (var i = 0; i < list_products.length; i++) {
        if (list_products[i].masp == masp) {
            list_products[i] = sp;
        }
    }

    setListProducts(list_products);

    addTableProducts();

    showSuccessUpdateProduct()

    document.getElementById('khungSuaSanPham').style.transform = 'scale(0)';
}


function addTableUpdateProduct(masp) {
    var sp;
    for (var p of list_products) {
        if (p.masp == masp) {
            sp = p;
        }
    }

    var s = `<span class="close" onclick="this.parentElement.style.transform = 'scale(0)';">&times;</span>
    <table class="overlayTable table-outline table-content table-header">
        <tr>
            <th colspan="2">`+ sp.name + `</th>
        </tr>
        <tr>
            <td>Mã sản phẩm:</td>
            <td><input type="text" value="`+ sp.masp + `"></td>
        </tr>
        <tr>
            <td>Tên sản phẩm:</td>
            <td><input type="text" value="`+ sp.name + `"></td>
        </tr>
        <tr>
            <td>Thể loại:</td>
            <td>
                <select>`

    var category = ["Cây Cảnh", "Cây Công Trình", "Cây Giống", "Cây Ăn Quả", "Hoa Chậu", "Hoa Sự Kiện", "Hạt Giống", "Chậu Cảnh", "Tiểu Cảnh/Sân Vườn"];
    for (var c of category) {
        if (sp.category == c)
            s += (`<option value="` + c + `" selected>` + c + `</option>`);
        else s += (`<option value="` + c + `">` + c + `</option>`);
    }

    s += `
                </select>
            </td>
        </tr>
        <tr>
            <td>Hình:</td>
            <td>
                <img class="hinhDaiDien" id="anhDaiDienSanPhamSua" src="`+ sp.img + `">
                <input type="file" accept="image/*" onchange="updateImageProduct(this.files, 'anhDaiDienSanPhamSua')">
            </td>
        </tr>
        <tr>
            <th colspan="2">Hình Slider</th>
        </tr>
        <tr>
            <td>Hình1:</td>
            <td>
                <img class="hinhSlider1" id="anhDaiDienSanPhamSua2" src="`+sp.img2+`">
                <input type="file" accept="image/*" onchange="updateImageProduct(this.files, 'anhDaiDienSanPhamSua2')">
            </td>
        </tr>
        <tr>
            <td>Hình2:</td>
            <td>
                <img class="hinhSlider2" id="anhDaiDienSanPhamSua3" src="`+sp.img3+`">
                <input type="file" accept="image/*" onchange="updateImageProduct(this.files, 'anhDaiDienSanPhamSua3')">
            </td>
        </tr>
        <tr>
            <td>Hình3:</td>
            <td>
                <img class="hinhSlider3" id="anhDaiDienSanPhamSua4" src="`+sp.img4+`">
                <input type="file" accept="image/*" onchange="updateImageProduct(this.files, 'anhDaiDienSanPhamSua4')">
            </td>
        </tr>
        <tr>
            <td>Giá tiền (số nguyên):</td>
            <td><input type="text" value="`+ stringToNum(sp.price) + `"></td>
        </tr>
        <tr>
            <td>Filter:</td>
                <td>
                    <select>
                        <option value="caycanh" `+ (sp.category.name == 'caycanh' ? 'selected' : '') + `>Cây Cảnh</option>
                        <option value="caycongtrinh" `+ (sp.category.name == 'caycongtrinh' ? 'selected' : '') + `>Cây Công Trình</option>
                        <option value="caygiong" `+ (sp.category.name == 'caygiong' ? 'selected' : '') + `>Cây Giống</option>
                        <option value="cayanqua" `+ (sp.category.name == 'cayanqua' ? 'selected' : '') + `>Cây Ăn Quả</option>
                        <option value="hoachau" `+ (sp.category.name == 'hoachau' ? 'selected' : '') + `>Hoa Chậu</option>
                        <option value="hoasukien" `+ (sp.category.name == 'hoasukien' ? 'selected' : '') + `>Hoa Sự Kiện</option>
                        <option value="hatgiong" `+ (sp.category.name == 'hatgiong' ? 'selected' : '') + `>Hạt Giống</option>
                        <option value="chaucanh" `+ (sp.category.name == 'chaucanh' ? 'selected' : '') + `>Chậu Cảnh</option>
                        <option value="tieucanh" `+ (sp.category.name == 'caycanh' ? 'selected' : '') + `>Tiểu Cảnh/Sân Vườn</option>
                    </select>
                </td>
        </tr>
        <tr>
            <th colspan="2">Thông Tin Sản Phẩm</th>
        </tr>
        <tr>
            <td>Mô Tả</td>
            <td><textarea id="description" rows="5" cols="80">`+ sp.detail.description + `</textarea></td>
        </tr>
        <tr>
            <th colspan="2">Chi Tiết sản phẩm</th>
        </tr>
        <tr>
            <td>Giới thiệu</td>
            <td><textarea id="introduce" name="moTa" rows="5" cols="80">`+ sp.detail.detailProduct.introduce + `</textarea></td>
        </tr>
        <tr>
            <td>Đặc điểm</td>
            <td><textarea id="characteristics" name="moTa" rows="5" cols="80">`+ sp.detail.detailProduct.characteristics + `</textarea></td>
        </tr>
        <tr>
            <td>Công dụng/Ý nghĩa</td>
            <td><textarea id="meaningful" name="moTa" rows="5" cols="80">`+ sp.detail.detailProduct.meaningful + `</textarea></td>
        </tr>
        <tr>
            <td>Cách trồng</td>
            <td><textarea id="howtoplant" name="moTa" rows="5" cols="80">`+ sp.detail.detailProduct.howtoplant + `</textarea></td>
        </tr>
        <tr>
            <td colspan="2"  class="table-footer"> <button onclick="updateProduct('`+ sp.masp + `')">SỬA</button> </td>
        </tr>
    </table>`
    var khung = document.getElementById('khungSuaSanPham');
    khung.innerHTML = s;
    khung.style.transform = 'scale(1)';
}

function updateImageProduct(files, id) {
    const reader = new FileReader();
    reader.addEventListener("load", function () {
        img = reader.result;
        document.getElementById(id).src = img;
    }, false);

    if (files[0]) {
        reader.readAsDataURL(files[0]);
    }
    if (files[1]) {
        reader.readAsDataURL(files[1]);
    }
    if (files[2]) {
        reader.readAsDataURL(files[2]);
    }
    if (files[3]) {
        reader.readAsDataURL(files[3]);
    }
}

function sortProductsTable(loai) {
    var list = document.getElementsByClassName('sanpham')[0].getElementsByClassName("table-content")[0];
    var tr = list.getElementsByTagName('tr');

    quickSort(tr, 0, tr.length - 1, loai, getValueOfTypeInTableProduct);
    decrease = !decrease;
}

function getValueOfTypeInTableProduct(tr, loai) {
    var td = tr.getElementsByTagName('td');
    switch (loai) {
        case 'STT': return Number(td[0].innerHTML);
        case 'masp': return td[1].innerHTML.toLowerCase();
        case 'ten': return td[2].innerHTML.toLowerCase();
        case 'gia': return stringToNum(td[3].innerHTML);
        case 'category': return td[4].innerHTML.toLowerCase();
    }
    return false;
}


//Đơn Hàng
function addTableOder() {
    var tc = document.getElementsByClassName('donhang')[0].getElementsByClassName('table-content')[0];
    var s = `<table class="table-outline hideImg">`;

    var listDH = getListOder();

    TotalPrice = 0;
    for (var i = 0; i < listDH.length; i++) {
        var d = listDH[i];
        s += `<tr>
            <td style="width: 5%">` + (i + 1) + `</td>
            <td style="width: 13%">` + d.ma + `</td>
            <td style="width: 7%">` + d.khach + `</td>
            <td style="width: 20%">` + d.sp + `</td>
            <td style="width: 15%">` + d.tongtien + `</td>
            <td style="width: 10%">` + d.ngaygio + `</td>
            <td style="width: 10%">` + d.tinhTrang + `</td>
            <td style="width: 10%">
                <div class="tooltip">
                    <i class="fa fa-check" onclick="Approve('`+ d.ma + `', true)"></i>
                    <span class="tooltiptext">Duyệt</span>
                </div>
                <div class="tooltip">
                    <i class="fa fa-remove" onclick="Approve('`+ d.ma + `', false)"></i>
                    <span class="tooltiptext">Hủy</span>
                </div>
                
            </td>
        </tr>`;
        TotalPrice += stringToNum(d.tongtien);
    }

    s += `</table>`;
    tc.innerHTML = s;
}

function getListOder(traVeDanhSachSanPham = false) {
    var u = getListUser();
    var result = [];
    for (var i = 0; i < u.length; i++) {
        for (var j = 0; j < u[i].donhang.length; j++) {
            var tongtien = 0;
            for (var s of u[i].donhang[j].sp) {
                var timsp = searchByKey(list_products, s.ma);
                tongtien += stringToNum(timsp.price);
            }

            var x = new Date(u[i].donhang[j].ngaymua).toLocaleString();

            var sps = '';
            for (var s of u[i].donhang[j].sp) {
                sps += `<p style="text-align: right">` + (searchByKey(list_products, s.ma).name + ' [' + s.soluong + ']') + `</p>`;
            }

            var danhSachSanPham = [];
            for (var s of u[i].donhang[j].sp) {
                danhSachSanPham.push({
                    sanPham: searchByKey(list_products, s.ma),
                    soLuong: s.soluong,
                });
            }

            result.push({
                "ma": u[i].donhang[j].ngaymua.toString(),
                "khach": u[i].username,
                "sp": traVeDanhSachSanPham ? danhSachSanPham : sps,
                "tongtien": numToString(tongtien),
                "ngaygio": x,
                "tinhTrang": u[i].donhang[j].tinhTrang
            });
        }
    }
    return result;
}

// Duyệt đơn
function Approve(maDonHang, duyetDon) {
    var u = getListUser();
    for (var i = 0; i < u.length; i++) {
        for (var j = 0; j < u[i].donhang.length; j++) {
            if (u[i].donhang[j].ngaymua == maDonHang) {
                if (duyetDon) {
                    if (u[i].donhang[j].tinhTrang == 'Đang chờ xử lý') {
                        u[i].donhang[j].tinhTrang = 'Đã giao hàng';

                    } else if (u[i].donhang[j].tinhTrang == 'Đã hủy') {
                        alert('Không thể duyệt đơn đã hủy !');
                        return;
                    }
                } else {
                    if (u[i].donhang[j].tinhTrang == 'Đang chờ xử lý') {
                        if (window.confirm('Bạn có chắc muốn hủy đơn hàng này. Hành động này sẽ không thể khôi phục lại !'))
                            u[i].donhang[j].tinhTrang = 'Đã hủy';

                    } else if (u[i].donhang[j].tinhTrang == 'Đã giao hàng') {
                        alert('Không thể hủy đơn hàng đã giao !');
                        return;
                    }
                }
                break;
            }
        }
    }

    setListUser(u);

    addTableOder();
}

function findOrder(inp) {
    var kieuTim = document.getElementsByName('kieuTimDonHang')[0].value;
    var text = inp.value;

    var vitriKieuTim = { 'ma': 1, 'khachhang': 2, 'trangThai': 6 };

    var listTr_table = document.getElementsByClassName('donhang')[0].getElementsByClassName('table-content')[0].getElementsByTagName('tr');
    for (var tr of listTr_table) {
        var td = tr.getElementsByTagName('td')[vitriKieuTim[kieuTim]].innerHTML.toLowerCase();

        if (td.indexOf(text.toLowerCase()) < 0) {
            tr.style.display = 'none';
        } else {
            tr.style.display = '';
        }
    }
}

function sortOderTable(loai) {
    var list = document.getElementsByClassName('donhang')[0].getElementsByClassName("table-content")[0];
    var tr = list.getElementsByTagName('tr');

    quickSort(tr, 0, tr.length - 1, loai, getValueOfTypeInTable_DonHang);
    decrease = !decrease;
}

function getValueOfTypeInTable_DonHang(tr, loai) {
    var td = tr.getElementsByTagName('td');
    switch (loai) {
        case 'stt': return Number(td[0].innerHTML);
        case 'ma': return new Date(td[1].innerHTML);
        case 'khach': return td[2].innerHTML.toLowerCase();
        case 'sanpham': return td[3].children.length;
        case 'tongtien': return stringToNum(td[4].innerHTML);
        case 'ngaygio': return new Date(td[5].innerHTML);
        case 'trangthai': return td[6].innerHTML.toLowerCase();
    }
    return false;
}


//Khách hàng
function addTableCustomer() {
    var tc = document.getElementsByClassName('khachhang')[0].getElementsByClassName('table-content')[0];
    var s = `<table class="table-outline hideImg">`;

    var listUser = getListUser();

    for (var i = 0; i < listUser.length; i++) {
        var u = listUser[i];
        s += `<tr>
            <td style="width: 5%">` + (i + 1) + `</td>
            <td style="width: 15%">` + u.ho + ' ' + u.ten + `</td>
            <td style="width: 20%">` + u.email + `</td>
            <td style="width: 20%">` + u.username + `</td>
            <td style="width: 10%">` + u.pass + `</td>
            <td style="width: 10%">
                <div class="tooltip">
                    <label class="switch">
                        <input type="checkbox" `+ (u.off ? '' : 'checked') + ` onclick="disableUser(this, '` + u.username + `')">
                        <span class="slider round"></span>
                    </label>
                    <span class="tooltiptext">`+ (u.off ? 'Mở' : 'Khóa') + `</span>
                </div>
                <div class="tooltip">
                    <i class="fa fa-remove" onclick="deleteUser('`+ u.username + `')"></i>
                    <span class="tooltiptext">Xóa</span>
                </div>
            </td>
        </tr>`;
    }

    s += `</table>`;
    tc.innerHTML = s;
}

function findCustomer(inp) {
    var kieuTim = document.getElementsByName('kieuTimKhachHang')[0].value;
    var text = inp.value;

    var vitriKieuTim = { 'ten': 1, 'email': 2, 'taikhoan': 3 };

    var listTr_table = document.getElementsByClassName('khachhang')[0].getElementsByClassName('table-content')[0].getElementsByTagName('tr');
    for (var tr of listTr_table) {
        var td = tr.getElementsByTagName('td')[vitriKieuTim[kieuTim]].innerHTML.toLowerCase();

        if (td.indexOf(text.toLowerCase()) < 0) {
            tr.style.display = 'none';
        } else {
            tr.style.display = '';
        }
    }
}

function disableUser(inp, taikhoan) {
    var listUser = getListUser();
    for (var u of listUser) {
        if (u.username == taikhoan) {
            let value = !inp.checked
            u.off = value;
            setListUser(listUser);

            setTimeout(() => alert(`${value ? 'Khoá' : 'Mở khoá'} tải khoản ${u.username} thành công.`), 500);
            break;
        }
    }
    var span = inp.parentElement.nextElementSibling;
    span.innerHTML = (inp.checked ? 'Khóa' : 'Mở');
}

function deleteUser(taikhoan) {
    if (window.confirm('Xác nhận xóa ' + taikhoan + '? \nMọi dữ liệu về ' + taikhoan + ' sẽ mất! Bao gồm cả những đơn hàng của ' + taikhoan)) {
        var listuser = getListUser();
        for (var i = 0; i < listuser.length; i++) {
            if (listuser[i].username == taikhoan) {
                listuser.splice(i, 1);
                setListUser(listuser);
                localStorage.removeItem('CurrentUser');
                addTableCustomer();
                addTableOder();
                return;
            }
        }
    }
}

// Sắp xếp
function sortCustomerTable(loai) {
    var list = document.getElementsByClassName('khachhang')[0].getElementsByClassName("table-content")[0];
    var tr = list.getElementsByTagName('tr');

    quickSort(tr, 0, tr.length - 1, loai, getValueOfTypeInTableCustomer);
    decrease = !decrease;
}

function getValueOfTypeInTable_KhachHang(tr, loai) {
    var td = tr.getElementsByTagName('td');
    switch (loai) {
        case 'stt': return Number(td[0].innerHTML);
        case 'hoten': return td[1].innerHTML.toLowerCase();
        case 'email': return td[2].innerHTML.toLowerCase();
        case 'taikhoan': return td[3].innerHTML.toLowerCase();
        case 'matkhau': return td[4].innerHTML.toLowerCase();
    }
    return false;
}


// Sắp Xếp
var decrease = true;

function quickSort(arr, left, right, loai, func) {
    var pivot,
        partitionIndex;

    if (left < right) {
        pivot = right;
        partitionIndex = partition(arr, pivot, left, right, loai, func);

        quickSort(arr, left, partitionIndex - 1, loai, func);
        quickSort(arr, partitionIndex + 1, right, loai, func);
    }
    return arr;
}

function partition(arr, pivot, left, right, loai, func) {
    var pivotValue = func(arr[pivot], loai),
        partitionIndex = left;

    for (var i = left; i < right; i++) {
        if (decrease && func(arr[i], loai) > pivotValue
            || !decrease && func(arr[i], loai) < pivotValue) {
            swap(arr, i, partitionIndex);
            partitionIndex++;
        }
    }
    swap(arr, right, partitionIndex);
    return partitionIndex;
}

function swap(arr, i, j) {
    var tempi = arr[i].cloneNode(true);
    var tempj = arr[j].cloneNode(true);
    arr[i].parentNode.replaceChild(tempj, arr[i]);
    arr[j].parentNode.replaceChild(tempi, arr[j]);
}

function promoToStringValue(pr) {
    switch (pr.name) {
        case 'caycanh':
            return 'Cây Cảnh';
        case 'caycongtrinh':
            return 'Cây Công Trình'
        case 'caygiong':
            return 'Cây Giống';
        case 'cayanqua':
            return 'Cây Ăn Quả';
        case 'hoachau':
            return 'Hoa Chậu';
        case 'hoasukien':
            return 'Hoa Sự Kiện'
        case 'hatgiong':
            return 'Chậu Cảnh';
        case 'tieucanh':
            return 'Tiểu Cảnh/Sân Vườn';
    }
    return '';
}
