const products = [
    {
        id: 1,
        name: "Bút bi",
        price: 5000,
        image: "../img/Butbi.jpg",
        description: "Bút bi chất lượng cao, viết êm, mực đều"
    },
    {
        id: 2,
        name: "Tập 100 trang",
        price: 12000,
        image: "../img/Tap100trang.jpg",
        description: "Vở học sinh 100 trang, giấy trắng mịn"
    },
    {
        id: 3,
        name: "Keo dán",
        price: 8000,
        image: "../img/Keodan.jpg",
        description: "Keo dán đa năng, khô nhanh, dính tốt"
    },
    {
        id: 4,
        name: "Sổ tay",
        price: 50000,
        image: "../img/Sotay.jpg",
        description: "Sổ tay bìa cứng, thiết kế đẹp"
    },
    {
        id: 5,
        name: "Thước kẻ",
        price: 10000,
        image: "../img/Thuocke.jpeg",
        description: "Thước kẻ 20cm, chia vạch rõ ràng"
    },
    {
        id: 6,
        name: "Giấy note dán",
        price: 15000,
        image: "../img/Giaydannote.jpg",
        description: "Giấy note nhiều màu, dễ dàng sử dụng"
    },
    {
        id: 7,
        name: "Bìa hồ sơ",
        price: 7000,
        image: "../img/Biahoso.png",
        description: "Bìa hồ sơ chất liệu bền, đẹp"
    },
    {
        id: 8,
        name: "Bảng ghim",
        price: 90000,
        image: "../img/Bangghim.jpg",
        description: "Bảng ghim tiện lợi cho văn phòng"
    },
    {
        id: 9,
        name: "Dập ghim",
        price: 45000,
        image: "../img/Dapghim.jpg",
        description: "Dập ghim bền bỉ, dễ sử dụng"
    },
    {
        id: 10,
        name: "Dao rọc giấy",
        price: 20000,
        image: "../img/Daorocgiay.jpg",
        description: "Dao rọc giấy chất lượng cao"
    },
    {
        id: 11,
        name: "Bút dạ quang",
        price: 18000,
        image: "../img/Butdaquang.webp",
        description: "Bút dạ quang nhiều màu sắc"
    },
    {
        id: 12,
        name: "Gôm tẩy",
        price: 5000,
        image: "../img/GomTay.jpg",
        description: "Gôm tẩy sạch, không để lại vết"
    }
];

// Xuất sản phẩm ra giao diện
function displayProducts(containerId, limit = products.length) {
    const container = document.getElementById(containerId);
    const productsToShow = products.slice(0, limit);

    container.innerHTML = productsToShow.map(product => `
        <div class="col-md-${containerId === 'productList' ? '3 col-lg-3' : '4'}">
            <div class="card mb-4">
                <img src="${product.image}" class="card-img-top" alt="${product.name}" loading="lazy">
                <div class="card-body text-center">
                    <h5 class="card-title mb-2">${product.name}</h5>
                    <p class="card-text small text-muted mb-2">${product.description}</p>
                    <p class="price mb-3 fw-bold">${product.price.toLocaleString()} ₫</p>
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Thêm vào giỏ
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Thêm vào giỏ hàng
function addToCart(productId) {
    try {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let product = products.find(p => p.id === productId);
        
        if (product) {
            let existingProduct = cart.find(item => item.id === productId);
            
            if (existingProduct) {
                existingProduct.quantity = (existingProduct.quantity || 1) + 1;
            } else {
                product = { ...product, quantity: 1 };
                cart.push(product);
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Hiển thị thông báo thành công
            showToast(`Đã thêm ${product.name} vào giỏ hàng!`);
        }
    } catch (error) {
        console.error('Lỗi khi thêm vào giỏ hàng:', error);
        showToast('Có lỗi xảy ra khi thêm vào giỏ hàng', 'danger');
    }
}

// Hiển thị thông báo
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'position-fixed bottom-0 end-0 p-3';
    toast.style.zIndex = '11';
    toast.innerHTML = `
        <div class="toast show bg-${type} text-white" role="alert">
            <div class="toast-header bg-${type} text-white">
                <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle me-2"></i>
                <strong class="me-auto">Thông báo</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">${message}</div>
        </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
