import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, clearToken, getToken, type Me } from "../lib/api";

type AuthCtx = {
  token: string;
  me: Me | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTok] = useState(getToken());
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const t = getToken();
    setTok(t);
    if (!t) { setMe(null); setLoading(false); return; }
    try {
      const m = await api.me();
      setMe(m);
    } catch {
      clearToken();
      setMe(null);
      setTok("");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  async function login(username: string, password: string) {
    setLoading(true);
    await api.login(username, password);
    await refresh();
  }

  function logout() {
    clearToken();
    setTok("");
    setMe(null);
  }

  const value = useMemo<AuthCtx>(() => ({ token, me, loading, login, logout, refresh }), [token, me, loading]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
