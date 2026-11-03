"use client";
import { useState } from "react";
import { Archive, Check, Copy, Download, Inbox, MailOpen, PhoneCall, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { deleteMessage, deleteSubscriber, messageStatuses, updateMessage, useDb, useHydrated } from "@/lib/data/store";
import { downloadCsv } from "@/lib/csv";
import type { MessageStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./status-badge";
import { inView, useBranchView } from "./branch-view";
import { BranchBadge, ContactActions, Empty, PageHeader, SearchBox, StatusTabs, ago, whenTime } from "./ui";

export function MessagesAdmin() {
  const { messages, subscribers } = useDb();
  const hydrated = useHydrated();
  const { view } = useBranchView();
  const [filter, setFilter] = useState<MessageStatus | "all">("new");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const scoped = messages.filter((m) => inView(view, m));
  const counts = Object.fromEntries(messageStatuses.map((s) => [s, scoped.filter((m) => m.status === s).length]));
  const rows = scoped.filter((m) => (filter === "all" || m.status === filter) && (!q || `${m.name} ${m.subject} ${m.message} ${m.email}`.toLowerCase().includes(q.toLowerCase())));

  return (
    <div>
      <PageHeader title="Messages" sub="Contact form messages and newsletter sign-ups from the website." />
      <Tabs defaultValue="inbox">
        <TabsList className="mb-4">
          <TabsTrigger value="inbox"><Inbox /> Inbox{counts.new ? ` (${counts.new})` : ""}</TabsTrigger>
          <TabsTrigger value="subscribers"><Users /> Subscribers ({subscribers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="inbox">
          <div className="mb-4 space-y-3">
            <StatusTabs options={messageStatuses} value={filter} onChange={setFilter} counts={counts} />
            <SearchBox value={q} onChange={setQ} placeholder="Search messages…" />
          </div>
          {hydrated && !rows.length ? <Empty icon={MailOpen} title={filter === "new" ? "Inbox zero" : "No messages here"} sub="Messages from the contact page arrive here." /> : (
            <ul className="space-y-2">
              {rows.map((m) => {
                const expanded = open === m.id;
                return (
                  <li key={m.id} className={cn("rounded-2xl border bg-card transition", expanded && "border-primary", m.status === "new" && "border-l-4 border-l-primary")}>
                    <button type="button" onClick={() => { setOpen(expanded ? null : m.id); }} aria-expanded={expanded} className="flex w-full items-start gap-3 p-4 text-left">
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary font-bold text-secondary-foreground">{m.name.slice(0, 1)}</span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-x-2 gap-y-1"><span className={cn("font-semibold", m.status === "new" && "text-brand")}>{m.name}</span><BranchBadge branch={m.branch} />{m.subject.startsWith("Call back") && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[0.7rem] font-bold text-emerald-700 dark:text-emerald-300"><PhoneCall className="size-3" /> Call back</span>}</span>
                        <span className="mt-0.5 block truncate text-sm font-medium">{m.subject}</span>
                        <span className={cn("block text-sm text-muted-foreground", !expanded && "truncate")}>{m.message}</span>
                      </span>
                      <span className="flex shrink-0 flex-col items-end gap-1.5"><span className="text-xs text-muted-foreground">{ago(m.createdAt)}</span><StatusBadge status={m.status} /></span>
                    </button>
                    {expanded && (
                      <div className="space-y-4 border-t px-4 py-4">
                        <p className="text-xs text-muted-foreground">{whenTime(m.createdAt)} · {m.email || "no email"} · {m.phone || "no phone"}</p>
                        <ContactActions name={m.name} phone={m.phone || "0"} email={m.email} message={`thanks for your message about "${m.subject}".`} />
                        <div className="flex flex-wrap gap-2">
                          {m.status !== "replied" && <Button size="sm" variant="outline" onClick={() => { updateMessage(m.id, "replied"); toast.success("Marked as replied"); }}><Check /> Mark replied</Button>}
                          {m.status !== "archived" && <Button size="sm" variant="outline" onClick={() => { updateMessage(m.id, "archived"); setOpen(null); toast.success("Archived"); }}><Archive /> Archive</Button>}
                          {m.status !== "new" && <Button size="sm" variant="ghost" onClick={() => updateMessage(m.id, "new")}>Mark unread</Button>}
                          <Button size="sm" variant="ghost" className="ml-auto text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => { deleteMessage(m.id); toast.success("Message deleted"); }}><Trash2 /> Delete</Button>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="subscribers">
          <div className="mb-4 flex flex-wrap gap-2">
            <Button variant="outline" className="h-9" disabled={!subscribers.length} onClick={() => { navigator.clipboard?.writeText(subscribers.map((s) => s.email).join(", ")); toast.success(`${subscribers.length} emails copied`); }}><Copy /> Copy all emails</Button>
            <Button variant="outline" className="h-9" disabled={!subscribers.length} onClick={() => downloadCsv("subscribers.csv", subscribers.map((s) => ({ email: s.email, joined: s.createdAt })))}><Download /> Export</Button>
          </div>
          {hydrated && !subscribers.length ? <Empty icon={Users} title="No subscribers yet" sub="The newsletter box in the website footer adds people here." /> : (
            <ul className="divide-y rounded-2xl border bg-card">
              {subscribers.map((s) => (
                <li key={s.id} className="flex items-center gap-3 px-4 py-3 text-sm">
                  <span className="min-w-0 flex-1 truncate font-medium">{s.email}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{ago(s.createdAt)}</span>
                  <Button variant="ghost" size="icon-sm" aria-label={`Remove ${s.email}`} onClick={() => { deleteSubscriber(s.id); toast.success("Removed"); }}><Trash2 /></Button>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
