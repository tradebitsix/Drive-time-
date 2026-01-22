import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";

function StatusBadge({ status }: { status: "enrolled" | "active" | "completed" }) {
  const v = status === "active" ? "warning" : status === "completed" ? "success" : "neutral";
  return <Badge variant={v as any}>{status}</Badge>;
}

export function DashboardPage() {
  const stats = useQuery({ queryKey: ["stats"], queryFn: api.stats });
  const students = useQuery({ queryKey: ["students"], queryFn: api.students.list });

  const recent = (students.data ?? []).slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-2xl font-semibold">Dashboard</div>
          <div className="text-sm text-[hsl(var(--muted-foreground))]">Live operational snapshot</div>
        </div>
        <div className="text-xs text-[hsl(var(--muted-foreground))]">
          API:{" "}
          <span className="text-[hsl(var(--foreground))]">
            {stats.isLoading ? "…" : stats.isError ? "error" : "connected"}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Total Students</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{stats.data?.total ?? 0}</div>
            <div className="text-sm text-[hsl(var(--muted-foreground))]">All records</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Active</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{stats.data?.active ?? 0}</div>
            <div className="text-sm text-[hsl(var(--muted-foreground))]">In progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Completed</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{stats.data?.completed ?? 0}</div>
            <div className="text-sm text-[hsl(var(--muted-foreground))]">Finished</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent students</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead style={{ width: 90 }}>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead style={{ width: 140 }}>Status</TableHead>
                <TableHead style={{ width: 140 }}>Hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-[hsl(var(--muted-foreground))]">No students yet.</TableCell></TableRow>
              ) : recent.map(s => (
                <TableRow key={s.id}>
                  <TableCell>{s.id}</TableCell>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell><StatusBadge status={s.status} /></TableCell>
                  <TableCell>{s.progress_hours.toFixed(1)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
