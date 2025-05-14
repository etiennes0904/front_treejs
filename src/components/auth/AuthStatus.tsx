"use client";

import React from 'react';
import { useAuth } from '@/lib/auth';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // shadcn/ui avatar

interface AuthStatusProps {
    onLoginClick: () => void;
    onRegisterClick: () => void;
}

export default function AuthStatus({ onLoginClick, onRegisterClick }: AuthStatusProps) {
    const { user, logout, isLoading } = useAuth();

    if (isLoading) {
        return <div className="text-sm text-gray-500">Chargement...</div>;
    }

    if (user) {
        return (
            <div className="flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                                {/* Placeholder pour une image d'avatar si disponible */} 
                                {/* <AvatarImage src={user.avatarUrl || "/default-avatar.png"} alt={user.username} /> */}
                                <AvatarFallback>{user.username?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user.username}</p>
                                {/* <p className="text-xs leading-none text-muted-foreground">{user.email}</p> */}
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {/* <DropdownMenuItem>Profil</DropdownMenuItem> */}
                        {/* <DropdownMenuItem>Mes Scores</DropdownMenuItem> */}
                        {/* <DropdownMenuSeparator /> */}
                        <DropdownMenuItem onClick={logout}>
                            Déconnexion
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onLoginClick}>Se Connecter</Button>
            <Button onClick={onRegisterClick}>S'inscrire</Button>
        </div>
    );
}

