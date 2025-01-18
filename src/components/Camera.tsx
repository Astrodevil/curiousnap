import React, { useRef, useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraProps {
  onImageCapture: (image: string) => void;
}

const CameraComponent = ({ onImageCapture }: CameraProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageCapture(reader.result as string);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />
      <div className="flex gap-4">
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="bg-primary hover:bg-primary/90 text-white flex gap-2 items-center"
          disabled={isLoading}
        >
          <Camera className="w-5 h-5" />
          Take Photo
        </Button>
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          className="flex gap-2 items-center"
          disabled={isLoading}
        >
          <Upload className="w-5 h-5" />
          Upload
        </Button>
      </div>
    </div>
  );
};

export default CameraComponent;