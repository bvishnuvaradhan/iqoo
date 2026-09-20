import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

import CaptureHub from '../components/capture/CaptureHub';
import CameraView from '../components/capture/CameraView';
import AIProcessing from '../components/capture/AIProcessing';
import PerceptionResult from '../components/capture/PerceptionResult';
import ContextVerification from '../components/capture/ContextVerification';
import TelegramImport from '../components/capture/TelegramImport';
import TelegramReview from '../components/capture/TelegramReview';

export default function CaptureScreen() {
  const { captureFlow, telegramFlow } = useApp();

  const renderStep = () => {
    if (telegramFlow.step !== 'idle') {
      switch (telegramFlow.step) {
        case 'upload':
          return <TelegramImport key="tg-upload" />;
        case 'review':
          return <TelegramReview key="tg-review" />;
        default:
          return <CaptureHub key="hub" />;
      }
    }

    switch (captureFlow.step) {
      case 'idle':
        return <CaptureHub key="hub" />;
      case 'camera':
        return <CameraView key="camera" />;
      case 'processing':
        return <AIProcessing key="processing" />;
      case 'result':
        return <PerceptionResult key="result" />;
      case 'verification':
        return <ContextVerification key="verification" />;
      case 'updated':
        return <ContextUpdated key="updated" />;
      default:
        return <CaptureHub key="hub" />;
    }
  };

  return (
    <div className="h-full w-full bg-dark-950 relative overflow-hidden">
      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>
    </div>
  );
}
