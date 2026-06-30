import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { PenSquare, LogOut, User } from 'lucide-react';
import { api } from '@/lib/axios';
import toast, { Toaster } from 'react-hot-toast';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const refresh = localStorage.getItem('refreshToken');
      if (refresh) {
        await api.post('/api/auth/logout/', { refresh });
      }
    } catch (error) {
      console.error(error);
    } finally {
      logout();
      toast.success('Logged out successfully');
      navigate('/');
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-6xl items-center justify-between mx-auto px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl tracking-tight">BlogSpot.</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              {user.is_staff && (
                <Link to="/admin">
                  <Button variant="ghost" size="sm">Admin</Button>
                </Link>
              )}
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <Link to="/write">
                <Button variant="ghost" size="sm" className="text-muted-foreground gap-2">
                  <PenSquare className="h-4 w-4" />
                  Write
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="rounded-full">Get started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans antialiased selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Toaster position="bottom-center" />
    </div>
  );
}
