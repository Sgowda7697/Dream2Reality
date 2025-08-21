import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { PlanResponse, TPlanResponse } from "@/lib/schema";
import { MOCK_FLIGHTS, MOCK_HOTELS } from "@/lib/mock-data";

// Retrieve environment variables correctly, with fallbacks for safety.
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const AZURE_OPENAI_API_VERSION = process.env.AZURE_OPENAI_API_VERSION;
const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY;
const AZURE_OPENAI_MODEL = process.env.AZURE_OPENAI_MODEL;

// Check if we have all environment variables for Azure OpenAI
const hasAzureConfig = AZURE_OPENAI_ENDPOINT && AZURE_OPENAI_API_VERSION && AZURE_OPENAI_API_KEY && AZURE_OPENAI_MODEL;

// Initialize OpenAI client only if we have configuration
let client: OpenAI | null = null;

if (hasAzureConfig) {
  client = new OpenAI({
    apiKey: AZURE_OPENAI_API_KEY,
    baseURL: `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${AZURE_OPENAI_MODEL}`,
    defaultQuery: { 'api-version': AZURE_OPENAI_API_VERSION },
    defaultHeaders: { 'api-key': AZURE_OPENAI_API_KEY },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    // If Azure OpenAI is not configured, return a mock response
    if (!hasAzureConfig || !client) {
      console.log("Azure OpenAI not configured, returning mock data");
      
      // Create a mock response based on the prompt
      const mockDestinations = [
        { name: "Goa", country: "India", summary: "Beautiful beaches and vibrant nightlife", tags: ["beach", "nightlife", "relaxation"] },
        { name: "Mysore", country: "India", summary: "Royal palaces and cultural heritage", tags: ["culture", "history", "architecture"] }
      ];
      
      const chosen = "Goa";
      const flights = MOCK_FLIGHTS[chosen] ?? [];
      const hotels = MOCK_HOTELS[chosen] ?? [];
      
      const mockItinerary = [
        {
          day: 1,
          title: "Beach Day & Arrival",
          activities: [
            { time: "10:00 AM", name: "Check-in to hotel", description: "Get settled and freshen up" },
            { time: "2:00 PM", name: "Calangute Beach", description: "Relax on the golden sands", lat: 15.5466, lng: 73.7553 },
            { time: "7:00 PM", name: "Dinner at Beach Shack", description: "Fresh seafood by the ocean" }
          ]
        },
        {
          day: 2,
          title: "Exploration & Culture",
          activities: [
            { time: "9:00 AM", name: "Old Goa Churches", description: "Visit historic Portuguese churches", lat: 15.5007, lng: 73.9117 },
            { time: "1:00 PM", name: "Local Lunch", description: "Traditional Goan cuisine" },
            { time: "4:00 PM", name: "Anjuna Flea Market", description: "Shopping for souvenirs and handicrafts" }
          ]
        },
        {
          day: 3,
          title: "Adventure & Departure",
          activities: [
            { time: "9:00 AM", name: "Water Sports", description: "Jet skiing and parasailing at Baga Beach" },
            { time: "12:00 PM", name: "Check-out", description: "Pack up and head to airport" },
            { time: "3:00 PM", name: "Departure", description: "Flight back home" }
          ]
        }
      ];

      const result: TPlanResponse = PlanResponse.parse({
        userQuery: prompt,
        durationDays: 3,
        budget: "medium" as const,
        themes: ["beach", "culture", "relaxation"],
        destinationOptions: mockDestinations,
        chosenDestination: chosen,
        flights,
        hotels,
        itinerary: mockItinerary,
      });

      return NextResponse.json(result);
    }

    // Ask the model for structured options first
    const system = `You are a travel planner. Extract destination options
    from a dream vacation description and propose a short plan as STRICT JSON.
    Required JSON keys: userQuery, durationDays, budget (low|medium|high),
    themes[], destinationOptions[{name,country?,summary?,tags[]}].
    Only output JSON.`;

    const completion = await client.chat.completions.create({
      model: AZURE_OPENAI_MODEL!, // Use the model from the environment variable
      temperature: 0.7,
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const draft = JSON.parse(completion.choices[0].message.content || "{}") as Partial<TPlanResponse>;

    // Pick first destination (you could let the user choose on the UI)
    const chosen = draft.destinationOptions?.[0]?.name || "Goa";
    const flights = MOCK_FLIGHTS[chosen] ?? [];
    const hotels = MOCK_HOTELS[chosen] ?? [];

    // Get an itinerary for the chosen destination (day-by-day)
    const itinerarySystem = `Create a ${draft.durationDays || 3}-day
    itinerary for ${chosen} optimized for themes ${
      (draft.themes || []).join(", ") || "relaxation"
    }. Output STRICT JSON array: [{day:number,title:string,activities:
    [{time,name,description?,lat?,lng?}]}]. No extra text.

    IMPORTANT: Wrap the JSON array in a JSON object with a key 'itinerary'.
    Example: { "itinerary": [...] }`;

    const itinResp = await client.chat.completions.create({
      model: AZURE_OPENAI_MODEL!, // Use the same model for the second call
      temperature: 0.7,
      messages: [ { role: "system", content: itinerarySystem } ],
      // Change response_format to 'json_object' since 'json_array' isn't supported
      response_format: { type: "json_object" }
    });

    // Parse the object and extract the itinerary array
    const itinData = JSON.parse(itinResp.choices[0].message.content || "{}");
    const itinerary = itinData.itinerary || [];

    const result: TPlanResponse = PlanResponse.parse({
      userQuery: draft.userQuery || prompt,
      durationDays: draft.durationDays || 3,
      budget: draft.budget || "medium",
      themes: draft.themes || [],
      destinationOptions: draft.destinationOptions || [{ name: chosen }],
      chosenDestination: chosen,
      flights,
      hotels,
      itinerary,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}