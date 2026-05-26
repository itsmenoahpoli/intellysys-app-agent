import { useNavigate } from 'react-router-dom';
import { SettingsHeader, SettingsForm } from '@components';

export default function SettingsView(): JSX.Element {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex-1 flex flex-col px-8 md:px-16 lg:px-24 py-8 z-10 overflow-y-auto w-full space-y-6">
      <SettingsHeader onBack={handleBack} />
      <SettingsForm onSave={handleBack} onCancel={handleBack} />
    </div>
  );
}
