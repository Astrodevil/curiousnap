import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { image_url } = await req.json()
    console.log('Analyzing image:', image_url)
    
    const response = await fetch('https://api.nebius.ai/v1/vision/analyze', {
      method: 'POST',
      headers: {
        'Authorization': `Api-Key ${Deno.env.get('NEBIUS_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url,
        features: [
          {
            feature_type: 'OBJECT_DETECTION',
            max_results: 5
          },
          {
            feature_type: 'TEXT_DETECTION',
            max_results: 5
          }
        ]
      })
    })

    const data = await response.json()
    console.log('Nebius API response:', data)
    
    // Generate a fact based on the detected objects and text
    let fact = "I can see "
    if (data.objects && data.objects.length > 0) {
      fact += data.objects.slice(0, 3).map((obj: any) => obj.name).join(", ")
    } else if (data.text && data.text.length > 0) {
      fact += `text that reads "${data.text[0].text}"`
    } else {
      fact += "an interesting image"
    }

    return new Response(
      JSON.stringify({ fact }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error analyzing image:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})