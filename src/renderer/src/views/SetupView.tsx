import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Info, ExternalLink } from 'lucide-react';
import {
  SetupHeader,
  SetupStepper,
  SetupLicenseStep,
  SetupConfigureStep,
  SetupCompleteStep,
  SetupSidebar
} from '@components';

export default function SetupView(): JSX.Element {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(3);
  const [licenseKey, setLicenseKey] = useState('');
  const [activeTab, setActiveTab] = useState('Installation');

  const formatLicenseKey = (value: string): string => {
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const truncated = cleaned.slice(0, 32);
    const matches = truncated.match(/.{1,4}/g);
    return matches ? matches.join('-') : truncated;
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 3) {
      setCurrentStep(currentStep - 1);
    }
  };

  const showBackButton = currentStep >= 4;

  return (
    <div className="flex-1 flex flex-col px-8 md:px-12 lg:px-16 py-6 z-10 overflow-y-auto w-full text-white bg-wap-bg">
      <SetupHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col lg:flex-row gap-8 py-6 w-full">
        <div className="flex-1 flex flex-col justify-between space-y-8">
          <div>
            {showBackButton ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-xs font-semibold text-wap-text-secondary hover:text-white mb-6 transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </button>
            ) : (
              <div className="h-10" />
            )}

            <h2 className="text-xl font-extrabold text-white mb-6">Install Agent on macOS</h2>

            <SetupStepper currentStep={currentStep} />

            <div className="space-y-6 max-w-2xl min-h-[220px]">
              {currentStep === 3 && (
                <SetupLicenseStep
                  licenseKey={licenseKey}
                  setLicenseKey={setLicenseKey}
                  formatLicenseKey={formatLicenseKey}
                  onValidSubmit={handleNext}
                />
              )}

              {currentStep === 4 && <SetupConfigureStep />}

              {currentStep === 5 && <SetupCompleteStep />}
            </div>
          </div>

          <div className="space-y-6 pt-4">
            <div className="flex gap-4">
              {showBackButton && (
                <button
                  onClick={handleBack}
                  className="px-6 py-2.5 rounded-lg border border-wap-card-border hover:bg-slate-800/40 text-xs text-slate-300 font-bold transition-all duration-150 cursor-pointer"
                >
                  Back
                </button>
              )}
              <button
                type={currentStep === 3 ? 'submit' : 'button'}
                form={currentStep === 3 ? 'license-form' : undefined}
                onClick={currentStep !== 3 ? handleNext : undefined}
                className="px-6 py-2.5 rounded-lg bg-wap-blue hover:bg-wap-blue-hover text-xs text-white font-bold shadow-lg shadow-wap-blue/20 transition-all duration-150 cursor-pointer"
              >
                {currentStep === 5 ? 'Finish' : 'Next'}
              </button>
            </div>

            <div className="border-t border-wap-card-border/50 pt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-2.5 text-[11px] text-wap-text-secondary leading-relaxed max-w-xl">
                <Info className="h-4.5 w-4.5 text-wap-blue flex-shrink-0 mt-0.5" />
                <span>
                  After installation, the agent will automatically connect to your server. Make sure outbound connection to app.wapintellysys.com on port 443 is allowed.
                </span>
              </div>
              <a
                href="#"
                className="text-[11px] text-wap-blue hover:text-wap-sky transition-colors font-bold flex items-center gap-1 whitespace-nowrap"
              >
                Learn more about Agent
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        <SetupSidebar currentStep={currentStep} />
      </div>
    </div>
  );
}
