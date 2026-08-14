"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn } from "@/lib/auth/actions";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signIn, null);

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 py-10">
      <div className="text-center">
        <h1 className="font-display text-3xl tracking-wide text-neutral-50">Ingresar</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Para escribir en el chat del hincha necesitás una cuenta.
        </p>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <TextField id="email" name="email" type="email" label="Email" required autoComplete="email" />
        <TextField
          id="password"
          name="password"
          type="password"
          label="Contraseña"
          required
          autoComplete="current-password"
        />
        {state?.error && <p className="text-sm text-danger">{state.error}</p>}
        <Button type="submit" disabled={pending} className="mt-2">
          {pending ? "Entrando…" : "Ingresar"}
        </Button>
      </form>

      <p className="text-center text-sm text-neutral-400">
        ¿Todavía no tenés cuenta?{" "}
        <Link href="/registro" className="font-medium text-accent-400 hover:text-accent-300">
          Registrate
        </Link>
      </p>
    </div>
  );
}
