// components/auth/LoginPage.tsx
'use client'; // For Next.js App Router, marks as Client Component

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from "sonner"
// Assuming useToast and Toaster are properly set up if you want toasts
// import { useToast } from '@/components/ui/use-toast';// Adjust path as needed for your project

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    // const { toast } = useToast(); // Initialize toast

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Make the fetch call to your Express backend's login endpoint
            const response = await fetch('http://localhost:3000/api/user/login', { // <--- YOUR BACKEND URL HERE
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }), // Send email and password
            });

            const data = await response.json(); // Parse the JSON response from your backend

            if (!response.ok) { // Check if the HTTP status code indicates an error
                console.error('Login error from backend:', data.error || 'Unknown error');
                toast.error(
                    'Login Failed',
                );
            } else {
                // If response.ok is true, it means your backend returned a 200 status
                toast.success(
                    'Login Successful',
                );

                // Your backend's login route should have set the session cookie.
                // Redirect or update UI state after successful login.
                window.location.href = '/dashboard'; // Example redirect to a protected route
            }
        } catch (networkError) {
            console.error('Network error during login:', networkError);
            toast.error(
                'Login Failed',
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center w-screen justify-center min-h-screen bg-gray-50"> {/* Light background */}
            <Card className="w-full max-w-md border-gray-200 bg-white text-black"> {/* White card, light border, dark text */}
                <CardHeader>
                    <CardTitle className="text-3xl text-center text-black">Login</CardTitle> {/* Dark text */}
                    <CardDescription className="text-center text-gray-600"> {/* Slightly darker gray for description */}
                        Enter your credentials to access your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-black">Email</Label> {/* Dark text */}
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-white border-gray-300 text-black focus:ring-offset-white focus:border-gray-500" // Light input background, light border, dark text
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-black">Password</Label> {/* Dark text */}
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-white border-gray-300 text-black focus:ring-offset-white focus:border-gray-500" // Light input background, light border, dark text
                                />
                            </div>
                            <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800" disabled={loading}>
                                {/* Dark button background, white text */}
                                {loading ? 'Logging in...' : 'Login'}
                            </Button>
                        </div>
                    </form>
                    <div className="mt-4 text-center text-sm text-gray-600"> {/* Dark gray text */}
                        Don't have an account?{' '}
                        <a href="/signup" className="underline text-black hover:text-gray-800"> {/* Dark link text */}
                            Sign up
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}