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
    
    // First, fetch the image data
    const imageResponse = await fetch(image_url)
    if (!imageResponse.ok) {
      throw new Error('Failed to fetch image')
    }
    
    // Read the image data as an ArrayBuffer
    const imageBuffer = await imageResponse.arrayBuffer()
    // Convert to base64 more efficiently using chunks
    const chunks = []
    const uint8Array = new Uint8Array(imageBuffer)
    const chunkSize = 32768
    
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      chunks.push(String.fromCharCode.apply(null, uint8Array.subarray(i, i + chunkSize)))
    }
    
    const base64Image = btoa(chunks.join(''))
    
    console.log('Making request to Nebius API...')
    const response = await fetch('https://vision.api.nebius.cloud/vision/v1/detect', {
      method: 'POST',
      headers: {
        'Authorization': `Api-Key ${Deno.env.get('NEBIUS_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        folderId: "b1g1234567890",
        analyze_specs: [{
          content: base64Image,
          features: [{
            type: 'CLASSIFICATION',
            maxResults: 5
          }, {
            type: 'TEXT_DETECTION',
            maxResults: 5
          }]
        }]
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Nebius API error:', errorText)
      throw new Error(`Nebius API error: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    console.log('Nebius API response:', data)
    
    // Generate a fact based on the detected objects and text
    let fact = "I can see "
    if (data.results?.[0]?.results?.[0]?.classifications) {
      fact += data.results[0].results[0].classifications
        .slice(0, 3)
        .map((obj: any) => obj.label)
        .join(", ")
    } else if (data.results?.[0]?.results?.[0]?.textDetection?.pages?.[0]?.blocks) {
      fact += `text that reads "${data.results[0].results[0].textDetection.pages[0].blocks[0].text}"`
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