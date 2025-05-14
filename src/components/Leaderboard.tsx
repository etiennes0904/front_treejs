"use client";

import React, { useEffect, useState } from 'react';
import { apiGetTopScores } from '@/lib/api'; // Assurez-vous que le chemin est correct
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"; // shadcn/ui table
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ScoreEntry {
    id: number;
    user: {
        username: string;
    };
    score: number;
    level: number;
    createdAt: string;
}

export default function Leaderboard() {
    const [topScores, setTopScores] = useState<ScoreEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTopScores = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Appel à l'API pour récupérer les scores
                const data = await apiGetTopScores();
                console.log("Données reçues depuis l'API :", data);

                // Vérifiez si la réponse contient "hydra:member"
                if (data) {
                    setTopScores(data);
                } else {
                    setTopScores([]);
                }
            } catch (err: any) {
                console.error("Erreur lors de la récupération des scores :", err);
                setError(err.message || "Impossible de charger le classement.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTopScores();
    }, []);

    if (isLoading) {
        return <div className="text-center p-4 text-gray-300">Chargement du classement...</div>;
    }

    if (error) {
        return <div className="text-center p-4 text-red-500">Erreur: {error}</div>;
    }

    return (
        <Card className="w-full max-w-4xl mx-auto bg-gray-800 text-white p-6 md:p-8 rounded-lg shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Classement des Meilleurs Joueurs</CardTitle>
                <CardDescription className="text-center text-gray-400">
                    Voici les meilleurs scores de la communauté !
                </CardDescription>
            </CardHeader>
            <CardContent>
                {topScores.length > 0 ? (
                    <Table className="w-full text-gray-300">
                        <TableCaption className="text-gray-400">Classement des meilleurs joueurs</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px] text-center">#</TableHead>
                                <TableHead>Joueur</TableHead>
                                <TableHead className="text-right">Score</TableHead>
                                <TableHead className="text-right">Niveau</TableHead>
                                <TableHead className="text-right">Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {topScores.map((entry, index) => (
                                <TableRow key={entry.id} className="hover:bg-gray-700 transition">
                                    <TableCell className="text-center font-medium">{index + 1}</TableCell>
                                    <TableCell>{entry.user.username}</TableCell>
                                    <TableCell className="text-right">{entry.score}</TableCell>
                                    <TableCell className="text-right">{entry.level}</TableCell>
                                    <TableCell className="text-right">
                                        {new Date(entry.createdAt).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p className="text-center text-gray-400">Aucun score disponible pour le moment.</p>
                )}
            </CardContent>
        </Card>
    );
}