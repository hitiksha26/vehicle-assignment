import { fetchAllMakes } from "@/hooks/useVehicleAPI";
import SSRMakeModel from "@/components/SSRMakeModel";

export default async function SSRPage() {
  const makes = await fetchAllMakes();
  return <SSRMakeModel serverMakes={makes} />;
}
