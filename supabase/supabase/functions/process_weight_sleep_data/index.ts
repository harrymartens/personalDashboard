
import { createClient } from "npm:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"!)
);

Deno.serve(async (req) => {
  try {
    const response = await req.json();

    const bodyweightData = response.data.metrics.filter(
      (item) => item.name == "weight_body_mass"
    )[0];
    const sleepData = response.data.metrics.filter(
      (item) => item.name == "sleep_analysis"
    )[0];

    let formattedData = {}

    if (bodyweightData){
      formattedData.date = bodyweightData.data[0].date
      formattedData.weight = bodyweightData.data[0].qty
    }

    if (sleepData){
      formattedData.sleep = sleepData.data[0].inBed;
      formattedData.sleep_awake = sleepData.data[0].awake;
      formattedData.sleep_core = sleepData.data[0].core;
      formattedData.sleep_deep = sleepData.data[0].deep;
      formattedData.sleep_rem = sleepData.data[0].rem;

      if(!bodyweightData){
        let tempDate = new Date()
        tempDate.setDate(tempDate.getDate() + 1)
        
        formattedData.date = tempDate.toISOString()
      }
    }

    const data = await supabase
      .from("healthdata")
      .upsert([formattedData])
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
