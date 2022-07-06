import setupStepCheck from '@/utils/setupStepCheck';
import LoadingDots from '@/components/ui/LoadingDots'; 

export default function SetupPage() {
  setupStepCheck();

  return (
    <div className="pt-12 wrapper">
      <LoadingDots/>
    </div>
  );
}