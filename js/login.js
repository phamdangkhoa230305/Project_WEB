// LocalStorage keys
const STORAGE_KEYS = {
    USERS: 'vpp_users',         // Danh sách tài khoản
    CURRENT_USER: 'vpp_current', // User đang đăng nhập
    REMEMBER_USER: 'vpp_remember' // Ghi nhớ đăng nhập
};

// Password visibility toggle
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
        button.setAttribute('title', 'Ẩn mật khẩu');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
        button.setAttribute('title', 'Hiện mật khẩu');
    }
}

// Password strength checker
function checkPasswordStrength(password) {
    const strengthBar = document.querySelector('.password-strength');
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const length = password.length;

    if (length < 8) {
        strengthBar.className = 'password-strength strength-weak';
        return 'weak';
    } else if (hasLetter && hasNumber && hasSpecial && length >= 12) {
        strengthBar.className = 'password-strength strength-strong';
        return 'strong';
    } else {
        strengthBar.className = 'password-strength strength-medium';
        return 'medium';
    }
}

// Lấy danh sách users từ localStorage
function getUsers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '{}');
}

// Lưu danh sách users vào localStorage
function saveUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

// Kiểm tra đăng nhập
async function login(username, password, rememberMe = false) {
    const users = getUsers();
    const user = users[username];

    if (user && user.password === password) {
        // Lưu thông tin user hiện tại
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({
            username,
            loginTime: new Date().toISOString()
        }));

        // Lưu remember me nếu được chọn
        if (rememberMe) {
            localStorage.setItem(STORAGE_KEYS.REMEMBER_USER, username);
        } else {
            localStorage.removeItem(STORAGE_KEYS.REMEMBER_USER);
        }

        return true;
    }
    return false;
}

// Đăng ký tài khoản mới
async function register(username, password) {
    const users = getUsers();
    
    if (users[username]) {
        throw new Error('Tài khoản đã tồn tại!');
    }

    users[username] = {
        password,
        createdAt: new Date().toISOString()
    };

    saveUsers(users);
    return true;
}

// Form toggle handler
document.getElementById('toggleForm').addEventListener('click', function(event) {
    event.preventDefault();
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const formTitle = document.getElementById('formTitle');
    const toggleText = document.getElementById('toggleForm');

    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        formTitle.textContent = 'Đăng nhập';
        toggleText.textContent = 'Chưa có tài khoản? Đăng ký ngay';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        formTitle.textContent = 'Đăng ký';
        toggleText.textContent = 'Đã có tài khoản? Đăng nhập';
    }
});

// Login form handler
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    if (!this.checkValidity()) {
        event.stopPropagation();
        this.classList.add('was-validated');
        return;
    }

    try {
        const loginBtn = document.getElementById('loginButton') || this.querySelector('button[type="submit"]');
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe')?.checked || false;

        loginBtn.disabled = true;

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        if (await login(username, password, rememberMe)) {
            showToast('Đăng nhập thành công!');
            setTimeout(() => window.location.href = 'shop.html', 1000);
        } else {
            throw new Error('Sai tên đăng nhập hoặc mật khẩu!');
        }
    } catch (error) {
        showToast(error.message, 'danger');
    } finally {
        const loginBtn = document.getElementById('loginButton') || this.querySelector('button[type="submit"]');
        loginBtn.disabled = false;
    }
});

// Register form handler
document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    if (!this.checkValidity()) {
        event.stopPropagation();
        this.classList.add('was-validated');
        return;
    }

    try {
        const registerBtn = document.getElementById('registerButton') || this.querySelector('button[type="submit"]');
        registerBtn.disabled = true;

        const username = document.getElementById('newUsername').value.trim();
        const password = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            throw new Error('Mật khẩu xác nhận không khớp!');
        }

        if (checkPasswordStrength(password) === 'weak') {
            throw new Error('Mật khẩu quá yếu! Vui lòng chọn mật khẩu mạnh hơn.');
        }

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        await register(username, password);
        showToast('Đăng ký thành công! Vui lòng đăng nhập.');
        
        // Chuyển về form đăng nhập và điền sẵn username
        setTimeout(() => {
            document.getElementById('toggleForm').click();
            document.getElementById('username').value = username;
        }, 1000);

    } catch (error) {
        showToast(error.message, 'danger');
    } finally {
        const registerBtn = document.getElementById('registerButton') || this.querySelector('button[type="submit"]');
        registerBtn.disabled = false;
    }
});

// Check for remembered user
document.addEventListener('DOMContentLoaded', function() {
    const rememberedUser = localStorage.getItem(STORAGE_KEYS.REMEMBER_USER);
    if (rememberedUser) {
        document.getElementById('username').value = rememberedUser;
        const rememberMeCheckbox = document.getElementById('rememberMe');
        if (rememberMeCheckbox) {
            rememberMeCheckbox.checked = true;
        }
    }
});