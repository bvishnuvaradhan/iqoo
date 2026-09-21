import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { Check, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { fadeIn } from '../../utils/animations';

export default function AIProcessing() {
  const { captureFlow, advanceCaptureStep, resetCaptureFlow } = useApp();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState(null);

  const steps = [
    { id: 1, label: "Reading image content..." },
    { id: 2, label: "Extracting raw text..." },
    { id: 3, label: "Finding academic context..." },
    { id: 4, label: "Verifying match..." }
  ];

  useEffect(() => {
    let currentStep = 0;
    
    const interval = setInterval(() => {
      if (currentStep < steps.length - 1 && !error) {
        currentStep++;
        setActiveStep(currentStep);
      }
    }, 1200);

    const processImage = async () => {
      const imageFile = captureFlow.captureData?.imageFile;

      if (!imageFile) {
        setError("No image file provided.");
        clearInterval(interval);
        return;
      }

      try {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await fetch(`http://${window.location.hostname}:8000/api/capture/analyze`, {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || `API returned ${response.status}`);
        }
        
        clearInterval(interval);
        setActiveStep(steps.length); // All steps done

        setTimeout(() => {
          advanceCaptureStep('result', {
            mode: data.mode,
            rawText: data.perception.raw_text,
            initialConfidence: data.perception.confidence,
            subject: data.context_match?.subject || 'Unknown',
            topic: data.context_match?.module || 'Unknown',
            subtopic: data.context_match?.topic || 'Unknown',
            confidence: data.verification.confidence,
            isVerified: data.verification.verified,
            verificationState: data.verification.verificationState,
            changes: data.verification.changes,
            itemId: data.context_match?.itemId,
            itemType: data.context_match?.itemType || data.perception.itemType,
            targetDate: data.perception.target_date,
            reason: data.verification.reason,
            evidence: data.verification.evidence || [],
            extractedText: [data.perception.raw_text],
            tags: ['capture']
          });
        }, 500);

      } catch (err) {
        console.error("Context API error:", err);
        clearInterval(interval);
        setError("AI perception is temporarily unavailable. " + (err.message || ''));
      }
    };

    if (!error) {
      processImage();
    }

    return () => clearInterval(interval);
  }, [advanceCaptureStep, captureFlow.captureData, error]);

  if (error) {
    return (
      <motion.div className="flex flex-col h-full px-6 pt-16 pb-24 max-w-[430px] mx-auto bg-dark-950 items-center justify-center text-center" variants={fadeIn} initial="initial" animate="animate" exit="exit">
        <div className="w-20 h-20 rounded-full bg-accent-danger/20 flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-accent-danger" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Processing Failed</h2>
        <p className="text-sm text-white/60 mb-8">{error}</p>
        
        <button onClick={resetCaptureFlow} className="w-full py-4 rounded-xl bg-white/10 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-colors">
          <RefreshCw className="w-5 h-5" /> Try Again
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="flex flex-col h-full px-6 pt-16 pb-24 max-w-[430px] mx-auto bg-dark-950 items-center"
      variants={fadeIn}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="flex-1 flex items-center justify-center relative w-full mb-8">
        <div className="relative w-64 h-64 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-ai-cyan/20 animate-[spin_12s_linear_infinite]" />
          <div className="absolute inset-4 rounded-full border border-ai-purple/30 animate-[spin_8s_linear_infinite_reverse]" />
          <div className="absolute inset-8 rounded-full border border-ai-blue/40 animate-[spin_6s_linear_infinite]" />
          <div className="absolute inset-12 rounded-full border border-white/10 animate-[spin_4s_linear_infinite_reverse]" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-ai-blue/5 to-ai-purple/5 blur-2xl animate-pulse" />
          <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-ai-blue via-ai-purple to-ai-cyan flex items-center justify-center shadow-[0_0_50px_rgba(139,92,246,0.6)]">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
        </div>
      </div>

      <div className="w-full flex-1 max-w-sm mx-auto">
        <div className="space-y-4 relative">
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-white/10 -z-10"></div>
          <AnimatePresence>
            {steps.slice(0, activeStep + 1).map((step, index) => {
              const isActive = index === activeStep;
              const isCompleted = index < activeStep;
              
              return (
                <motion.div key={step.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 transition-colors duration-500 ${isCompleted ? 'bg-ai-cyan/20 text-ai-cyan' : isActive ? 'bg-ai-purple text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]' : 'bg-dark-800'}`}>
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : isActive ? <div className="w-2 h-2 bg-white rounded-full animate-pulse" /> : null}
                  </div>
                  <span className={`text-sm font-semibold transition-colors duration-500 ${isCompleted ? 'text-white/40' : isActive ? 'text-transparent bg-clip-text bg-gradient-to-r from-ai-purple to-ai-cyan' : 'text-white/20'}`}>
                    {step.label}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
