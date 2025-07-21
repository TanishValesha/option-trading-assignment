// components/auth/LoginPage.tsx
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from "sonner"; // Assuming sonner is installed and Toaster is rendered
import { supabase } from '../../lib/supabase'; // Your frontend supabase client

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:3000/api/user/login', { // YOUR BACKEND URL HERE
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Login error from backend:', data.error || 'Unknown error');
                toast.error(data.error || 'Login Failed'); // Use data.error for specific message
            } else {
                // IMPORTANT: Tell the frontend Supabase client about the new session
                if (data.session) {
                    const { error: setSessionError } = await supabase.auth.setSession(data.session);
                    if (setSessionError) {
                        console.error('Error setting Supabase session on frontend:', setSessionError.message);
                        toast.error('Login successful, but session setup failed.');
                        setLoading(false);
                        return; // Stop here if session setup fails
                    }
                } else {
                    console.warn('Login successful, but no session data received from backend.');
                    toast.warning('Login successful, but session could not be established.');
                    setLoading(false);
                    return; // Stop here if no session data
                }

                toast.success('Login Successful');

                // Redirect to a protected route.
                // Now that supabase.auth.setSession() has been called,
                // supabase.auth.getSession() will correctly return the session.
                window.location.href = '/dashboard';
            }
        } catch (networkError) {
            console.error('Network error during login:', networkError);
            toast.error('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center w-screen justify-center min-h-screen bg-gray-50">
            <Card className="w-full max-w-md border-gray-200 bg-white text-black">
                <CardHeader>
                    <CardTitle className="text-3xl text-center text-black">Login</CardTitle>
                    <CardDescription className="text-center text-gray-600">
                        Enter your credentials to access your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-black">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-white border-gray-300 text-black focus:ring-offset-white focus:border-gray-500"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-black">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-white border-gray-300 text-black focus:ring-offset-white focus:border-gray-500"
                                />
                            </div>
                            <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800" disabled={loading}>
                                {loading ? 'Logging in...' : 'Login'}
                            </Button>
                        </div>
                    </form>
                    <div className="mt-4 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <a href="/signup" className="underline text-black hover:text-gray-800">
                            Sign up
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}