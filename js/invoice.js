function loadInvoice() {
    try {
        const orderData = JSON.parse(localStorage.getItem('lastOrder'));
        
        if (!orderData) {
            document.getElementById('noOrderMessage').classList.remove('d-none');
            document.getElementById('invoiceContainer').classList.add('d-none');
            return;
        }

        // Display order information
        document.getElementById('orderId').textContent = `#${orderData.id}`;
        document.getElementById('orderDate').textContent = formatDate(orderData.orderDate);
        document.getElementById('customerName').textContent = orderData.customerName;
        document.getElementById('customerEmail').textContent = orderData.email;
        document.getElementById('customerPhone').textContent = orderData.phone;
        document.getElementById('customerAddress').textContent = orderData.address;
        document.getElementById('paymentMethod').textContent = getPaymentMethodText(orderData.paymentMethod);

        // Display order items
        let total = 0;
        const itemsHtml = orderData.items.map((item, index) => {
            const itemTotal = item.price * (item.quantity || 1);
            total += itemTotal;
            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.name}</td>
                    <td class="text-center">${item.quantity || 1}</td>
                    <td class="text-end">${formatCurrency(item.price)}</td>
                    <td class="text-end">${formatCurrency(itemTotal)}</td>
                </tr>
            `;
        }).join('');

        document.getElementById('orderItems').innerHTML = itemsHtml;
        document.getElementById('totalAmount').textContent = formatCurrency(total);


    } catch (error) {
        console.error('Lỗi khi tải hóa đơn:', error);
        showToast('Có lỗi xảy ra khi tải hóa đơn', 'danger');
    }
}

function getPaymentMethodText(method) {
    const methods = {
        'cod': 'Thanh toán khi nhận hàng (COD)',
        'bank': 'Chuyển khoản ngân hàng',
        'momo': 'Ví điện tử MoMo'
    };
    return methods[method] || method;
}

function printInvoice() {
    window.print();
}

function downloadPDF() {
    // In the future, this can be replaced with actual PDF generation
    window.print();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', loadInvoice);