// components/auth/SignupPage.tsx
'use client'; // For Next.js App Router, marks as Client Component

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from "sonner" // Assuming sonner is installed and Toaster is rendered
import { supabase } from '../../lib/supabase'; // Your frontend supabase client
import { baseURL } from '@/lib/baseURL';

export function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(''); // State for the name input

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${baseURL}/user/register`, { // <--- IMPORTANT: Replace with your actual backend URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }) // Send name along with email and password
            });

            const data = await response.json(); // Parse the JSON response from your backend

            if (!response.ok) { // Check if the HTTP status code indicates an error (e.g., 400, 500)
                console.error('Signup error from backend:', data.error || 'Unknown error');
                toast.error(data.error || 'Signup Failed'); // Use data.error for specific message
            } else {
                // IMPORTANT: If the backend returns a session (meaning email confirmation is OFF),
                // tell the frontend Supabase client about it.
                if (data.session && data.sessionStatus === 'active') {
                    const { error: setSessionError } = await supabase.auth.setSession(data.session);
                    if (setSessionError) {
                        console.error('Error setting Supabase session on frontend:', setSessionError.message);
                        toast.error('Signup successful, but session setup failed.');
                        setLoading(false); // Stop loading before returning
                        return; // Exit if session setup fails
                    }
                }

                // Provide user feedback based on the session status returned from the backend
                const message = data.sessionStatus === 'awaiting_email_confirmation'
                    ? 'Signup Successful! Please check your email to confirm your account.'
                    : data.message || 'Signup Successful!'; // Use backend message or default

                toast.success(message);

                // Redirect only if the session is active immediately after signup
                if (data.sessionStatus === 'active') {
                    window.location.href = '/'; // Redirect on immediate login
                } else {
                    // If email confirmation is required, redirect to login or show specific instructions
                    window.location.href = '/login'; // Redirect to login, where they can try after confirming
                }
            }
        } catch (networkError) {
            console.error('Network error during signup:', networkError);
            toast.error('Network error. Please try again.');
        } finally {
            setLoading(false); // Always stop loading, regardless of success or failure
        }
    };

    return (
        <div className="flex items-center w-screen justify-center min-h-screen bg-gray-50"> {/* Light background */}
            <Card className="w-full max-w-md border-gray-200 bg-white text-black"> {/* White card, light border, dark text */}
                <CardHeader>
                    <CardTitle className="text-3xl text-center text-black">Sign Up</CardTitle> {/* Dark text */}
                    <CardDescription className="text-center text-gray-600"> {/* Slightly darker gray for description */}
                        Create a new account to get started.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-black">Name</Label> {/* Dark text */}
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="bg-white border-gray-300 text-black focus:ring-offset-white focus:border-gray-500" // Light input background, light border, dark text
                                />
                            </div>
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
                                {loading ? 'Signing up...' : 'Sign Up'}
                            </Button>
                        </div>
                    </form>
                    <div className="mt-4 text-center text-sm text-gray-600"> {/* Dark gray text */}
                        Already have an account?{' '}
                        <a href="/login" className="underline text-black hover:text-gray-800"> {/* Dark link text */}
                            Login
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}