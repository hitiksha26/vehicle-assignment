import { useState, useEffect } from "react";

type Make = { Make_ID: number; Make_Name: string };

export function useMakes(initialMakes: Make[] = []) {

    const [makes, setMakes] = useState<Make[]>(initialMakes);
    const [loading, setLoading] = useState(initialMakes.length === 0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (makes.length > 0) return;
        async function fetchMakes() {
            try {
                const res = await fetch(
                    "https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json"
                );
                const data = await res.json();
                setMakes(data.Results);
            } catch (err) {
                setError("Failed to load makes");
            } finally {
                setLoading(false);
            }
        }

        fetchMakes();
    }, []);

    return { makes, loading, error };
}