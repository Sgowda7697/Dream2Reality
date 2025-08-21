import { z } from "zod";
export const DestinationSuggestion = z.object({
name: z.string(),
country: z.string().optional(),
summary: z.string().optional(),
tags: z.array(z.string()).default([]),
});
export const ItineraryDay = z.object({
day: z.number(),
title: z.string(),
activities: z.array(z.object({
time: z.string(),
name: z.string(),
description: z.string().optional(),
lat: z.number().optional(),
lng: z.number().optional(),
}))
});
export const Flight = z.object({
from: z.string(), to: z.string(), airline: z.string(), price: z.number()
});
export const Hotel = z.object({
name: z.string(), area: z.string().optional(), pricePerNight: z.number()
});
export const PlanResponse = z.object({
userQuery: z.string(),
durationDays: z.number().default(3),
budget: z.enum(["low","medium","high"]).default("medium"),
themes: z.array(z.string()).default([]),
destinationOptions: z.array(DestinationSuggestion).min(1),
chosenDestination: z.string().optional(),
flights: z.array(Flight).default([]),
hotels: z.array(Hotel).default([]),
itinerary: z.array(ItineraryDay).default([]),
});
export type TPlanResponse = z.infer<typeof PlanResponse>;