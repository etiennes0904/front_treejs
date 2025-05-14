"use client";

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth'; // Assurez-vous que le chemin est correct
import { apiLogin } from '@/lib/api'; // Assurez-vous que le chemin est correct
import { Button } from "@/components/ui/button"; // shadcn/ui button
import { Input } from "@/components/ui/input"; // shadcn/ui input
import { Label } from "@/components/ui/label"; // shadcn/ui label
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // shadcn/ui card
import { Router } from 'lucide-react';

export default function LoginForm({ onClose }: { onClose?: () => void }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const data = await apiLogin({ username, password });
            await login(data.token);

            // Fermer le modal après une connexion réussie
            if (onClose) {
                onClose();
            }
        } catch (err: any) {
            setError(err.message || 'Échec de la connexion. Veuillez vérifier vos identifiants.');
            console.error("Login error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Connexion</CardTitle>
                <CardDescription>
                    Entrez votre nom d'utilisateur et mot de passe pour vous connecter.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="grid gap-4">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="grid gap-2">
                        <Label htmlFor="username">Nom d'utilisateur</Label>
                        <Input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Mot de passe</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}

