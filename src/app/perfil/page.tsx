import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { getCurrentUser } from "@/lib/auth/current-user";
import { signOut } from "@/lib/auth/actions";

export const metadata = { title: "Perfil" };

// El perfil completo (bio, posteos, seguidores) es de la v2. Por ahora
// esto solo confirma que el login funciona y deja cerrar sesión.
export default async function PerfilPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <h1 className="font-display text-2xl tracking-wide text-neutral-50">
          Todavía no iniciaste sesión
        </h1>
        <p className="max-w-xs text-sm text-neutral-400">
          Registrate para participar del chat del hincha en los partidos en vivo.
        </p>
        <Button href="/login">Ingresar</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <Avatar name={user.username} />
      <div>
        <h1 className="font-display text-2xl tracking-wide text-neutral-50">
          @{user.username}
        </h1>
        <p className="text-sm text-neutral-400">
          Los perfiles con posteos, seguidores y likes llegan en la próxima etapa.
        </p>
      </div>
      <form action={signOut}>
        <Button type="submit" variant="ghost">
          Cerrar sesión
        </Button>
      </form>
    </div>
  );
}
