"use client";

import React from 'react';
import GameCanvas from "@/components/game/GameCanvas";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/lib/auth';

export default function GamePage() {
    const { user, isLoading } = useAuth();

    const handleGameEnd = (score: number, levelAchieved: number) => {
        console.log(`Partie terminée! Score: ${score}, Niveau: ${levelAchieved}`);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
                <p className="text-xl">Chargement de la session...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 text-center">
                <h2 className="text-3xl font-bold mb-6">Accès Restreint</h2>
                <p className="text-lg mb-8">Vous devez être connecté pour accéder à la page de jeu.</p>
                <Link href="/" passHref>
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out">
                        Retour à l'accueil
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
            <header className="w-full max-w-6xl mx-auto flex justify-between items-center py-6 px-4 mb-8">
                <Link href="/" passHref>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight cursor-pointer hover:text-yellow-400 transition-colors">
                        Tree.js Sphere Catcher
                    </h1>
                </Link>
                <Link href="/" passHref>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out">
                        Retour à l'accueil
                    </Button>
                </Link>
            </header>
            <main className="w-full max-w-4xl mx-auto flex-grow flex flex-col items-center justify-center">
                <GameCanvas onGameEnd={handleGameEnd} />
            </main>
            <footer className="w-full max-w-6xl mx-auto text-center py-6 mt-8 border-t border-gray-700">
                <p>&copy; {new Date().getFullYear()} Tree.js Sphere Catcher.</p>
            </footer>
        </div>
    );
}