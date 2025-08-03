export async function fetchAllMakes() {
    try {
        const res = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json');
        const data = await res.json();
        return data.Results;
    } catch (error) {
        console.log(error);
        return [];
    }
}

export async function fetchModelsForMake(makeName: string) {
    try {
        const encodedMakeName = encodeURIComponent(makeName);
        const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${encodedMakeName}?format=json`);
        const data = await res.json();
        return data.Results;
    } catch (error) {
        console.log(error);
        return [];
    }
}