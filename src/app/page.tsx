'use client';

import { useEffect, useState } from "react";
import { fetchAllMakes, fetchModelsForMake } from "@/hooks/useVehicleAPI";
import Select from 'react-select';

type Make = { Make_ID: number; Make_Name: string };
type Model = { Make_ID: number; Make_Name: string; Model_ID: number; Model_Name: string }

export default function HomePage() {
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedMake, setSelectedMake] = useState('');
  const [loadingModels, setLoadingModels] = useState(false);

  type OptionType = {
    value: string;
    label: string;
  };

  const makeOptions: OptionType[] = makes.map((make) => ({
    value: make.Make_Name,
    label: make.Make_Name,
  }));

  useEffect(() => {
    const getMakes = async () => {
      const data = await fetchAllMakes();
      setMakes(data);
    };
    getMakes();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Vehicle Assignment</h1>
      <div className="mb-2">

        <label className="block mb-1 font-medium">Select Vehicle Make</label>
        <Select
          options={makeOptions}
          value={makeOptions.find((option) => option.value === selectedMake) || null}
          onChange={(selectedOption) => setSelectedMake(selectedOption?.value || '')}
          placeholder="Select Make"
          isClearable
          className="text-black"
        />

        <button
          onClick={async () => {
            if (!selectedMake) return;
            setLoadingModels(true);
            const data = await fetchModelsForMake(selectedMake);
            setModels(data);
            setLoadingModels(false);
          }}
          disabled={!selectedMake}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Fetch Models
        </button>

      </div>
      {loadingModels && <p className="text-green-600 mt-4">Loading models...</p>}
      {!loadingModels && models.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {models.map((model) => (
            <div key={model.Model_ID} className="p-4 bg-white shadow rounded">
              <p className="font-medium">{model.Model_Name}</p>
            </div>
          ))}
        </div>

      )}
    </main>
  );
}