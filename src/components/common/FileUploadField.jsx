import { UploadCloud } from 'lucide-react';
import { cn } from '@/utils/cn';
import './FileUploadField.css';

export function FileUploadField({ label, helper, error, className, fileName, ...props }) {
  return (
    <label className="flex w-full cursor-pointer flex-col gap-2">
      <span className="text-sm font-bold text-white/70 ml-1">{label}</span>
      <div className={cn('drop-zone flex min-h-[130px] flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-white/10 bg-white/5 px-4 py-6 transition-all duration-300 hover:bg-white/10 hover:border-orange-500/50', className)}>
        <UploadCloud className="mb-3 h-8 w-8 text-white/20 transition-colors group-hover:text-orange-500" />
        <span className="text-sm font-bold text-white">{fileName || 'Choose a file to upload'}</span>
        <span className="mt-1 text-xs font-medium text-white/40">{helper}</span>
      </div>
      <input className="hidden" type="file" {...props} />
      {error && <span className="text-xs font-bold text-red-400 ml-1 mt-1">{error}</span>}
    </label>
  );
}