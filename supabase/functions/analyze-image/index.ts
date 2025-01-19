import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { image_url } = await req.json()
    console.log('Analyzing image:', image_url)

    // First, check if the image is safe
    const safetyCheckResponse = await fetch('https://api.studio.nebius.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('NEBIUS_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        max_tokens: 50,
        temperature: 0,
        model: "Qwen/Qwen2-VL-72B-Instruct",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Is this image safe for work? Only respond with 'SAFE' or 'UNSAFE'. Be strict about this." },
              { type: "image_url", image_url: { url: image_url } }
            ]
          }
        ]
      })
    })

    const safetyData = await safetyCheckResponse.json()
    const safetyResult = safetyData.choices[0].message.content.toLowerCase()

    if (safetyResult.includes('unsafe')) {
      return new Response(
        JSON.stringify({ error: 'This image appears to contain inappropriate content.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const response = await fetch('https://api.studio.nebius.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('NEBIUS_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        max_tokens: 150,
        temperature: 0.7,
        model: "Qwen/Qwen2-VL-72B-Instruct",
        messages: [
          {
            role: "user",
            content: [
              { 
                type: "text", 
                text: "Analyze this image and provide information. If it's a food item, include nutritional value, origin, and cultural significance. Format your response as a single paragraph that flows naturally. For food items, start with 'This is [food name],' then describe origin, then nutrition, then cultural significance. For non-food items, provide interesting facts and context. Keep the response engaging and educational, avoiding JSON formatting or bullet points." 
              },
              { type: "image_url", image_url: { url: image_url } }
            ]
          }
        ]
      })
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${await response.text()}`)
    }

    const data = await response.json()
    console.log('API response:', data)

    // Extract the text content directly
    const fact = data.choices[0].message.content

    return new Response(
      JSON.stringify({ description: "", fact: fact }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to analyze image. Please try again.' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})