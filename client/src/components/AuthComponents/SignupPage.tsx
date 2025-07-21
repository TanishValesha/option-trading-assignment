// components/auth/SignupPage.tsx
'use client'; // For Next.js App Router, marks as Client Component

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from "sonner"
// Assuming useToast and Toaster are properly set up if you want toasts
// import { useToast } from '@/components/ui/use-toast';
// import { supabase } from '../../lib/supabase'; // Adjust path as needed for your project

export function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    // const { toast } = useToast(); // Initialize toast

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:3000/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Signup error from backend:', data.error || 'Unknown error');
                toast.error(
                    'Signup Failed'
                );
            } else {
                const message = data.sessionStatus === 'awaiting_email_confirmation'
                    ? 'Signup Successful! Please check your email to confirm your account.'
                    : data.message || 'Signup Successful!';

                toast.success(
                    'Signup Successful'

                );

                // Optionally redirect after successful signup if session is active
                if (data.sessionStatus === 'active') {
                    window.location.href = '/dashboard'; // Redirect on immediate login
                } else {
                    // If email confirmation is enabled, you might redirect to a 'check your email' page
                    // or simply update UI to show a message without redirecting.
                    console.log(message);
                }
            }
        } catch (networkError) {
            console.error('Network error during signup:', networkError);
            toast.error(
                'Signup Failed',
            );
        } finally {
            setLoading(false);
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