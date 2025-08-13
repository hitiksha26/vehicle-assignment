import SSRMakeModel from "@/components/SSRMakeModel";

export default async function SSRPage() {
  const res = await fetch(
    "https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json",
    { next: { revalidate: 3600 } }
  );
  const data = await res.json();
  return <SSRMakeModel serverMakes={data.Results || []} />;
}

