import React, { useState, useEffect } from 'react';
import CameraComponent from '@/components/Camera';
import FactCard from '@/components/FactCard';
import RecentDiscoveries from '@/components/RecentDiscoveries';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Discovery {
  imageUrl: string;
  fact: string;
}

const Index = () => {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentFact, setCurrentFact] = useState<string | null>(null);
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchRecentDiscoveries();
  }, []);

  const fetchRecentDiscoveries = async () => {
    const { data, error } = await supabase
      .from('discoveries')
      .select('image_url, fact')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching discoveries:', error);
      return;
    }

    if (data) {
      setDiscoveries(data.map(d => ({ imageUrl: d.image_url, fact: d.fact })));
    }
  };

  const handleImageCapture = async (imageUrl: string) => {
    setCurrentImage(imageUrl);
    setIsLoading(true);

    try {
      // Call Nebius API through Edge Function
      const response = await fetch('https://uvyjxyhxwgjrvtaeuzme.functions.supabase.co/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ image_url: imageUrl }),
      });

      const { fact, error } = await response.json();

      if (error) throw new Error(error);

      setCurrentFact(fact);

      // Store the discovery in Supabase
      const { error: insertError } = await supabase
        .from('discoveries')
        .insert([{ image_url: imageUrl, fact }]);

      if (insertError) throw new Error(insertError.message);

      // Refresh the recent discoveries
      await fetchRecentDiscoveries();

      toast({
        title: "New Discovery!",
        description: fact,
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to analyze the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Tumko Pata Hai?</h1>
          <p className="text-gray-600">Discover fascinating facts about anything!</p>
        </div>

        <CameraComponent onImageCapture={handleImageCapture} />

        {isLoading && (
          <div className="text-center text-gray-600">
            Analyzing image...
          </div>
        )}

        {currentImage && currentFact && (
          <FactCard imageUrl={currentImage} fact={currentFact} />
        )}

        <RecentDiscoveries discoveries={discoveries} />
      </div>
    </div>
  );
};

export default Index;