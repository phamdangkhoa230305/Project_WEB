function loadCart() {
    try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartTable = document.getElementById('cartItems');
        const emptyCart = document.getElementById('emptyCart');
        const tableContainer = document.querySelector('.table-responsive');
        const totalPriceContainer = document.querySelector('.text-end');
        let total = 0;
        
        if (cart.length === 0) {
            emptyCart.classList.remove('d-none');
            tableContainer.classList.add('d-none');
            totalPriceContainer.classList.add('d-none');
            return;
        }

        emptyCart.classList.add('d-none');
        tableContainer.classList.remove('d-none');
        totalPriceContainer.classList.remove('d-none');
        cartTable.innerHTML = '';

        cart.forEach((item, index) => {
            // Ensure quantity is initialized
            if (!item.quantity) {
                item.quantity = 1;
            }
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            const row = `
                <tr>
                    <td><img src="${item.image}" alt="${item.name}" class="cart-item-image" loading="lazy"></td>
                    <td>${item.name}</td>
                    <td class="price">${item.price.toLocaleString()} ₫</td>
                    <td>
                        <div class="input-group input-group-sm quantity-control">
                            <button class="btn btn-outline-primary px-2" onclick="updateQuantity(${index}, ${item.quantity - 1})">
                                <i class="fas fa-minus fa-xs"></i>
                            </button>
                            <input type='number' class='form-control text-center px-0' value='${item.quantity}' min='1'
                                onchange='updateQuantity(${index}, this.value)'>
                            <button class="btn btn-outline-primary" onclick="updateQuantity(${index}, ${item.quantity + 1})">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </td>
                    <td class="price">${itemTotal.toLocaleString()} ₫</td>
                    <td><button class='btn btn-danger' onclick='removeFromCart(${index})'><i class="fas fa-trash"></i></button></td>
                </tr>
            `;
            cartTable.innerHTML += row;
        });

        document.getElementById('totalAmount').innerText = total.toLocaleString() + ' ₫';
        document.getElementById('checkoutBtn').disabled = false;
    } catch (error) {
        console.error('Lỗi khi tải giỏ hàng:', error);
        showToast('Có lỗi xảy ra khi tải giỏ hàng', 'danger');
    }
}

function updateQuantity(index, quantity) {
    try {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Validate index
        if (index < 0 || index >= cart.length) {
            showToast('Sản phẩm không tồn tại trong giỏ hàng', 'danger');
            return;
        }

        // Parse and validate quantity
        quantity = parseInt(quantity);
        if (isNaN(quantity) || quantity < 1) {
            showToast('Số lượng không hợp lệ', 'danger');
            loadCart();
            return;
        }

        // Update quantity and save
        cart[index].quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update display
        loadCart();
        showToast(`Đã cập nhật số lượng ${cart[index].name}`, 'success');
    } catch (error) {
        console.error('Lỗi khi cập nhật số lượng:', error);
        showToast('Có lỗi xảy ra khi cập nhật số lượng', 'danger');
    }
}

function removeFromCart(index) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
        try {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            loadCart();
            showToast('Đã xóa sản phẩm khỏi giỏ hàng', 'success');
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error);
            showToast('Có lỗi xảy ra khi xóa sản phẩm', 'danger');
        }
    }
}

function checkout() {
    try {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length > 0) {
            window.location.href = 'checkout.html';
        } else {
            showToast('Giỏ hàng trống!', 'warning');
        }
    } catch (error) {
        console.error('Lỗi khi thanh toán:', error);
        showToast('Có lỗi xảy ra khi chuyển đến trang thanh toán', 'danger');
    }
}

// Initialize cart when page loads
document.addEventListener('DOMContentLoaded', loadCart);