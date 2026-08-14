import { redirect } from "next/navigation";
import { getCategories } from "@/lib/football-data";

export default async function PartidosIndexPage() {
  const categories = await getCategories();
  redirect(`/partidos/${categories[0].slug}`);
}
