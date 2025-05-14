const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"; // Assurez-vous que cette URL est correcte

interface ApiError {
    message: string;
    errors?: Record<string, string>;
}

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        if (response.status === 401) {
            // Si le token est expiré, on informe l'utilisateur sans tenter de le rafraîchir
            throw new Error("Votre session a expiré. Veuillez vous reconnecter.");
        }

        // Gestion des autres erreurs
        const errorData: ApiError = await response.json().catch(() => ({ message: response.statusText })) as ApiError;
        console.error("API Error:", errorData);
        throw new Error(errorData.message || "Une erreur est survenue lors de l'appel API.");
    }

    if (response.status === 204) { // No content
        return null as T;
    }

    return response.json();
}

export async function apiLogin(credentials: Record<string, string>): Promise<{ token: string }> {
    const response = await fetch(`${API_BASE_URL}/login_check`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    const { token } = await handleResponse<{ token: string }>(response);

    // Stockez le token
    localStorage.setItem("token", token);

    return { token };
}

export async function apiRegister(userData: Record<string, string>): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });
    return handleResponse<any>(response);
}

export async function apiGetProfile(token: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/profile`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    return handleResponse<any>(response);
}

export async function apiGetTopScores(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/scores`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await handleResponse<any>(response);

    // Si la réponse contient un tableau dans une propriété spécifique (ex: "hydra:member")
    const allScores = Array.isArray(data) ? data : data["hydra:member"];

    if (!Array.isArray(allScores)) {
        throw new Error("La réponse de l'API ne contient pas un tableau de scores.");
    }

    // Trier les scores par ordre décroissant et retourner les 10 meilleurs
    return allScores
        .sort((a, b) => b.score - a.score) // Trier par score décroissant
        .slice(0, 10); // Garder les 10 premiers
}

export async function apiGetUserScores(token: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/scores/user`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    return handleResponse<any>(response);
}

export async function apiCreateScore(scoreData: { score: number; level: number; user_id: string }, token: string): Promise<any> {
    // Transformer user_id en "user": "/api/users/<id>"
    const transformedData = {
        ...scoreData,
        user: `/api/users/${scoreData.user_id}`, // Transformer user_id en chemin API
    };

    const response = await fetch(`${API_BASE_URL}/scores`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(transformedData),
    });

    if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Erreur API :", errorDetails);
        throw new Error("Une erreur est survenue lors de l'appel API.");
    }

    return response.json();
}  

export async function apiGetUserProgress(token: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/levels/user/progress`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    return handleResponse<any>(response);
}