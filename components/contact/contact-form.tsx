"use client";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createMessage } from "@/lib/data/store";
import { contactSchema, type ContactInput } from "@/lib/validation";
import type { BranchId } from "@/lib/types";
import { cn } from "@/lib/utils";

const topics = ["Planning a holiday", "A booking I made", "Visa or passport help", "Group or corporate trip", "Something else"];

export function ContactForm() {
  const [sent, setSent] = useState<string | null>(null);
  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema) as never,
    defaultValues: { name: "", email: "", phone: "", subject: topics[0], message: "", branch: "pondicherry" },
    mode: "onTouched",
  });
  const { register, formState: { errors, isSubmitting }, setValue } = form;
  const branch = useWatch({ control: form.control, name: "branch" });

  const onSubmit = form.handleSubmit(async (v) => {
    await createMessage({ ...v, phone: v.phone ?? "" });
    setSent(v.name.split(" ")[0]);
    form.reset();
  });

  if (sent)
    return (
      <div className="grid place-items-center rounded-3xl border bg-card p-8 text-center sm:p-12">
        <CheckCircle2 className="size-14 text-brand" />
        <h2 className="mt-5 text-4xl font-extrabold">Thanks, {sent}!</h2>
        <p className="mt-3 max-w-sm text-muted-foreground">Your message is with the team. We usually reply within a working day, often sooner on WhatsApp.</p>
        <Button variant="outline" className="mt-7 h-11 rounded-full px-6" onClick={() => setSent(null)}>Send another message</Button>
      </div>
    );

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 rounded-3xl border bg-card p-6 sm:grid-cols-2 sm:p-8">
      <div className="sm:col-span-2">
        <h2 className="text-3xl font-extrabold sm:text-4xl">Send us a message</h2>
        <p className="mt-2 text-sm text-muted-foreground">Questions, ideas or anything about a trip. For a full itinerary and price, the <a href="/plan" className="font-semibold text-brand underline-offset-4 hover:underline">quote form</a> is quicker.</p>
      </div>
      <Field label="Your name" error={errors.name?.message}><Input autoComplete="name" className="h-11" {...register("name")} /></Field>
      <Field label="Email" error={errors.email?.message}><Input type="email" autoComplete="email" className="h-11" {...register("email")} /></Field>
      <Field label="Phone / WhatsApp (optional)" error={errors.phone?.message}><Input type="tel" autoComplete="tel" className="h-11" {...register("phone")} /></Field>
      <Field label="About">
        <select className="h-11 w-full rounded-lg border bg-background px-3 text-sm" {...register("subject")}>{topics.map((t) => <option key={t}>{t}</option>)}</select>
      </Field>
      <div className="sm:col-span-2">
        <Label className="mb-2 block">Nearest office</Label>
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Nearest office">
          {(["pondicherry", "chennai"] as BranchId[]).map((b) => (
            <button key={b} type="button" role="radio" aria-checked={branch === b} onClick={() => setValue("branch", b)}
              className={cn("h-11 rounded-xl border text-sm font-bold capitalize transition", branch === b ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary/50")}>{b}</button>
          ))}
        </div>
      </div>
      <div className="sm:col-span-2"><Field label="Message" error={errors.message?.message}><Textarea rows={5} {...register("message")} placeholder="How can we help?" /></Field></div>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <Button type="submit" size="lg" className="h-12 rounded-full px-7" disabled={isSubmitting}><Send /> {isSubmitting ? "Sending…" : "Send message"}</Button>
        <p className="text-xs text-muted-foreground">We only use your details to reply.</p>
      </div>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <div className="min-w-0 space-y-1.5"><Label>{label}</Label>{children}{error && <p role="alert" className="text-xs text-destructive">{error}</p>}</div>;
}
