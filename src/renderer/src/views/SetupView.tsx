import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Info, ExternalLink } from 'lucide-react';
import { useAppStore } from '@renderer/store/useAppStore';
import { getAgentIdentity, registerAgent } from '@renderer/services/agent-registration';
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
  const {
    serverUrl,
    showToast,
    setAgentIdentifier,
    setupStep,
    setSetupStep,
    licenseKey: storedLicenseKey,
    setLicenseKey: setStoredLicenseKey,
  } = useAppStore();
  const currentStep = setupStep;
  const licenseKey = storedLicenseKey || '';
  const [activeTab, setActiveTab] = useState('Installation');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLicenseStepValid, setIsLicenseStepValid] = useState(false);
  const [isLicenseStepChecking, setIsLicenseStepChecking] = useState(false);
  const [configureMetrics, setConfigureMetrics] = useState<SystemMetrics | null>(null);

  const handleLicenseValidationStateChange = useCallback(
    ({ isValid, isChecking }: { isValid: boolean; isChecking: boolean }) => {
      setIsLicenseStepValid(isValid);
      setIsLicenseStepChecking(isChecking);
    },
    []
  );

  const formatLicenseKey = (value: string): string => {
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const truncated = cleaned.slice(0, 32);
    const matches = truncated.match(/.{1,4}/g);
    return matches ? matches.join('-') : truncated;
  };

  const handleNext = async () => {
    if (currentStep === 5) {
      if (!licenseKey) {
        showToast('Please validate a license key first', 'error');
        return;
      }

      setIsRegistering(true);
      try {
        const identity = await getAgentIdentity();
        await registerAgent({
          serverUrl,
          licenseCode: licenseKey,
          identity,
        });
        setAgentIdentifier(identity.identifier);
      } catch (err: any) {
        showToast(err?.message || 'Failed to register agent app', 'error');
        setIsRegistering(false);
        return;
      }
      setIsRegistering(false);
      navigate('/dashboard');
      return;
    }

    if (currentStep < 5) {
      setSetupStep(currentStep + 1);
      return;
    }
  };

  const handleBack = () => {
    if (currentStep > 3) {
      setSetupStep(currentStep - 1);
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
                  setLicenseKey={(value) => setStoredLicenseKey(value)}
                  formatLicenseKey={formatLicenseKey}
                  onValidSubmit={handleNext}
                  onValidationStateChange={handleLicenseValidationStateChange}
                />
              )}

              {currentStep === 4 && <SetupConfigureStep onMetricsChange={setConfigureMetrics} />}

              {currentStep === 5 && (
                <SetupCompleteStep
                  licenseKey={licenseKey}
                  serverUrl={serverUrl}
                  metrics={configureMetrics}
                />
              )}
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
                onClick={currentStep !== 3 ? () => void handleNext() : undefined}
                disabled={
                  isRegistering ||
                  (currentStep === 3 &&
                    (!licenseKey.trim() || !isLicenseStepValid || isLicenseStepChecking))
                }
                className="px-6 py-2.5 rounded-lg bg-wap-blue hover:bg-wap-blue-hover disabled:bg-wap-blue/40 disabled:text-white/70 text-xs text-white font-bold shadow-lg shadow-wap-blue/20 disabled:shadow-none transition-all duration-150 cursor-pointer disabled:cursor-not-allowed"
              >
                {isRegistering
                  ? 'Saving...'
                  : currentStep === 3 && isLicenseStepChecking
                    ? 'Validating...'
                    : currentStep === 5
                      ? 'Confirm & Launch'
                      : 'Next'}
              </button>
            </div>

            <div className="border-t border-wap-card-border/50 pt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-2.5 text-[11px] text-wap-text-secondary leading-relaxed max-w-xl">
                <Info className="h-4.5 w-4.5 text-wap-blue shrink-0 mt-0.5" />
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
