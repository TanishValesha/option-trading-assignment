import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom'; // Still needed for client-side navigation
import { supabase } from '@/lib/supabase'; // <--- IMPORTANT: Ensure this path is correct for your Supabase client
import type { User, Session, AuthError } from '@supabase/supabase-js'; // Import Supabase types
import { toast } from 'sonner';


interface AuthContextType {
    user: User | null;
    session: Session | null;
    login: (email: string, password: string) => Promise<{ user: User | null; session: Session | null; error: AuthError | null }>;
    logout: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Start as true, checking session
    const navigate = useNavigate();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, currentSession) => {
                console.log('Supabase Auth Event:', event, 'Session:', currentSession);
                setSession(currentSession);
                setUser(currentSession?.user || null);
                setIsLoading(false);

                if (event === 'SIGNED_OUT') {
                    navigate('/login');
                }
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        setIsLoading(false);
        if (error) {
            console.error('Login error:', error.message);
            toast.error(error.message);
        }
        return { user: data.user, session: data.session, error };
    };

    const logout = async () => {
        setIsLoading(true);
        const { error } = await supabase.auth.signOut();
        setIsLoading(false);
        if (error) {
            console.error('Logout error:', error.message);
        } else {
            navigate('/login');
        }
    };

    // Render a loading state while checking the initial session
    if (isLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px' }}>Loading user session...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, session, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to easily consume the AuthContext
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};