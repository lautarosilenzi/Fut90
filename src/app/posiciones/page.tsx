import { redirect } from "next/navigation";
import { getCategories } from "@/lib/football-data";

export default async function PosicionesIndexPage() {
  const categories = await getCategories();
  redirect(`/posiciones/${categories[0].slug}`);
}
