const API_URL = '/api/auth/';

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