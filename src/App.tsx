import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ResumeUploader } from './components/ResumeUploader';
import { ClaimScanner } from './components/ClaimScanner';
import { DossierCard } from './components/DossierCard';
import type { CandidateDossier, AppStage } from './types';
import { LIGHT_YAGAMI_DOSSIER, parseCustomResume } from './data/sampleResumes';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { soundFX } from './utils/sfx';

export function App() {
  const [stage, setStage] = useState<AppStage>('STAGE_1_LOBBY');
  const [selectedDossier, setSelectedDossier] = useState<CandidateDossier | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showStage2LockedNotice, setShowStage2LockedNotice] = useState(false);

  // Log active stage for routing
  if (stage === 'STAGE_2_ROSTER') {
    // stage indicator active
  }

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
    setShowStage2LockedNotice(false);
  };

  // Proceed to Stage 2
  const handleProceedToStage2 = () => {
    soundFX.playDramaticSting();
    setShowStage2LockedNotice(true);
    setStage('STAGE_2_ROSTER');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col font-['Space_Grotesk'] selection:bg-rose-600 selection:text-white">
      {/* Anime Grain & Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] z-40" />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 pb-16">
        <Hero />

        {/* Dynamic Stage 1 Views */}
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

        {!isScanning && selectedDossier && !showStage2LockedNotice && (
          <DossierCard
            dossier={selectedDossier}
            onProceed={handleProceedToStage2}
            onReset={handleReset}
          />
        )}

        {/* Hand-off Notice to Stage 2 */}
        {showStage2LockedNotice && selectedDossier && (
          <div className="w-full max-w-3xl mx-auto px-4 py-8">
            <div className="rounded-2xl bg-gradient-to-b from-neutral-900 via-neutral-950 to-black border-2 border-emerald-500/70 p-8 text-center shadow-[0_0_50px_rgba(16,185,129,0.3)]">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-950 border border-emerald-500/60 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <span className="font-mono text-xs text-emerald-400 font-bold tracking-widest uppercase">
                STAGE 1 DELIVERABLE COMPLETE
              </span>

              <h2 className="font-['Bangers'] text-3xl md:text-4xl text-white tracking-wider my-2">
                DOSSIER LOCKED FOR: <span className="text-rose-500">{selectedDossier.name}</span>
              </h2>

              <p className="text-sm font-mono text-neutral-300 max-w-lg mx-auto mb-6">
                All <strong className="text-amber-400">{selectedDossier.buzzwordCount} buzzwords</strong> and{' '}
                <strong className="text-rose-400">{selectedDossier.flaggedLandmines.length} high-suspicion claims</strong>{' '}
                are packaged and ready for <strong className="text-white">L (Lawliet)</strong> in Stage 2!
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setShowStage2LockedNotice(false)}
                  className="px-6 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-mono text-xs cursor-pointer transition-colors"
                >
                  ← Back to Dossier Review
                </button>
                <div className="px-6 py-2.5 rounded-lg bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 font-mono text-xs flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Awaiting Stage 2 Inquisitor Engine</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-neutral-900 bg-[#070709] py-6 px-4 text-center text-xs font-mono text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            RejectNote © 2026 // Presage SmartSpectra Challenge Submission
          </p>
          <p className="text-neutral-400">
            &ldquo;His buzzword count is over 9000!&rdquo;
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
