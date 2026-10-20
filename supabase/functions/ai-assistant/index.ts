// Supabase Edge Function: ai-assistant
// JoWala - Unga Ooru, Unga Service!
// Secure server-side Gemini integration for natural language service search & intent extraction

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AIRequest {
  query: string;
  language?: "en" | "ta";
  userLocation?: {
    latitude: number;
    longitude: number;
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { query, language = "en" }: AIRequest = await req.json();

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Search query is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Limit input query length to prevent abuse
    const cleanQuery = query.trim().slice(0, 300);

    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    const geminiModel = Deno.env.get("GEMINI_MODEL") || "gemini-1.5-flash";

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch active categories to give Gemini precise reference
    const { data: categories } = await supabase
      .from("categories")
      .select("id, name, name_ta, slug")
      .eq("is_active", true);

    const categoryList = (categories || []).map((c: any) => `${c.name} (${c.name_ta})`).join(", ");

    let extractedCriteria: any = {
      category_name: null,
      locality: null,
      max_budget: null,
      service_need: cleanQuery,
      emergency: false,
    };

    let aiExplanation = "";

    if (geminiApiKey) {
      try {
        const systemPrompt = `You are JoWala's AI Local Marketplace Assistant ("Unga Ooru, Unga Service!").
Analyze user service queries in English or Tamil.
Available Official Categories: [${categoryList}].
Known Localities: Anna Nagar, T. Nagar, Velachery, Adyar, Mylapore, OMR, Tambaram, Alwarpet, Nungambakkam, Guindy, Coimbatore, Madurai, etc.

CRITICAL INSTRUCTIONS:
- You MUST NEVER invent businesses, company names, fake ratings, or fake prices.
- Your sole job is to parse the search intent into JSON.
- Output ONLY valid JSON matching this schema:
{
  "category_name": "One category from the list or null",
  "locality": "Extracted area or city or null",
  "max_budget": number or null,
  "service_need": "concise description of the specific service needed",
  "emergency": boolean,
  "explanation_en": "One warm sentence explaining what you searched for",
  "explanation_ta": "ஒற்றை வாக்கியத்தில் தேடலின் சுருக்கம்"
}`;

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`;

        const geminiRes = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  { text: `${systemPrompt}\n\nUser Search Query: "${cleanQuery}"` }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.1,
              responseMimeType: "application/json"
            }
          })
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            extractedCriteria = JSON.parse(rawText);
            aiExplanation = language === "ta" 
              ? (extractedCriteria.explanation_ta || extractedCriteria.explanation_en) 
              : (extractedCriteria.explanation_en || extractedCriteria.explanation_ta);
          }
        }
      } catch (geminiErr) {
        console.error("Gemini API call failed, falling back to database query:", geminiErr);
      }
    }

    // Now query Supabase for authentic matching businesses
    let dbQuery = supabase
      .from("businesses")
      .select(`
        id,
        name,
        slug,
        description,
        description_ta,
        address,
        locality,
        city,
        rating,
        review_count,
        min_price,
        cover_image,
        is_verified,
        listing_status,
        service_mode,
        category:categories(id, name, name_ta, slug, icon),
        services(id, name, name_ta, price, pricing_type, duration_minutes)
      `)
      .eq("listing_status", "active");

    if (extractedCriteria.locality) {
      dbQuery = dbQuery.ilike("locality", `%${extractedCriteria.locality}%`);
    }

    if (extractedCriteria.max_budget && extractedCriteria.max_budget > 0) {
      dbQuery = dbQuery.lte("min_price", extractedCriteria.max_budget);
    }

    const { data: matchedBusinesses, error: dbErr } = await dbQuery.limit(10);

    if (dbErr) {
      throw dbErr;
    }

    // Return the curated results with explanation and criteria
    return new Response(
      JSON.stringify({
        success: true,
        criteria: extractedCriteria,
        explanation: aiExplanation || `Found results matching "${cleanQuery}"`,
        businesses: matchedBusinesses || [],
        count: matchedBusinesses?.length || 0
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Internal AI Assistant Error"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
