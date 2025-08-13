'use client';
import React from 'react';
import { useState } from "react";
import Select from 'react-select';
import Link from "next/link";
import { useMakes } from "@/hooks/useMakes";
import { useModels } from "@/hooks/useModels";

type OptionType = { value: string; label: string };

export default function HomePage() {
  const [selectedMake, setSelectedMake] = useState('');
  const [hasFetchedModels, setHasFetchedModels] = useState(false);
  const { makes, loading: makesLoading, error: makesError } = useMakes();
  const { models, loading: modelsLoading, error: modelsError } = useModels(
    hasFetchedModels ? selectedMake : ""
  );

  const makeOptions: OptionType[] = makes.map((make) => ({
    value: make.Make_Name,
    label: make.Make_Name,
  }));

  const handleFetchModels = () => {
    if (!selectedMake) return;
    setHasFetchedModels(true);
  };

  return (
    <main className="min-h-screen p-6 bg-white">
      <div className="flex justify-start mb-4">
        <Link
          href="/ssr"
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-700 transition text-center"
        >
          🔁 Try SSR Version
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-6 text-center text-black">Vehicle Make & Model Finder</h1>
      <div className="w-full bg-gray-50 p-6 rounded shadow-md">

        <div className="mb-2">
          {makesError && <p className="text-red-600 mb-2">{makesError}</p>}

          <label className="block mb-1 font-bold text-black">Select Vehicle Make</label>
          <Select
            options={makeOptions}
            value={makeOptions.find((option) => option.value === selectedMake) || null}
            onChange={(selectedOption) => {
              setSelectedMake(selectedOption?.value || '');
              setHasFetchedModels(false);
            }}
            placeholder="Select Make"
            isClearable
            className="text-black"
            isLoading={makesLoading}
          />
          <div className="flex flex-col sm:flex-row gap-4 mt-4">

            <button
              onClick={handleFetchModels}
              disabled={!selectedMake}
              className="bg-blue-500 text-white px-4 py-2 rounded 
             enabled:hover:bg-blue-700 
             disabled:opacity-50 disabled:cursor-not-allowed"            >
              Fetch Models
            </button>

          </div></div>

        {modelsLoading && <p className="text-green-600 mt-4">Loading models...</p>}

        {!modelsLoading && hasFetchedModels && selectedMake && models.length === 0 && (
          <p className="text-red-600 mt-4">{modelsError}</p>
        )}

        {!modelsLoading && models.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {models.map((model) => (
              <div key={model.Model_ID} className="p-4 bg-white shadow rounded hover:shadow-lg">
                <p className="font-medium text-black">{model.Model_Name}</p>
              </div>
            ))}
          </div>

        )}
      </div>
    </main>
  );
}