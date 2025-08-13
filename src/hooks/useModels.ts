import { useState, useEffect } from "react";

type Model = { Make_ID: number; Make_Name: string; Model_ID: number; Model_Name: string };

export function useModels(makeName: string) {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!makeName) {
      setModels([]);
      return;
    }

    async function fetchModels() {
      setLoading(true);
      try {
        const encodedMakeName = encodeURIComponent(makeName);
        const res = await fetch(
          `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${encodedMakeName}?format=json`
        );
        const data = await res.json();
        setModels(data.Results);
      } catch (err) {
        setError("No models found for the selected make.");
      } finally {
        setLoading(false);
      }
    }

    fetchModels();
  }, [makeName]);

  return { models, loading, error };
}