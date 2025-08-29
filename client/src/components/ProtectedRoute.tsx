// src/components/ProtectedRoute.tsx
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom'; // From react-router-dom for redirection
import { useAuth } from './AuthComponents/AuthContext'; // Our custom hook to get auth state

interface ProtectedRouteProps {
    children: ReactNode; // This will be the actual component (e.g., <Dashboard />)
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user, isLoading } = useAuth(); // Get auth state and loading status

    // 1. Show a loading state while we're checking authentication (e.g., fetching session from Supabase)
    if (isLoading) {
        return <div>Loading authentication...</div>; // You can use a spinner here
    }

    // 2. If loading is complete AND there's no user (i.e., not authenticated)
    if (!user) {
        // Redirect them to the login page
        // 'replace' prop ensures they can't go back to the protected route with the browser's back button
        return <Navigate to="/login" replace />;
    }

    // 3. If loading is complete AND there IS a user (i.e., authenticated)
    // Render the actual protected content (Dashboard, UserActivityHeatmap, etc.)
    return <>{children}</>;
};