'use client';

import { useState } from "react";
import { fetchModelsForMake } from "@/hooks/useVehicleAPI";
import Select from 'react-select';
import Link from "next/link";

type Make = { Make_ID: number; Make_Name: string };
type Model = { Make_ID: number; Make_Name: string; Model_ID: number; Model_Name: string };

type Props = {
    serverMakes: Make[];
};

export default function SSRMakeModel({ serverMakes }: Props) {
    const [makes] = useState<Make[]>(serverMakes);
    const [models, setModels] = useState<Model[]>([]);
    const [selectedMake, setSelectedMake] = useState('');
    const [loadingModels, setLoadingModels] = useState(false);
    const [hasFetchedModels, setHasFetchedModels] = useState(false);

    const makeOptions = makes.map((make) => ({
        value: make.Make_Name,
        label: make.Make_Name,
    }));

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">SSR Vehicle Make & Model Finder</h1>
            <div className="w-full bg-gray-50 p-6 rounded shadow-md">
                <div className="mb-2">
                    <label className="block mb-1 font-bold">Select Vehicle Make</label>
                    <Select
                        options={makeOptions}
                        value={makeOptions.find((option) => option.value === selectedMake) || null}
                        onChange={(selectedOption) => {
                            setSelectedMake(selectedOption?.value || '');
                            setModels([]);
                            setHasFetchedModels(false);
                        }}
                        placeholder="Select Make"
                        isClearable
                        className="text-black"
                        isLoading={makes.length === 0}
                    />
                    <div className="flex flex-col sm:flex-row gap-4 mt-4">

                        <button
                            onClick={async () => {
                                if (!selectedMake) return;
                                setHasFetchedModels(true);
                                setLoadingModels(true);
                                const data = await fetchModelsForMake(selectedMake);
                                setModels(data);
                                setLoadingModels(false);
                            }}
                            disabled={!selectedMake}
                            className="bg-blue-500 text-white px-4 py-2 rounded 
                                    enabled:hover:bg-blue-700 
                                    disabled:opacity-50 disabled:cursor-not-allowed"                         >
                            Fetch Models
                        </button>
                        <Link
                            href="/"
                            className="bg-purple-400 text-white px-4 py-2 rounded hover:bg-purple-800 transition text-center"
                        >
                            🔙 Back to Home
                        </Link>
                    </div></div>

                {loadingModels && <p className="text-green-600 mt-4">Loading models...</p>}

                {!loadingModels && hasFetchedModels && selectedMake && models.length === 0 && (
                    <p className="text-red-600 mt-4">No models found for the selected make.</p>
                )}

                {!loadingModels && models.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                        {models.map((model) => (
                            <div key={model.Model_ID} className="p-4 bg-white shadow rounded hover:shadow-lg">
                                <p className="font-medium">{model.Model_Name}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}