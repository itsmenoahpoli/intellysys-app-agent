import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Activity, Bell, Eye, Sliders, Save } from "lucide-react";

interface SettingsFormProps {
  onSave: () => void;
  onCancel: () => void;
}

const settingsSchema = z.object({
  autoReport: z.boolean(),
  alertUnknown: z.boolean(),
  deepInspect: z.boolean(),
  reportSpeed: z.enum(["4s", "8s", "15s", "30s"]),
});

type SettingsSchemaType = z.infer<typeof settingsSchema>;

export function SettingsForm({ onSave, onCancel }: SettingsFormProps): JSX.Element {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
  } = useForm<SettingsSchemaType>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      autoReport: true,
      alertUnknown: true,
      deepInspect: false,
      reportSpeed: "8s",
    },
  });

  const watchedAutoReport = watch("autoReport");
  const watchedAlertUnknown = watch("alertUnknown");
  const watchedDeepInspect = watch("deepInspect");

  const onSubmit = () => {
    onSave();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl bg-wap-card border border-wap-card-border rounded-xl p-6 shadow-xl space-y-6 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-wap-blue to-transparent" />

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-wap-card-border/50 pb-4">
          <div className="flex gap-3">
            <Activity className="h-5 w-5 text-wap-blue mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide">
                Auto-Report System Metrics
              </h4>
              <p className="text-xs text-wap-text-secondary mt-0.5">
                Periodically dispatch local device load states to console
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={watchedAutoReport}
              onChange={(e) => setValue("autoReport", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-wap-input peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-wap-blue peer-checked:after:bg-white" />
          </label>
        </div>

        <div className="flex items-center justify-between border-b border-wap-card-border/50 pb-4">
          <div className="flex gap-3">
            <Bell className="h-5 w-5 text-wap-sky mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide">
                Alert on Unknown Process Thread
              </h4>
              <p className="text-xs text-wap-text-secondary mt-0.5">
                Trigger notification triggers when unrecognized signatures launch
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={watchedAlertUnknown}
              onChange={(e) => setValue("alertUnknown", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-wap-input peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-wap-blue peer-checked:after:bg-white" />
          </label>
        </div>

        <div className="flex items-center justify-between border-b border-wap-card-border/50 pb-4">
          <div className="flex gap-3">
            <Eye className="h-5 w-5 text-wap-purple mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide">
                Deep Inspect Packet Payload
              </h4>
              <p className="text-xs text-wap-text-secondary mt-0.5">
                Conduct intensive analysis of local host adapter headers
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={watchedDeepInspect}
              onChange={(e) => setValue("deepInspect", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-wap-input peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-wap-blue peer-checked:after:bg-white" />
          </label>
        </div>

        <div className="flex items-center justify-between pb-2">
          <div className="flex gap-3">
            <Sliders className="h-5 w-5 text-wap-amber mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide">
                Telemetry Polling Interval
              </h4>
              <p className="text-xs text-wap-text-secondary mt-0.5">
                Determine how frequently state metrics synchronize
              </p>
            </div>
          </div>
          <select
            {...register("reportSpeed")}
            className="bg-wap-input border border-wap-input-border text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="4s">High Frequency (4s)</option>
            <option value="8s">Standard Loop (8s)</option>
            <option value="15s">Conservative (15s)</option>
            <option value="30s">Low Impact (30s)</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-wap-card-border">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-wap-card-border hover:bg-slate-800/40 text-xs text-slate-300 font-semibold transition-colors duration-150 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-wap-blue hover:bg-wap-blue-hover text-xs text-white font-semibold shadow-lg shadow-wap-blue/20 transition-all duration-150 cursor-pointer"
        >
          <Save className="h-4 w-4" />
          Save Preferences
        </button>
      </div>
    </form>
  );
}
