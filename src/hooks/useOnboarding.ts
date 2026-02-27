import { useState, useEffect } from 'react'
import { TOUR_STEPS } from '../data/tourSteps'
import type { UseOnboardingReturn } from '../components/onboarding/onboarding.types'

export function useOnboarding(): UseOnboardingReturn {
  const [showTour, setShowTour] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    // Kiểm tra localStorage — chỉ hiện lần đầu
    const isDone = localStorage.getItem('lvtn_onboarding_done')
    if (!isDone) {
      // Delay 800ms sau khi login để dashboard load xong rồi mới hiện
      const timer = setTimeout(() => setShowTour(true), 800)
      return () => clearTimeout(timer)
    }
  }, [])

  const nextStep = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(s => s + 1)
    } else {
      completeTour()
    }
  }

  const prevStep = () => setCurrentStep(s => Math.max(0, s - 1))

  const completeTour = () => {
    localStorage.setItem('lvtn_onboarding_done', 'true')
    setShowTour(false)
    setCompleted(true)
  }

  const restartTour = () => {
    localStorage.removeItem('lvtn_onboarding_done')
    setCurrentStep(0)
    setShowTour(true)
  }

  return { showTour, currentStep, nextStep, prevStep, completeTour, restartTour, completed }
}
