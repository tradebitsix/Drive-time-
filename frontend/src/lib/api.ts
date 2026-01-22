const BASE = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

export type Role = "admin" | "instructor";
export type StudentStatus = "enrolled" | "active" | "completed";

export type Me = { id: number; username: string; role: Role };
export type Student = {
  id: number;
  name: string;
  status: StudentStatus;
  progress_hours: number;
  notes?: string | null;
};

export type DashboardStats = { total: number; active: number; completed: number };

export function getToken() {
  return localStorage.getItem("token") || "";
}
export function setToken(t: string) {
  localStorage.setItem("token", t);
}
export function clearToken() {
  localStorage.removeItem("token");
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, opts?: { method?: string; body?: any; auth?: boolean; headers?: Record<string,string> }): Promise<T> {
  const url = `${BASE}${path.startsWith("/") ? "" : "/"}${path}`;
  const method = opts?.method ?? "GET";
  const auth = opts?.auth ?? true;

  const headers: Record<string, string> = {
    ...(opts?.headers ?? {}),
  };

  if (opts?.body !== undefined && !(opts?.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    headers,
    body: opts?.body === undefined ? undefined : (opts.body instanceof FormData ? opts.body : JSON.stringify(opts.body)),
  });

  const text = await res.text();
  const data = text ? (() => { try { return JSON.parse(text); } catch { return text; } })() : null;

  if (!res.ok) {
    const msg = (data && typeof data === "object" && ("detail" in data)) ? (data as any).detail : `${res.status} ${res.statusText}`;
    if (res.status === 401) clearToken();
    throw new ApiError(String(msg), res.status);
  }

  return data as T;
}

export const api = {
  health: () => request<{status:string}>("/api/health", { auth: false }),
  login: async (username: string, password: string) => {
    // OAuth2PasswordRequestForm => x-www-form-urlencoded
    const form = new URLSearchParams();
    form.set("username", username);
    form.set("password", password);
    const data = await request<{access_token:string; token_type:string}>("/api/auth/login", {
      method: "POST",
      auth: false,
      headers: {"Content-Type":"application/x-www-form-urlencoded"},
      body: form.toString(),
    });
    setToken(data.access_token);
    return data;
  },
  me: () => request<Me>("/api/auth/me"),
  stats: () => request<DashboardStats>("/api/dashboard-stats"),
  students: {
    list: () => request<Student[]>("/api/students/"),
    get: (id: number) => request<Student>(`/api/students/${id}`),
    create: (payload: Omit<Student, "id">) => request<Student>("/api/students/", { method:"POST", body: payload }),
    update: (id: number, payload: Partial<Omit<Student,"id">>) => request<Student>(`/api/students/${id}`, { method:"PUT", body: payload }),
    delete: (id: number) => request<void>(`/api/students/${id}`, { method:"DELETE" }),
  },
};
