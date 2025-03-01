import { useState } from 'react';
import Head from 'next/head';
import ImageUploader from '../components/ImageUploader';
import ImagePreview from '../components/ImagePreview';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState(null);

  const handleProcessingStart = () => {
    setIsProcessing(true);
    setProcessingError(null);
  };

  const handleProcessed = (data) => {
    setProcessedImage(data);
    setIsProcessing(false);
  };

  const handleError = (error) => {
    setProcessingError(error);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Minecraft Block Art Generator | by Shivaansh Dhingra</title>
        <meta name="description" content="Transform your images into Minecraft block art" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <ImageUploader
              onProcessingStart={handleProcessingStart}
              onProcessed={handleProcessed}
              onError={handleError}
            />
          </div>
          <div>
            <ImagePreview
              processedImage={processedImage}
              loading={isProcessing}
              error={processingError}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
