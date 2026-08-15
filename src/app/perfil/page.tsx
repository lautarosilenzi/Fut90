import { redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { getCurrentUser } from "@/lib/auth/current-user";

export const metadata = { title: "Perfil" };

export default async function PerfilPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <h1 className="font-display text-2xl tracking-wide text-neutral-50">
          Todavía no iniciaste sesión
        </h1>
        <p className="max-w-xs text-sm text-neutral-400">
          Registrate para tuitear, participar del chat del hincha y mucho más.
        </p>
        <Button href="/login">Ingresar</Button>
      </div>
    );
  }

  redirect(`/perfil/${user.username}`);
}
