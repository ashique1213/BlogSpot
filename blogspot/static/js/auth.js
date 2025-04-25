const API_URL = '/api/auth/';

async function register() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log('Register payload:', { username: name, email, password });

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
            alert('Registration successful! Please login.');
            window.location.href = '/login/';
        } else {
            alert('Registration failed: ' + JSON.stringify(data));
        }
    } catch (error) {
        console.error('Register error:', error);
        alert('Error: ' + error.message);
    }
}

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log('Login payload:', { email, password });

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
            alert('login successfull');
            window.location.href = '/blogs/';
        } else {
            alert('Login failed: ' + JSON.stringify(data));
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Error: ' + error.message);
    }
}

async function adminLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log('Admin login payload:', { email, password });

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
            alert('login successfull');
            window.location.href = '/admin-dashboard/';
        } else {
            alert('Admin login failed: ' + JSON.stringify(data));
        }
    } catch (error) {
        console.error('Admin login error:', error);
        alert('Error: ' + error.message);
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
        alert('Logged out successfully!');
        window.location.href = '/';
        isLoggingOut = false;
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
            alert(data.message || 'Logged out successfully!');
            window.location.href = '/';
            isLoggingOut = false;
            return true;
        } else {
            alert('Logout failed: ' + (data.error || 'Unknown error'));
            window.location.href = '/';
            isLoggingOut = false;
            return false;
        }
    } catch (error) {
        console.error('Logout error:', error);
        alert('Error during logout: ' + error.message + '. You have been logged out.');
        window.location.href = '/';
        isLoggingOut = false;
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
                    alert('Your account is blocked.');
                    window.location.href = '/login/';
                    return false;
                }
            }
            return true;
        } else {
            console.error('Token refresh failed:', data);
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login/';
            return false;
        }
    } catch (error) {
        console.error('Refresh error:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login/';
        return false;
    }
}


