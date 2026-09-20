import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { Camera, X, Check, Image as ImageIcon } from 'lucide-react';
import { fadeIn, slideUp } from '../../utils/animations';

export default function CameraView() {
  const { advanceCaptureStep, resetCaptureFlow } = useApp();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapture = () => {
    // If no image is selected, we could trigger the file input, but let's assume they click the button to analyze
    if (imageFile) {
      advanceCaptureStep('processing', { imageFile });
    } else {
      fileInputRef.current?.click();
    }
  };

  return (
    <motion.div 
      className="flex flex-col h-full bg-black max-w-[430px] mx-auto relative overflow-hidden"
      variants={fadeIn}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Top Bar */}
      <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black/80 to-transparent z-20 flex items-center px-4">
        <button 
          onClick={resetCaptureFlow}
          className="w-10 h-10 flex items-center justify-center text-white bg-black/40 rounded-full backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Viewfinder / Image Preview */}
      <div className="flex-1 relative flex items-center justify-center">
        {selectedImage ? (
          <img src={selectedImage} alt="Captured" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-dark-900 flex flex-col items-center justify-center border-2 border-dashed border-white/20 m-4 rounded-3xl p-6 text-center">
             <ImageIcon className="w-12 h-12 text-white/30 mb-4" />
             <p className="text-white/60 font-medium">Select an image to analyze.</p>
             <p className="text-white/40 text-sm mt-2 max-w-[250px]">Upload a whiteboard, handwritten notes, or a document.</p>
          </div>
        )}
        
        {/* Scanning Overlay (if image is selected, just for aesthetics before analyzing) */}
        {selectedImage && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full border-4 border-ai-blue/30 rounded-3xl m-4" style={{ width: 'calc(100% - 32px)', height: 'calc(100% - 32px)' }}></div>
            <motion.div 
              className="absolute left-4 right-4 h-0.5 bg-ai-blue shadow-[0_0_15px_rgba(59,130,246,1)]"
              animate={{ top: ['10%', '90%', '10%'] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
            />
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input 
        type="file" 
        accept="image/*" 
        capture="environment"
        ref={fileInputRef}
        onChange={handleImageSelect}
        className="hidden" 
      />

      {/* Bottom Controls */}
      <div className="h-32 bg-black flex items-center justify-around px-8 pb-8 pt-4 z-20">
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-md"
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        <div className="relative">
          {imageFile ? (
            <button 
              onClick={handleCapture}
              className="w-20 h-20 rounded-full bg-ai-gradient shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center justify-center text-white font-bold"
            >
              Analyze
            </button>
          ) : (
            <button 
              onClick={handleCapture}
              className="w-16 h-16 rounded-full border-4 border-white/80 bg-white/20 flex items-center justify-center"
            >
              <div className="w-12 h-12 rounded-full bg-white"></div>
            </button>
          )}
        </div>

        <div className="w-12 h-12"></div> {/* Spacer for symmetry */}
      </div>
    </motion.div>
  );
}
