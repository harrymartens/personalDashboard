import { createClient } from "npm:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"!)
);

Deno.serve(async (req: Request) => {
  try {
    const inputData = await req.json();
    const reducedData = inputData.data.metrics[0].data[0];

    const row = {
      date: reducedData.date,
      steps: reducedData.qty,
    };

    const data = await supabase
    .from("healthdata")
    .upsert([row])
    .select();

    return new Response(JSON.stringify(data), { status: 200 });

  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      {
        status: 500,
      }
    );
  }

});
