"use client";

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { startGame, stopGame, resizeRendererToDisplaySize, initScene, updateSphereCount } from '@/threejs/scene';
import { useAuth } from '@/lib/auth';
import { apiCreateScore } from '@/lib/api';
import { Button } from "@/components/ui/button";

// Fonction pour jouer un son
function playSound(src: string) {
    const audio = new Audio(src);
    audio.play();
}

interface GameCanvasProps {
    onGameEnd?: (score: number) => void;
}

export default function GameCanvas({ onGameEnd }: GameCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [sphereCount, setSphereCount] = useState(1);
    const [level, setLevel] = useState(1);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const { user, token } = useAuth();

    useEffect(() => {
        if (canvasRef.current && !rendererRef.current && gameStarted && !gameOver) {
            const { renderer } = initScene(canvasRef.current);
            rendererRef.current = renderer;

            startGame(
                canvasRef.current,
                { sphereCount, initialScore: score },
                handleScoreUpdate,
                handleLivesUpdate,
                handleGameOver
            );
        }

        const handleResize = () => {
            if (rendererRef.current) {
                resizeRendererToDisplaySize(rendererRef.current);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
                event.preventDefault();
            }
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            stopGame();
            if (rendererRef.current) {
                rendererRef.current.dispose();
                rendererRef.current = null;
            }
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [gameStarted, gameOver]);

    const handleScoreUpdate = (newScore: number) => {
        setScore(newScore);

        // Jouer un son lorsque le score augmente
        playSound('../sounds/sound.mp3');

        // Mise à jour progressive de la difficulté
        if (newScore >= 5 && newScore < 10 && sphereCount < 2) {
            setSphereCount(2);
            setLevel(2);
            updateSphereCount(2);
        } else if (newScore >= 10 && newScore < 20 && sphereCount < 3) {
            setSphereCount(3);
            setLevel(3);
            updateSphereCount(3);
        } else if (newScore >= 20 && sphereCount < 4) {
            setSphereCount(4);
            setLevel(4);
            updateSphereCount(4);
        }
    };

    const handleLivesUpdate = (newLives: number) => {
        setLives(newLives);
    };

    const handleGameOver = async (finalScore: number) => {
        setGameOver(true);
        stopGame();
        if (onGameEnd) {
            onGameEnd(finalScore);
        }
        if (token && user) {
            console.log("Envoi du score à l'API...", { score: finalScore, level, user_id: user.id, token });
            try {
                await apiCreateScore({ score: finalScore, level, user_id: user.id }, token);
                console.log("Score final enregistré avec succès :", finalScore);
            } catch (error: any) {
                if (error.message === "Votre session a expiré. Veuillez vous reconnecter.") {
                    console.error("Session expirée. Redirection vers la page de connexion.");
                    window.location.href = "/login_check";
                } else {
                    console.error("Échec de l'enregistrement du score :", error);
                }
            }
        } else {
            console.warn("Utilisateur non authentifié. Impossible d'enregistrer le score.");
        }
    };

    const handleStartGame = () => {
        setScore(0);
        setLives(3);
        setSphereCount(1);
        setLevel(1);
        setGameOver(false);
        setGameStarted(true);
    };

    const handleRestartGame = () => {
        setScore(0);
        setLives(3);
        setSphereCount(1);
        setLevel(1);
        setGameOver(false);
        setGameStarted(true);
    };

    if (gameOver) {
        return (
            <div className="flex flex-col items-center justify-center h-screen p-8 text-center">
                <h2 className="text-4xl font-bold mb-4">Game Over !</h2>
                <p className="text-2xl mb-2">Votre score: {score}</p>
                <p className="text-xl mb-6">Niveau atteint : {level}</p>
                <Button onClick={handleRestartGame} className="mb-4">Rejouer</Button>
            </div>
        );
    }

    if (!gameStarted) {
        return (
            <div className="flex flex-col items-center justify-center h-screen p-8 text-center">
                <h2 className="text-3xl font-bold mb-4">Prêt à jouer ?</h2>
                <p className="mb-2">Attrape le plus de sphères possible !</p>
                <p className="mb-6">La difficulté augmente selon ton nombre de point !</p>
                <Button onClick={handleStartGame} size="lg">
                    Start Game
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full h-screen relative flex flex-col items-center">
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded-lg">
                <p className="text-lg">Score : {score}</p>
                <p className="text-lg">Vies : {lives}</p>
                <p className="text-lg">Niveau : {level}</p>
                <p className="text-lg">Nombre de sphères par spawn : {sphereCount}</p>
            </div>
            <canvas ref={canvasRef} className="w-[800px] h-[600px] border border-gray-300" />
        </div>
    );
}