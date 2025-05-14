"use client";

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth'; // Assurez-vous que le chemin est correct
import { apiRegister } from '@/lib/api'; // Assurez-vous que le chemin est correct
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    // const { login } = useAuth(); // Pas besoin de login direct après inscription, l'utilisateur devra se connecter séparément

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }
        setIsLoading(true);
        try {
            const response = await apiRegister({ username, password });
            // La réponse du backend pour l'inscription est { message: 'Utilisateur créé avec succès', user: UserObject }
            setSuccessMessage(response.message || 'Inscription réussie ! Vous pouvez maintenant vous connecter.');
            // Optionnellement, rediriger vers la page de connexion ou afficher un message clair
            setUsername('');
            setPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            if (err.message && err.errors) { // Cas d'erreur de validation du backend
                const errorMessages = Object.values(err.errors).join(' ');
                setError(`Erreur d'inscription: ${err.message}. Détails: ${errorMessages}`);
            } else {
                setError(err.message || 'Échec de l\inscription. Veuillez réessayer.');
            }
            console.error("Register error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Inscription</CardTitle>
                <CardDescription>
                    Créez un nouveau compte pour jouer et enregistrer vos scores.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="grid gap-4">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
                    <div className="grid gap-2">
                        <Label htmlFor="reg-username">Nom d'utilisateur</Label>
                        <Input
                            id="reg-username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="reg-password">Mot de passe</Label>
                        <Input
                            id="reg-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                        <Input
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Inscription en cours...' : 'S\inscrire'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}

