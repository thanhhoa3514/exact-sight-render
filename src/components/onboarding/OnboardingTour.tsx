import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TourStep } from '../../data/tourSteps'
import { SpotlightOverlay } from '../shared/SpotlightOverlay'
import { TourModal } from './TourModal'
import type { OnboardingTourProps } from './onboarding.types'

interface TooltipPosition {
  top: number
  left: number
}

const MODAL_WIDTH = 480
const GAP = 20 // gap between spotlight and modal

/**
 * Dynamically compute the tooltip position based on the target element's
 * bounding rect and the preferred position from the step config.
 * Falls back to centered if no target is found.
 */
function computePosition(
  step: TourStep,
  targetRect: DOMRect | null
): TooltipPosition | null {
  if (!targetRect) return null

  const pos = step.position ?? 'right'
  const vw = window.innerWidth
  const vh = window.innerHeight

  let top: number
  let left: number

  switch (pos) {
    case 'right':
      // Vertically center with the target, horizontally to its right
      top = targetRect.top + targetRect.height / 2
      left = targetRect.right + GAP
      // If overflowing right, flip to left
      if (left + MODAL_WIDTH > vw - GAP) {
        left = targetRect.left - MODAL_WIDTH - GAP
      }
      break

    case 'left':
      top = targetRect.top + targetRect.height / 2
      left = targetRect.left - MODAL_WIDTH - GAP
      // If overflowing left, flip to right
      if (left < GAP) {
        left = targetRect.right + GAP
      }
      break

    case 'bottom':
      top = targetRect.bottom + GAP
      left = targetRect.left + targetRect.width / 2 - MODAL_WIDTH / 2
      break

    case 'top':
      // We estimate ~350px for modal height, adjust as needed
      top = targetRect.top - GAP - 350
      left = targetRect.left + targetRect.width / 2 - MODAL_WIDTH / 2
      break

    default:
      top = targetRect.top + targetRect.height / 2
      left = targetRect.right + GAP
  }

  // Clamp horizontal position so the modal stays within viewport
  left = Math.max(GAP, Math.min(left, vw - MODAL_WIDTH - GAP))

  // Clamp vertical position (don't let it go off screen)
  top = Math.max(GAP, Math.min(top, vh - GAP))

  return { top, left }
}

export function OnboardingTour({ steps, currentStep, onNext, onPrev, onSkip }: OnboardingTourProps) {
  const step = steps[currentStep]
  const progress = ((currentStep) / (steps.length - 1)) * 100

  const [tooltipPos, setTooltipPos] = useState<TooltipPosition | null>(null)

  const recalculate = useCallback(() => {
    if (step.type === 'spotlight' && step.target) {
      // Small delay so SpotlightOverlay can render and DOM settles
      const timer = setTimeout(() => {
        const el = document.querySelector(step.target!)
        if (el) {
          const rect = el.getBoundingClientRect()
          setTooltipPos(computePosition(step, rect))
        }
      }, 150)
      return () => clearTimeout(timer)
    } else {
      setTooltipPos(null)
    }
  }, [step])

  useEffect(() => {
    const cleanup = recalculate()

    // Also recalculate on window resize
    const onResize = () => recalculate()
    window.addEventListener('resize', onResize)
    return () => {
      cleanup?.()
      window.removeEventListener('resize', onResize)
    }
  }, [recalculate])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') onNext()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'Escape') onSkip()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onNext, onPrev, onSkip])

  // Determine if modal should be centered (welcome, finish, center, or no target found for spotlight)
  const isCentered = step.type !== 'spotlight' || !tooltipPos

  // For 'right'/'left' positions, we vertically translate by -50% to align mid-point
  const shouldVerticalCenter = step.position === 'right' || step.position === 'left' || !step.position
  const isSpotlight = step.type === 'spotlight' && !!step.target

  return (
    <AnimatePresence mode="wait">
      {/* ── BACKDROP (only for non-spotlight steps — spotlight has its own overlay) ── */}
      {!isSpotlight && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100]"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }}
          onClick={onSkip}
        />
      )}

      {/* ── SPOTLIGHT CUTOUT (handles its own dimming + cutout hole) ── */}
      {isSpotlight && (
        <SpotlightOverlay targetSelector={step.target!} onBackdropClick={onSkip} />
      )}

      {/* ── MODAL / TOOLTIP ── */}
      <motion.div
        key={step.id}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 30,
          mass: 0.8,
        }}
        className={`fixed z-[102] pointer-events-auto ${isCentered ? 'max-h-[85vh] overflow-y-auto' : ''}`}
        style={
          isCentered
            ? {
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }
            : {
              top: tooltipPos!.top,
              left: tooltipPos!.left,
              transform: shouldVerticalCenter ? 'translateY(-50%)' : undefined,
            }
        }
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
