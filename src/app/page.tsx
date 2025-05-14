"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import AuthStatus from "@/components/auth/AuthStatus";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import Leaderboard from "@/components/Leaderboard";
import { useAuth } from '@/lib/auth';
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";

export default function HomePage() {
    const { user } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 md:p-8">
            <header className="w-full max-w-6xl mx-auto flex justify-between items-center py-6 px-4 bg-gray-800 rounded-lg shadow-lg mb-8">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    Tree.js Sphere Catcher
                </h1>
                <AuthStatus 
                    onLoginClick={() => setShowLoginModal(true)} 
                    onRegisterClick={() => setShowRegisterModal(true)} 
                />
            </header>

            <main className="w-full max-w-6xl mx-auto flex-grow">
                <section className="text-center bg-gray-800 p-8 md:p-12 rounded-lg shadow-lg mb-12">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                        Attrapez-les Toutes !
                    </h2>
                    <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-gray-300">
                        Plongez dans un univers 3D vibrant où des sphères colorées tombent du ciel. Testez votre agilité et vos réflexes pour attraper un maximum de sphères avec votre panier agile. Grimpez dans le classement et devenez le Maître des Sphères !
                    </p>
                    <Link href="/game" passHref>
                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out">
                            Jouer Maintenant !
                        </Button>
                    </Link>
                </section>

                <section className="mb-12">
                    <Leaderboard />
                </section>

                <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
                    <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white rounded-lg shadow-lg">
                        <LoginForm onClose={() => setShowLoginModal(false)} />
                        <div className="mt-4 text-center text-sm">
                            Pas encore de compte?{" "}
                            <Button
                                variant="link"
                                onClick={() => {
                                    setShowLoginModal(false);
                                    setShowRegisterModal(true);
                                }}
                                className="p-0 h-auto text-blue-400 hover:underline"
                            >
                                S'inscrire
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog open={showRegisterModal} onOpenChange={setShowRegisterModal}>
                    <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white rounded-lg shadow-lg">
                        <RegisterForm />
                        <div className="mt-4 text-center text-sm">
                            Déjà un compte?{" "}
                            <Button variant="link" onClick={() => { setShowRegisterModal(false); setShowLoginModal(true); }} className="p-0 h-auto text-blue-400 hover:underline">
                                Se connecter
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </main>

            <footer className="w-full max-w-6xl mx-auto text-center py-6 mt-8 border-t border-gray-700">
                <p className="text-gray-400">&copy; {new Date().getFullYear()} Tree.js Sphere Catcher. Etienne Sautivet TP E S6 MMI.</p>
            </footer>
        </div>
    );
}