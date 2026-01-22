import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { api, type Student, type StudentStatus } from "../lib/api";
import { queryClient } from "../lib/query";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";

function statusBadge(status: StudentStatus) {
  const v = status === "active" ? "warning" : status === "completed" ? "success" : "neutral";
  return <Badge variant={v as any}>{status}</Badge>;
}

const studentSchema = z.object({
  name: z.string().min(2).max(120),
  status: z.enum(["enrolled", "active", "completed"]).default("enrolled"),
  progress_hours: z.coerce.number().min(0).default(0),
  notes: z.string().optional().or(z.literal("")),
});
type StudentForm = z.infer<typeof studentSchema>;

function StudentDialog({
  open,
  onOpenChange,
  mode,
  initial,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "edit";
  initial?: Student;
  onSubmit: (values: StudentForm) => Promise<void>;
}) {
  const form = useForm<StudentForm>({
    resolver: zodResolver(studentSchema),
    defaultValues: initial
      ? { name: initial.name, status: initial.status, progress_hours: initial.progress_hours, notes: initial.notes ?? "" }
      : { name: "", status: "enrolled", progress_hours: 0, notes: "" },
    values: initial
      ? { name: initial.name, status: initial.status, progress_hours: initial.progress_hours, notes: initial.notes ?? "" }
      : undefined,
  });

  const [busy, setBusy] = useState(false);

  async function submit(values: StudentForm) {
    setBusy(true);
    try {
      await onSubmit(values);
      onOpenChange(false);
      form.reset();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={v => { if (!busy) onOpenChange(v); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add student" : "Edit student"}</DialogTitle>
          <DialogDescription>Maintain accurate, auditable student records.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={form.handleSubmit(submit)}>
          <div className="space-y-2">
            <Label>Name</Label>
            <Input placeholder="Full legal name" {...form.register("name")} />
            {form.formState.errors.name ? <div className="text-xs text-red-300">{form.formState.errors.name.message}</div> : null}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Status</Label>
              <select
                className="h-10 w-full rounded-[var(--radius)] border border-[hsl(var(--input))] bg-[hsl(var(--card))] px-3 text-sm"
                {...form.register("status")}
              >
                <option value="enrolled">enrolled</option>
                <option value="active">active</option>
                <option value="completed">completed</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Progress hours</Label>
              <Input type="number" step="0.1" {...form.register("progress_hours")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea placeholder="Observations, constraints, compliance notes…" {...form.register("notes")} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>Cancel</Button>
            <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function StudentsPage() {
  const [sorting, setSorting] = useState<SortingState>([{ id: "id", desc: true }]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);

  const students = useQuery({ queryKey: ["students"], queryFn: api.students.list });

  const createMut = useMutation({
    mutationFn: (values: StudentForm) =>
      api.students.create({
        name: values.name,
        status: values.status,
        progress_hours: values.progress_hours,
        notes: values.notes ? values.notes : null,
      }),
    onSuccess: async () => {
      toast.success("Student created.");
      await queryClient.invalidateQueries({ queryKey: ["students"] });
      await queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
    onError: (e: any) => toast.error(e?.message || "Create failed"),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, values }: { id: number; values: StudentForm }) =>
      api.students.update(id, {
        name: values.name,
        status: values.status,
        progress_hours: values.progress_hours,
        notes: values.notes ? values.notes : null,
      }),
    onSuccess: async () => {
      toast.success("Student updated.");
      await queryClient.invalidateQueries({ queryKey: ["students"] });
      await queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
    onError: (e: any) => toast.error(e?.message || "Update failed"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => api.students.delete(id),
    onSuccess: async () => {
      toast.success("Student deleted.");
      await queryClient.invalidateQueries({ queryKey: ["students"] });
      await queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
    onError: (e: any) => toast.error(e?.message || "Delete failed"),
  });

  const columns = useMemo<ColumnDef<Student>[]>(() => [
    { accessorKey: "id", header: "ID", cell: info => <span className="tabular-nums">{String(info.getValue())}</span> },
    { accessorKey: "name", header: "Name", cell: info => <span className="font-medium">{String(info.getValue())}</span> },
    { accessorKey: "status", header: "Status", cell: info => statusBadge(info.getValue() as StudentStatus) },
    { accessorKey: "progress_hours", header: "Hours", cell: info => <span className="tabular-nums">{Number(info.getValue()).toFixed(1)}</span> },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const s = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => { setEditing(s); setEditOpen(true); }}
              aria-label="Edit"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => {
                if (confirm(`Delete student #${s.id} (${s.name})?`)) deleteMut.mutate(s.id);
              }}
              aria-label="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ], [deleteMut]);

  const table = useReactTable({
    data: students.data ?? [],
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-2xl font-semibold">Students</div>
          <div className="text-sm text-[hsl(var(--muted-foreground))]">Roster management</div>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Student records</CardTitle></CardHeader>
        <CardContent>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="text-xs text-[hsl(var(--muted-foreground))]">
              Rows: <span className="text-[hsl(var(--foreground))]">{table.getRowModel().rows.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Prev</Button>
              <div className="text-xs text-[hsl(var(--muted-foreground))]">
                Page <span className="text-[hsl(var(--foreground))]">{table.getState().pagination.pageIndex + 1}</span> /{" "}
                <span className="text-[hsl(var(--foreground))]">{table.getPageCount()}</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(hg => (
                <TableRow key={hg.id}>
                  {hg.headers.map(header => (
                    <TableHead
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className={header.column.getCanSort() ? "cursor-pointer select-none" : ""}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === "asc" ? " ▲" : header.column.getIsSorted() === "desc" ? " ▼" : ""}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {students.isLoading ? (
                <TableRow><TableCell colSpan={columns.length} className="text-[hsl(var(--muted-foreground))]">Loading…</TableCell></TableRow>
              ) : table.getRowModel().rows.length === 0 ? (
                <TableRow><TableCell colSpan={columns.length} className="text-[hsl(var(--muted-foreground))]">No students.</TableCell></TableRow>
              ) : (
                table.getRowModel().rows.map(row => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <StudentDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
        onSubmit={async (values) => { await createMut.mutateAsync(values); }}
      />
      <StudentDialog
        open={editOpen}
        onOpenChange={(v) => { setEditOpen(v); if (!v) setEditing(null); }}
        mode="edit"
        initial={editing ?? undefined}
        onSubmit={async (values) => { if (!editing) return; await updateMut.mutateAsync({ id: editing.id, values }); }}
      />
    </div>
  );
}
