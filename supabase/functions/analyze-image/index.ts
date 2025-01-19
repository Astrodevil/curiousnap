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
    
    if (!image_url) {
      console.error('No image URL provided in request body');
      return new Response(
        JSON.stringify({ error: 'No image URL provided' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate the image URL format
    if (!image_url.startsWith('data:image/') && !image_url.startsWith('http')) {
      console.error('Invalid image URL format');
      return new Response(
        JSON.stringify({ error: 'Invalid image URL format' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Processing image analysis request...');

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

    if (!safetyCheckResponse.ok) {
      console.error('Safety check failed:', await safetyCheckResponse.text());
      throw new Error('Failed to perform safety check');
    }

    const safetyData = await safetyCheckResponse.json()
    console.log('Safety check response:', safetyData);
    
    const safetyResult = safetyData.choices[0].message.content.toLowerCase()
    if (safetyResult.includes('unsafe')) {
      return new Response(
        JSON.stringify({ error: 'This image appears to contain inappropriate content.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log('Image passed safety check, proceeding with analysis...');

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
                text: "Analyze this image and provide a single, well-formatted paragraph of information. If it's a food item, include: 1) what it is, 2) its origin, 3) nutritional highlights, and 4) cultural significance. For non-food items, provide interesting facts and context. Keep the response natural and engaging, avoiding technical formatting." 
              },
              { type: "image_url", image_url: { url: image_url } }
            ]
          }
        ]
      })
    })

    if (!response.ok) {
      console.error('Analysis failed:', await response.text());
      throw new Error('Failed to analyze image');
    }

    const data = await response.json()
    console.log('Analysis completed successfully');

    const fact = data.choices[0].message.content.trim();

    return new Response(
      JSON.stringify({ fact }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in analyze-image function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to analyze image. Please try again.',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
})