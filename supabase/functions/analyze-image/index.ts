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

    const response = await fetch('https://api.studio.nebius.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('NEBIUS_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        max_tokens: 100,
        temperature: 1,
        top_p: 1,
        top_k: 50,
        n: 1,
        stream: false,
        presence_penalty: 0,
        frequency_penalty: 0,
        model: "Qwen/Qwen2-VL-72B-Instruct",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "What's in this image? Provide a brief, interesting fact about what you see." },
              {
                type: "image_url",
                image_url: {
                  url: image_url
                }
              }
            ]
          }
        ],
        response_format: {
          type: "json_object"
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Nebius API error:', errorText)
      throw new Error(`Nebius API error: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    console.log('Nebius API response:', data)

    // Extract the fact from the response
    let fact = data.choices?.[0]?.message?.content
    if (typeof fact === 'string') {
      try {
        const jsonFact = JSON.parse(fact)
        fact = jsonFact.description || jsonFact.fact || fact
      } catch (e) {
        // If parsing fails, use the raw text
        console.log('Failed to parse JSON response:', e)
      }
    }

    return new Response(
      JSON.stringify({ fact: fact || "I see an interesting image" }),
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