import type { TourStep } from '../../data/tourSteps'

// Re-export for convenience
export type { TourStep }

/** Shortcut entry used in keyboard-shortcuts tour step */
export interface TourShortcut {
    keys: string[]
    desc: string
}

/** Props for the TourMediaContent component */
export interface TourMediaContentProps {
    type: string
}

/** Props for the TourModal component */
export interface TourModalProps {
    step: TourStep
    currentIndex: number
    totalSteps: number
    progress: number
    onNext: () => void
    onPrev: () => void
    onSkip: () => void
}

/** Props for the exported OnboardingTour component */
export interface OnboardingTourProps {
    steps: TourStep[]
    currentStep: number
    onNext: () => void
    onPrev: () => void
    onSkip: () => void
}

/** Props for the SpotlightOverlay component */
export interface SpotlightOverlayProps {
    targetSelector: string
}

/** Return type for the useOnboarding hook */
export interface UseOnboardingReturn {
    showTour: boolean
    currentStep: number
    nextStep: () => void
    prevStep: () => void
    completeTour: () => void
    restartTour: () => void
    completed: boolean
}
