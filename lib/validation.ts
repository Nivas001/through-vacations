import { z } from "zod";

const phone = z.string().trim().min(7, "Enter a phone number we can reach you on").regex(/^[+\d][\d\s-]{6,}$/, "Use digits, spaces or + only");

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name"),
  email: z.string().trim().email("Enter a valid email address"),
  phone,
  city: z.string().trim().min(2, "Departure city is required"),
  country: z.string().trim().min(2, "Country is required"),
  notes: z.string().max(1000).optional().default(""),
});
export type LeadInput = z.infer<typeof leadSchema>;

export const quoteSchema = z.object({
  destinations: z.string().trim().min(2, "Tell us where you would like to go"),
  dates: z.string().trim().optional().default(""),
  flexibleDates: z.boolean().default(false),
  travellers: z.number().int().min(1).max(60),
  budget: z.string().trim().optional().default(""),
  currency: z.string().default("INR"),
  styles: z.array(z.string()).default([]),
  name: z.string().trim().min(2, "Please enter your name"),
  email: z.string().trim().email("Enter a valid email address"),
  phone,
  departureCity: z.string().trim().min(2, "Departure city is required"),
  departureCountry: z.string().trim().min(2, "Country is required"),
  notes: z.string().max(1500).optional().default(""),
});
export type QuoteInput = z.infer<typeof quoteSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().optional().default("").refine((v) => !v || /^[+\d][\d\s-]{6,}$/.test(v), "Use digits, spaces or + only"),
  subject: z.string().trim().min(2),
  message: z.string().trim().min(10, "A few more words, please").max(2000),
  branch: z.enum(["pondicherry", "chennai"]),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const emailSchema = z.string().trim().email("Enter a valid email address");
