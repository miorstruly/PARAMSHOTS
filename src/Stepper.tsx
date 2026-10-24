import React, {
  useState,
  Children,
  useRef,
  useLayoutEffect,
  HTMLAttributes,
  ReactNode,
} from "react";
import { motion, AnimatePresence, Variants } from "motion/react";

/* ---------- Stepper ---------- */

interface StepperProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  children: ReactNode;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  backButtonText?: string;
  nextButtonText?: string;
  finalButtonText?: string;
}

export default function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  backButtonText = "Back",
  nextButtonText = "Next",
  finalButtonText = "Complete",
  ...rest
}: StepperProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState(0); // 1 = forward, -1 = backward

  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isLastStep = currentStep === totalSteps;

  const updateStep = (step: number) => {
    setCurrentStep(step);
    onStepChange(step);
  };

  const goTo = (step: number) => {
    if (step === currentStep) return;
    setDirection(step > currentStep ? 1 : -1);
    updateStep(step);
  };

  const handleBack = () => {
    if (currentStep > 1) goTo(currentStep - 1);
  };

  const handleNext = () => {
    if (!isLastStep) goTo(currentStep + 1);
    else onFinalStepCompleted();
  };

  return (
    <div className="mx-auto w-full max-w-3xl" {...rest}>
      <div className="overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-white/20 sm:min-h-[26rem]">
        {/* Indicators */}
        <div className="flex items-center px-6 pt-10 sm:px-12 sm:pt-12">
          {stepsArray.map((_, index) => {
            const stepNumber = index + 1;
            return (
              <React.Fragment key={stepNumber}>
                <StepIndicator
                  step={stepNumber}
                  currentStep={currentStep}
                  onClick={() => goTo(stepNumber)}
                />
                {index < totalSteps - 1 && (
                  <StepConnector isComplete={currentStep > stepNumber} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Sliding content */}
        <StepContentWrapper currentStep={currentStep} direction={direction}>
          {stepsArray[currentStep - 1]}
        </StepContentWrapper>

        {/* Footer buttons */}
        <div
          className={`flex px-6 pb-10 sm:px-12 sm:pb-12 ${
            currentStep !== 1 ? "justify-between" : "justify-end"
          }`}
        >
          {currentStep !== 1 && (
            <button
              onClick={handleBack}
              className="rounded-xl px-5 py-3 text-base font-semibold text-gray-500 transition hover:text-[#7A0000]"
            >
              {backButtonText}
            </button>
          )}
          <button
            onClick={handleNext}
            className="rounded-xl bg-[#7A0000] px-8 py-3 text-base font-semibold text-white transition hover:bg-[#5a0000] active:scale-95"
          >
            {isLastStep ? finalButtonText : nextButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Content wrapper (animated height + slide) ---------- */

function StepContentWrapper({
  currentStep,
  direction,
  children,
}: {
  currentStep: number;
  direction: number;
  children: ReactNode;
}) {
  const [parentHeight, setParentHeight] = useState(0);

  return (
    <motion.div
      style={{ position: "relative", overflow: "hidden" }}
      animate={{ height: parentHeight }}
      transition={{ type: "spring", duration: 0.4 }}
    >
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        <SlideTransition
          key={currentStep}
          direction={direction}
          onHeightReady={(h) => setParentHeight(h)}
        >
          {children}
        </SlideTransition>
      </AnimatePresence>
    </motion.div>
  );
}

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction >= 0 ? "-100%" : "100%",
    opacity: 0,
  }),
  center: { x: "0%", opacity: 1 },
  exit: (direction: number) => ({
    x: direction >= 0 ? "50%" : "-50%",
    opacity: 0,
  }),
};

function SlideTransition({
  children,
  direction,
  onHeightReady,
}: {
  children: ReactNode;
  direction: number;
  onHeightReady: (height: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (containerRef.current) onHeightReady(containerRef.current.offsetHeight);
  }, [children, onHeightReady]);

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4 }}
      style={{ position: "absolute", left: 0, right: 0, top: 0 }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Step wrapper ---------- */

export function Step({ children }: { children: ReactNode }) {
  return <div className="px-6 py-10 sm:px-12 sm:py-12">{children}</div>;
}

/* ---------- Indicator + connector ---------- */

function StepIndicator({
  step,
  currentStep,
  onClick,
}: {
  step: number;
  currentStep: number;
  onClick: () => void;
}) {
  const status =
    currentStep === step ? "active" : currentStep < step ? "inactive" : "complete";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={`Go to step ${step}`}
      initial={false}
      animate={status}
      variants={{
        inactive: {
          backgroundColor: "#e5e7eb",
          color: "#6b7280",
          boxShadow: "0 0 0 0px rgba(122,0,0,0)",
        },
        active: {
          backgroundColor: "#7A0000",
          color: "#ffffff",
          boxShadow: "0 0 0 5px rgba(122,0,0,0.18)",
        },
        complete: {
          backgroundColor: "#7A0000",
          color: "#ffffff",
          boxShadow: "0 0 0 0px rgba(122,0,0,0)",
        },
      }}
      transition={{ duration: 0.3 }}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold sm:h-12 sm:w-12 sm:text-base"
    >
      {status === "complete" ? <CheckIcon /> : <span>{step}</span>}
    </motion.button>
  );
}

function StepConnector({ isComplete }: { isComplete: boolean }) {
  return (
    <div className="relative mx-2 h-1 flex-1 sm:mx-3 overflow-hidden rounded bg-gray-200">
      <motion.div
        className="absolute inset-y-0 left-0 bg-[#7A0000]"
        initial={false}
        animate={{ width: isComplete ? "100%" : "0%" }}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      viewBox="0 0 24 24"
    >
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.1, type: "tween", ease: "easeOut", duration: 0.3 }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
