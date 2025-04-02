// Toast notifications
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

// Format currency
function formatCurrency(amount) {
    return amount.toLocaleString('vi-VN') + ' ₫';
}

// Format date
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
}

// Check if email is valid
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Check if phone number is valid (Vietnam)
function isValidPhone(phone) {
    const re = /^(0|84|\+84)(3[2-9]|5[689]|7[06-9]|8[1-689]|9[0-46-9])[0-9]{7}$/;
    return re.test(phone);
}

// Generate random order ID
function generateOrderId() {
    return 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5);
}

// Export functions
window.showToast = showToast;
window.formatCurrency = formatCurrency;
window.formatDate = formatDate;
window.isValidEmail = isValidEmail;
window.isValidPhone = isValidPhone;
window.generateOrderId = generateOrderId;