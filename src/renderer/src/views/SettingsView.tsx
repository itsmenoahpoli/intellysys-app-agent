import { useNavigate } from 'react-router-dom';
import { SettingsHeader, SettingsForm } from '@components';
import { useAppStore } from '@renderer/store/useAppStore';

export default function SettingsView(): JSX.Element {
  const navigate = useNavigate();
  const { showToast } = useAppStore();

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleSave = () => {
    showToast('Settings saved successfully!', 'success');
    navigate('/dashboard');
  };

  return (
    <div className="flex-1 flex flex-col px-8 md:px-16 lg:px-24 py-8 z-10 overflow-y-auto w-full space-y-6">
      <SettingsHeader onBack={handleBack} />
      <SettingsForm onSave={handleSave} onCancel={handleBack} />
    </div>
  );
}
