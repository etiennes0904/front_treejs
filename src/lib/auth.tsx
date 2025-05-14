import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiGetProfile } from './api'; // Assurez-vous que le chemin est correct

interface User {
    id: number;
    username: string;
    roles: string[];
    highestLevel?: number;
    highestScore?: number;
    // Ajoutez d'autres champs si nécessaire selon la réponse de /api/profile
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (newToken: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('jwtToken');
        if (storedToken) {
            setToken(storedToken);
        } else {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (token) {
                try {
                    setIsLoading(true);
                    // Dans le backend Symfony, la route /api/profile renvoie { user: UserObject }
                    const profileData = await apiGetProfile(token);
                    if (profileData && profileData.user) {
                        setUser(profileData.user);
                    } else {
                        // Token invalide ou expiré
                        logout();
                    }
                } catch (error) {
                    console.error('Failed to fetch profile:', error);
                    logout(); // Déconnecte en cas d'erreur (ex: token invalide)
                } finally {
                    setIsLoading(false);
                }
            } else {
                setUser(null);
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, [token]);

    const login = async (newToken: string) => {
        localStorage.setItem('jwtToken', newToken);
        setToken(newToken);
        // Le useEffect ci-dessus s'occupera de fetcher le profil et de setIsLoading
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        setToken(null);
        setUser(null);
        setIsLoading(false);
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

