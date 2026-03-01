import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useOnboarding } from '../../hooks/useOnboarding';
import { OnboardingTour } from '../onboarding/OnboardingTour';
import { TOUR_STEPS } from '../../data/tourSteps';

export default function DashboardLayout() {
  const { showTour, currentStep, nextStep, prevStep, completeTour, restartTour } = useOnboarding();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar onRestartTour={restartTour} collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />
      <div className={`transition-all duration-200 ${sidebarCollapsed ? 'pl-16' : 'pl-64'}`}>
        <TopBar />
        <main className="content-area mx-auto max-w-[1280px] p-6">
          <Outlet />
        </main>
      </div>

      {showTour && (
        <OnboardingTour
          steps={TOUR_STEPS}
          currentStep={currentStep}
          onNext={nextStep}
          onPrev={prevStep}
          onSkip={completeTour}
        />
      )}
    </div>
  );
}
