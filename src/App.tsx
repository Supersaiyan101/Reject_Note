import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ResumeUploader } from './components/ResumeUploader';
import { ClaimScanner } from './components/ClaimScanner';
import { DossierCard } from './components/DossierCard';
import { InquisitorRoster } from './components/InquisitorRoster';
import { LShowcase } from './components/LShowcase';
import { CalibrationStage } from './components/CalibrationStage';
import { InterrogationStage } from './components/InterrogationStage';
import { VerdictStage } from './components/VerdictStage';
import type { CandidateDossier, AppStage, InquisitorProfile, BaselineCalibration, InterrogationSummary } from './types';
import { LIGHT_YAGAMI_DOSSIER, parseCustomResume } from './data/sampleResumes';
import { INQUISITORS } from './data/inquisitors';
import { ArrowRight } from 'lucide-react';
import { soundFX } from './utils/sfx';

export function App() {
  const [stage, setStage] = useState<AppStage>('STAGE_1_LOBBY');
  const [selectedDossier, setSelectedDossier] = useState<CandidateDossier | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedInquisitor, setSelectedInquisitor] = useState<InquisitorProfile>(INQUISITORS[0]);
  const [baselineCalibration, setBaselineCalibration] = useState<BaselineCalibration | null>(null);
  const [interrogationSummary, setInterrogationSummary] = useState<InterrogationSummary | null>(null);

  // Load Light Yagami preset
  const handleLoadLightYagami = () => {
    setSelectedDossier(LIGHT_YAGAMI_DOSSIER);
    setIsScanning(true);
  };

  // Custom Resume Upload / Paste
  const handleCustomResume = (fileName: string, text: string) => {
    const parsed = parseCustomResume(fileName, text);
    setSelectedDossier(parsed);
    setIsScanning(true);
  };

  // Scan finished
  const handleScanComplete = () => {
    setIsScanning(false);
  };

  // Reset to upload state
  const handleReset = () => {
    setSelectedDossier(null);
    setIsScanning(false);
    setBaselineCalibration(null);
    setStage('STAGE_1_LOBBY');
  };

  // Navigation handlers
  const handleProceedToStage2 = () => {
    soundFX.playDramaticSting();
    setStage('STAGE_2_ROSTER');
  };

  const handleBackToProfile = () => {
    setStage('STAGE_1_LOBBY');
  };

  const handleConfirmInquisitor = () => {
    soundFX.playDramaticSting();
    setStage('STAGE_3_CALIBRATION');
  };

  const handleBackToInquisitor = () => {
    setStage('STAGE_2_ROSTER');
  };

  const handleCalibrationComplete = (calibration: BaselineCalibration) => {
    soundFX.playDramaticSting();
    setBaselineCalibration(calibration);
    setStage('STAGE_4_INTERROGATION');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col font-['Space_Grotesk'] selection:bg-rose-600 selection:text-white">
      {/* Anime Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] z-40" />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 pb-16">
        <Hero />

        {/* ----------------- STAGE 1: THE LOBBY & APPLICATION ----------------- */}
        {stage === 'STAGE_1_LOBBY' && (
          <>
            {!selectedDossier && (
              <ResumeUploader
                onLoadLightYagami={handleLoadLightYagami}
                onCustomResume={handleCustomResume}
                disabled={isScanning}
              />
            )}

            {isScanning && selectedDossier && (
              <ClaimScanner
                candidateName={selectedDossier.name}
                onScanComplete={handleScanComplete}
              />
            )}

            {!isScanning && selectedDossier && (
              <DossierCard
                dossier={selectedDossier}
                onProceed={handleProceedToStage2}
                onReset={handleReset}
              />
            )}
          </>
        )}

        {/* ----------------- STAGE 2: INQUISITOR ROSTER ----------------- */}
        {stage === 'STAGE_2_ROSTER' && selectedDossier && (
          <div className="space-y-4">
            <InquisitorRoster
              candidateName={selectedDossier.name}
              selectedId={selectedInquisitor.id}
              onSelectInquisitor={(inq) => setSelectedInquisitor(inq)}
            />

            <LShowcase
              inquisitor={selectedInquisitor}
              candidateName={selectedDossier.name}
              onConfirm={handleConfirmInquisitor}
              onBack={handleBackToProfile}
            />
          </div>
        )}

        {/* ----------------- STAGE 3: SECURITY CLEARANCE & CALIBRATION ----------------- */}
        {stage === 'STAGE_3_CALIBRATION' && selectedDossier && (
          <CalibrationStage
            dossier={selectedDossier}
            inquisitor={selectedInquisitor}
            onCalibrationComplete={handleCalibrationComplete}
            onBack={handleBackToInquisitor}
          />
        )}

        {/* ----------------- STAGE 4: LIVE INTERROGATION CHAMBER ----------------- */}
        {stage === 'STAGE_4_INTERROGATION' && selectedDossier && baselineCalibration && (
          <InterrogationStage
            dossier={selectedDossier}
            inquisitor={selectedInquisitor}
            baseline={baselineCalibration}
            onCompleteVerdict={(summary) => {
              setInterrogationSummary(summary);
              setStage('STAGE_5_VERDICT');
            }}
            onBack={() => setStage('STAGE_3_CALIBRATION')}
          />
        )}

        {/* ----------------- STAGE 5: THE FINAL REJECT NOTE VERDICT ----------------- */}
        {stage === 'STAGE_5_VERDICT' && selectedDossier && interrogationSummary && (
          <VerdictStage
            summary={interrogationSummary}
            onRestart={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-neutral-900 bg-[#070709] py-6 px-4 text-center text-xs font-mono text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            RejectNote © 2026 // Presage SmartSpectra Challenge Submission
          </p>
          <div className="flex items-center gap-2 text-rose-500 font-bold">
            <span>&ldquo;His buzzword count is over 9000!&rdquo;</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
