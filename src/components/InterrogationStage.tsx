import React from 'react';
import type { 
  CandidateDossier, 
  InquisitorProfile, 
  BaselineCalibration, 
  InterrogationSummary 
} from '../types';
import { DeathNoteChamber } from './interrogation/DeathNoteChamber';

interface InterrogationStageProps {
  dossier: CandidateDossier;
  inquisitor: InquisitorProfile;
  baseline: BaselineCalibration;
  onCompleteVerdict: (summary: InterrogationSummary) => void;
  onBack: () => void;
}

export const InterrogationStage: React.FC<InterrogationStageProps> = ({
  dossier,
  inquisitor,
  baseline,
  onCompleteVerdict,
  onBack,
}) => {
  // Modular Character Courtroom Selection
  switch (inquisitor.id) {
    case 'L':
    default:
      // Death Note Noir Task Force Chamber
      return (
        <DeathNoteChamber
          dossier={dossier}
          inquisitor={inquisitor}
          baseline={baseline}
          onComplete={onCompleteVerdict}
          onBack={onBack}
        />
      );
  }
};

