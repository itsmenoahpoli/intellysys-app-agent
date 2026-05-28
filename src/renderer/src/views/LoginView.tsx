import { useNavigate } from "react-router-dom";
import { LoginHeader, LoginForm } from "@components";
import { useAppStore } from "@renderer/store/useAppStore";

export default function LoginView(): JSX.Element {
  const navigate = useNavigate();
  const { setupStep } = useAppStore();

  const handleSuccess = () => {
    navigate(setupStep >= 5 ? "/dashboard" : "/setup");
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row items-center justify-between px-8 md:px-16 lg:px-24 py-6 z-10 overflow-y-auto w-full">
      <LoginHeader />
      <LoginForm onSuccess={handleSuccess} />
    </div>
  );
}
