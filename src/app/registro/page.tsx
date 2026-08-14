"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp } from "@/lib/auth/actions";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";

export default function RegistroPage() {
  const [state, formAction, pending] = useActionState(signUp, null);

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 py-10">
      <div className="text-center">
        <h1 className="font-display text-3xl tracking-wide text-neutral-50">Creá tu cuenta</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Con tu usuario vas a poder participar del chat en vivo de cada partido.
        </p>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <TextField
          id="username"
          name="username"
          label="Nombre de usuario"
          placeholder="hincha_del_equipo"
          required
          minLength={3}
          maxLength={20}
          pattern="[a-zA-Z0-9_]+"
          title="Solo letras, números y guión bajo"
          autoComplete="username"
        />
        <TextField id="email" name="email" type="email" label="Email" required autoComplete="email" />
        <TextField
          id="password"
          name="password"
          type="password"
          label="Contraseña"
          required
          minLength={6}
          autoComplete="new-password"
        />
        {state?.error && <p className="text-sm text-danger">{state.error}</p>}
        <Button type="submit" disabled={pending} className="mt-2">
          {pending ? "Creando cuenta…" : "Crear cuenta"}
        </Button>
      </form>

      <p className="text-center text-sm text-neutral-400">
        ¿Ya tenés cuenta?{" "}
        <Link href="/login" className="font-medium text-accent-400 hover:text-accent-300">
          Ingresá
        </Link>
      </p>
    </div>
  );
}
