const API_URL = '/api/auth/';

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 transform ${
        type === 'success' ? 'bg-violet-700 text-white' : 'bg-red-500 text-white'
    }`;
    toast.innerText = message;
    
    const container = document.getElementById('toast-container');
    container.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('opacity-100', 'translate-y-0'), 100);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Button Loader Functions
function showButtonLoader(buttonId) {
    document.getElementById(`${buttonId}-loader`).classList.remove('hidden');
    document.getElementById(buttonId).setAttribute('disabled', 'true');
}

function hideButtonLoader(buttonId) {
    document.getElementById(`${buttonId}-loader`).classList.add('hidden');
    document.getElementById(buttonId).removeAttribute('disabled');
}

async function register() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log('Register payload:', { username: name, email, password });

    showButtonLoader('register-button');
    try {
        const response = await fetch(API_URL + 'register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: name, email, password })
        });

        const data = await response.json();
        console.log('Register response:', data);

        if (response.ok) {
            showToast('Registration successful! Please login.');
            setTimeout(() => {
                window.location.href = '/login/';
            }, 3000);
        } else {
            showToast('Registration failed: ' + JSON.stringify(data), 'error');
        }
    } catch (error) {
        console.error('Register error:', error);
        showToast('Error: ' + error.message, 'error');
    } finally {
        hideButtonLoader('register-button');
    }
}

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log('Login payload:', { email, password });

    showButtonLoader('login-button');
    try {
        const response = await fetch(API_URL + 'login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log('Login response:', data);

        if (response.ok) {
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            showToast('Login successful!');
            setTimeout(() => {
                window.location.href = '/blogs/';
            }, 3000);
        } else {
            showToast(data.error,'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast('Error: ' + error.message, 'error');
    } finally {
        hideButtonLoader('login-button');
    }
}

async function adminLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log('Admin login payload:', { email, password });

    showButtonLoader('admin-login-button');
    try {
        const response = await fetch(API_URL + 'admin-login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log('Admin login response:', data);

        if (response.ok) {
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            showToast('Login successful!');
            setTimeout(() => {
                window.location.href = '/admin-dashboard/';
            }, 3000);
        } else {
            showToast('Admin login failed: ' + JSON.stringify(data), 'error');
        }
    } catch (error) {
        console.error('Admin login error:', error);
        showToast('Error: ' + error.message, 'error');
    } finally {
        hideButtonLoader('admin-login-button');
    }
}

let isLoggingOut = false;

async function logout() {
    if (isLoggingOut) return false;
    isLoggingOut = true;

    const refreshToken = localStorage.getItem('refresh_token');

    // Clear tokens and notify other tabs
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // Trigger a storage event to notify other tabs
    localStorage.setItem('logout-event', Date.now().toString());
    localStorage.removeItem('logout-event');

    if (!refreshToken) {
        showToast('Logged out successfully!', 'success');
        setTimeout(() => {
            window.location.href = '/';
            isLoggingOut = false;
        }, 3000);
        return true;
    }

    try {
        const response = await fetch('/api/auth/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refresh: refreshToken })
        });

        let data = {};
        if (response.status !== 204) {
            data = await response.json();
        }
        console.log('Logout response:', data, 'Status:', response.status);

        if (response.ok || response.status === 204 || (data.message === 'Already logged out')) {
            showToast(data.message || 'Logged out successfully!', 'success');
            setTimeout(() => {
                window.location.href = '/';
                isLoggingOut = false;
            }, 3000);
            return true;
        } else {
            showToast('Logout failed: ' + (data.error || 'Unknown error'), 'error');
            setTimeout(() => {
                window.location.href = '/';
                isLoggingOut = false;
            }, 3000);
            return false;
        }
    } catch (error) {
        console.error('Logout error:', error);
        showToast('Error during logout: ' + error.message + '. You have been logged out.', 'error');
        setTimeout(() => {
            window.location.href = '/';
            isLoggingOut = false;
        }, 3000);
        return false;
    }
}

async function refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return false;

    try {
        const response = await fetch('/api/auth/token/refresh/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('access_token', data.access);
            if (data.refresh) {
                localStorage.setItem('refresh_token', data.refresh);
            }
            const userResponse = await fetch('/api/auth/me/', {
                headers: {
                    'Authorization': `Bearer ${data.access}`
                }
            });
            if (userResponse.ok) {
                const userData = await userResponse.json();
                if (!userData.is_active) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    showToast('Your account is blocked.', 'error');
                    setTimeout(() => {
                        window.location.href = '/login/';
                    }, 3000);
                    return false;
                }
            }
            return true;
        } else {
            console.error('Token refresh failed:', data);
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            showToast('Session expired. Please log in again.', 'error');
            setTimeout(() => {
                window.location.href = '/login/';
            }, 3000);
            return false;
        }
    } catch (error) {
        console.error('Refresh error:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        showToast('Error: ' + error.message, 'error');
        setTimeout(() => {
            window.location.href = '/login/';
        }, 3000);
        return false;
    }
}