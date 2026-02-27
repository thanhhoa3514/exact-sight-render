import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TourStep } from '../../data/tourSteps'
import { SpotlightOverlay } from '../shared/SpotlightOverlay'
import { TourModal } from './TourModal'
import type { OnboardingTourProps } from './onboarding.types'

function getModalPosition(step: TourStep): string {
  const base = "fixed z-[102] pointer-events-auto"

  if (step.type === 'welcome' || step.type === 'finish' || step.type === 'center') {
    // Căn giữa màn hình
    return `${base} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`
  }

  if (step.type === 'spotlight') {
    // Đặt cạnh sidebar (vì target thường là nav items)
    // Sidebar width is 256px, plus some padding
    return `${base} top-1/2 left-[280px] -translate-y-1/2`
  }

  return `${base} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`
}

export function OnboardingTour({ steps, currentStep, onNext, onPrev, onSkip }: OnboardingTourProps) {
  const step = steps[currentStep]
  const progress = ((currentStep) / (steps.length - 1)) * 100

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') onNext()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'Escape') onSkip()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onNext, onPrev, onSkip])

  return (
    <AnimatePresence mode="wait">
      {/* ── BACKDROP ── */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100]"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }}
        onClick={onSkip}
      />

      {/* ── SPOTLIGHT CUTOUT (cho type === 'spotlight') ── */}
      {step.type === 'spotlight' && step.target && (
        <SpotlightOverlay targetSelector={step.target} />
      )}

      {/* ── MODAL / TOOLTIP ── */}
      <motion.div
        key={step.id}
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -8 }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 30,
          mass: 0.8,
        }}
        className={getModalPosition(step)}
      >
        <TourModal
          step={step}
          currentIndex={currentStep}
          totalSteps={steps.length}
          progress={progress}
          onNext={onNext}
          onPrev={onPrev}
          onSkip={onSkip}
        />
      </motion.div>
    </AnimatePresence>
  )
}
