// Toast function
function toast({ title = "", message = "", type = "info", duration = 3000 }) {
    const main = document.getElementById("toast");
    if (main) {
        const toast = document.createElement("div");

        // Auto remove toast
        const autoRemoveId = setTimeout(function () {
            main.removeChild(toast);
        }, duration + 1000);

        // Remove toast when clicked
        toast.onclick = function (e) {
            if (e.target.closest(".toast__close")) {
                main.removeChild(toast);
                clearTimeout(autoRemoveId);
            }
        };

        const icons = {
            success: "fas fa-check-circle",
            info: "fas fa-info-circle",
            warning: "fas fa-exclamation-circle",
            error: "fas fa-exclamation-circle"
        };
        const icon = icons[type];
        const delay = (duration / 1000).toFixed(2);

        toast.classList.add("toast", `toast--${type}`);
        toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;

        toast.innerHTML = `
        <div class="toast__icon">
            <i class="${icon}"></i>
        </div>
        <div class="toast__body">
            <h3 class="toast__title">${title}</h3>
            <p class="toast__msg">${message}</p>
        </div>
        <div class="toast__close">
            <i class="fas fa-times"></i>
        </div>
        `;
        main.appendChild(toast);
    }
}

function showSuccessToast() {
    toast({
        title: "Thành công!",
        message: "Bạn đã thêm sản phẩm vào giỏ hàng thành công.",
        type: "success",
        duration: 2000
    });
}

function showSuccessPayment() {
    toast({
        title: "Thành công!",
        message: "Các sản phẩm đã được gửi vào đơn hàng. Chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất",
        type: "success",
        duration: 2000
    });
}

function showErrorToast() {
    toast({
        title: "Thất bại!",
        message: "Lỗi! Bạn đã đặt hàng đơn hàng này rồi",
        type: "error",
        duration: 2000
    });
}

function showSuccessAddProduct() {
    toast({
        title: "Thành công!",
        message: "Thêm sản phẩm thành công!",
        type: "success",
        duration: 2000
    });
}

function showErrorNumber() {
    toast({
        title: "Thất bại!",
        message: "GIÁ PHẢI LÀ SỐ NGUYÊN!",
        type: "error",
        duration: 2000
    });
}

function showErrorMaSp() {
    toast({
        title: "Thất bại!",
        message: "MÃ SẢN PHẨM BỊ TRÙNG VUI LÒNG THỬ LẠI!",
        type: "error",
        duration: 2000
    });
}

function showErrorTenSp() {
    toast({
        title: "Thất bại!",
        message: "TÊN SẢN PHẨM BỊ TRÙNG VUI LÒNG THỬ LẠI!",
        type: "error",
        duration: 2000
    });
}

function showSuccessUpdateProduct() {
    toast({
        title: "Thành công!",
        message: "Sửa sản phẩm thành công!",
        type: "success",
        duration: 2000
    });
}