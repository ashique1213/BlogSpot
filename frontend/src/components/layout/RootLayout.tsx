import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { PenSquare } from 'lucide-react';
import { api } from '@/lib/axios';
import toast, { Toaster } from 'react-hot-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Footer } from './Footer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
              <Link to="/write">
                <Button variant="ghost" size="sm" className="text-muted-foreground gap-2 mr-2">
                  <PenSquare className="h-4 w-4" />
                  Write
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="relative h-8 w-8 rounded-full border border-border/50 outline-none focus-visible:ring-2 focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center overflow-hidden">
                  <Avatar className="h-full w-full">
                    <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.username}`} alt={user.username} />
                    <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.username}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <Link to={`/profile/${user.username}`}>
                    <DropdownMenuItem className="cursor-pointer">
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/dashboard">
                    <DropdownMenuItem className="cursor-pointer">
                      Dashboard
                    </DropdownMenuItem>
                  </Link>
                  {user.is_staff && (
                    <Link to="/admin">
                      <DropdownMenuItem className="cursor-pointer">
                        Admin Settings
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
    <div className="min-h-screen flex flex-col bg-background font-sans antialiased selection:bg-primary selection:text-primary-foreground relative z-0">
      {/* Decorative Background Watermark */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none select-none z-0 flex items-center justify-center opacity-5 dark:opacity-10">
        <div className="absolute w-[150vw] h-[150vh] -rotate-12 flex flex-wrap gap-x-8 gap-y-4 justify-center items-center content-center">
          {Array.from({ length: 200 }).map((_, i) => (
            <span key={i} className="text-4xl md:text-6xl font-black tracking-[0.2em] text-foreground/50 whitespace-nowrap">
              BLOGSPOT
            </span>
          ))}
        </div>
      </div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
          <Outlet />
        </main>
        <Footer />
      </div>
      <Toaster position="bottom-center" />
    </div>
  );
}
