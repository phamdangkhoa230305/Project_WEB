// Display order summary
function displayOrderSummary() {
    try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const orderSummary = document.getElementById('orderSummary');
        const totalAmount = document.getElementById('totalAmount');
        let total = 0;

        if (cart.length === 0) {
            window.location.href = 'cart.html';
            return;
        }

        orderSummary.innerHTML = cart.map(item => {
            const itemTotal = item.price * (item.quantity || 1);
            total += itemTotal;
            return `
                <div class="d-flex justify-content-between mb-2">
                    <div>
                        <h6 class="my-0">${item.name}</h6>
                        <small class="text-muted">Số lượng: ${item.quantity || 1}</small>
                    </div>
                    <span>${formatCurrency(itemTotal)}</span>
                </div>
            `;
        }).join('');

        totalAmount.textContent = formatCurrency(total);
    } catch (error) {
        console.error('Lỗi khi hiển thị đơn hàng:', error);
        showToast('Có lỗi xảy ra. Vui lòng thử lại.', 'danger');
    }
}

// Handle form submission
document.getElementById('checkoutForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    if (!this.checkValidity()) {
        event.stopPropagation();
        this.classList.add('was-validated');
        return;
    }

    try {
        const submitBtn = document.getElementById('submitBtn');
        const submitText = document.getElementById('submitText');
        const submitSpinner = document.getElementById('submitSpinner');

        // Show loading state
        submitBtn.disabled = true;
        submitText.classList.add('d-none');
        submitSpinner.classList.remove('d-none');

        // Validate form
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;

        if (!isValidEmail(email)) {
            throw new Error('Email không hợp lệ');
        }

        if (!isValidPhone(phone)) {
            throw new Error('Số điện thoại không hợp lệ');
        }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Save order info
        const orderInfo = {
            id: generateOrderId(),
            customerName: document.getElementById('fullName').value,
            phone: phone,
            email: email,
            address: document.getElementById('address').value,
            paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value,
            items: JSON.parse(localStorage.getItem('cart')),
            orderDate: new Date().toISOString(),
            status: 'pending'
        };

        localStorage.setItem('lastOrder', JSON.stringify(orderInfo));
        localStorage.removeItem('cart');

        // Show success message
        showToast('Đặt hàng thành công! Đang chuyển đến trang hóa đơn...', 'success');

        // Redirect to invoice page
        setTimeout(() => {
            window.location.href = 'invoice.html';
        }, 2000);

    } catch (error) {
        console.error('Lỗi khi xử lý đơn hàng:', error);
        showToast(error.message || 'Có lỗi xảy ra khi xử lý đơn hàng', 'danger');
        
        // Reset button state
        const submitBtn = document.getElementById('submitBtn');
        const submitText = document.getElementById('submitText');
        const submitSpinner = document.getElementById('submitSpinner');
        submitBtn.disabled = false;
        submitText.classList.remove('d-none');
        submitSpinner.classList.add('d-none');
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', displayOrderSummary);