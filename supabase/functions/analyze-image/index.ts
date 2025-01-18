import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

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
              { type: "text", text: "Analyze this image and provide an interesting fact about what you see. Format your response as a JSON object with 'description' (brief description of what you see) and 'fact' (an interesting fact about the main subject). Keep the fact engaging and educational." },
              { type: "image_url", image_url: { url: image_url } }
            ]
          }
        ],
        response_format: {
          type: "json_object"
        }
      })
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${await response.text()}`)
    }

    const data = await response.json()
    console.log('API response:', data)

    let result = data.choices[0].message.content
    if (typeof result === 'string') {
      try {
        result = JSON.parse(result)
      } catch (e) {
        console.error('Failed to parse JSON response:', e)
        result = { description: "Could not parse the response", fact: result }
      }
    }

    return new Response(
      JSON.stringify(result),
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