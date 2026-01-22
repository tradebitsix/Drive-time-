import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useAuth } from "../auth/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const schema = z.object({
  username: z.string().min(3),
  password: z.string().min(1),
});
type Form = z.infer<typeof schema>;

export function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);

  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { username: "admin", password: "change_me_now" },
  });

  async function onSubmit(values: Form) {
    setBusy(true);
    try {
      await login(values.username, values.password);
      toast.success("Signed in.");
      nav("/", { replace: true });
    } catch (e: any) {
      toast.error(e?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>DriverEdOS staff access</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" autoComplete="username" {...form.register("username")} />
              {form.formState.errors.username ? (
                <div className="text-xs text-red-300">{form.formState.errors.username.message}</div>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" autoComplete="current-password" {...form.register("password")} />
              {form.formState.errors.password ? (
                <div className="text-xs text-red-300">{form.formState.errors.password.message}</div>
              ) : null}
            </div>

            <Button className="w-full" disabled={busy} type="submit">
              {busy ? "Signing in…" : "Sign in"}
            </Button>

            <div className="text-xs text-[hsl(var(--muted-foreground))]">
              Backend URL is configured via <code>VITE_API_URL</code>.
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
