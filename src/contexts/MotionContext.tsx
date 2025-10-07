import { ReactNode, useMemo, createContext, useContext } from "react";
import { useReducedMotion, Variants, Transition } from "framer-motion";

type MotionContextValue = {
  pageVariants: Variants;
  pageTransition: Transition;
  childVariants: Variants;
  fadeVariants: Variants;
  floatTransition: Transition;
  shouldReduceMotion: boolean;
};

const MotionContext = createContext<MotionContextValue | undefined>(undefined);

interface MotionProviderProps {
  children: ReactNode;
}

export function MotionProvider({ children }: MotionProviderProps) {
  const shouldReduceMotion = useReducedMotion();

  const pageVariants = useMemo<Variants>(() => {
    if (shouldReduceMotion) {
      return {
        initial: { opacity: 0 },
        in: { opacity: 1 },
        out: { opacity: 0 }
      };
    }

    return {
      initial: {
        opacity: 0,
        y: 18,
        scale: 0.99,
        filter: "blur(3px)",
        rotateX: 2
      },
      in: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        rotateX: 0
      },
      out: {
        opacity: 0,
        y: -18,
        scale: 0.99,
        filter: "blur(3px)",
        rotateX: -2
      }
    };
  }, [shouldReduceMotion]);

  const pageTransition = useMemo<Transition>(() => {
    if (shouldReduceMotion) {
      return {
        duration: 0.25,
        ease: "easeInOut"
      };
    }

    return {
      type: "spring",
      damping: 24,
      stiffness: 320,
      mass: 0.9,
      when: "beforeChildren",
      bounce: 0.16
    };
  }, [shouldReduceMotion]);

  const childVariants = useMemo<Variants>(() => {
    if (shouldReduceMotion) {
      return {
        initial: { opacity: 0 },
        in: { opacity: 1 },
        out: { opacity: 0 }
      };
    }

    return {
      initial: {
        opacity: 0,
        y: 16,
        scale: 0.985
      },
      in: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          type: "spring",
          damping: 22,
          stiffness: 320,
          delay: 0.08
        }
      },
      out: {
        opacity: 0,
        y: -14,
        scale: 0.985
      }
    };
  }, [shouldReduceMotion]);

  const fadeVariants = useMemo<Variants>(() => (
    shouldReduceMotion
      ? {
          initial: { opacity: 0 },
          animate: { opacity: 1 }
        }
      : {
          initial: { opacity: 0, y: 10 },
          animate: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 240, damping: 24 }
          }
        }
  ), [shouldReduceMotion]);

  const floatTransition = useMemo<Transition>(() => (
    shouldReduceMotion
      ? { duration: 0 }
      : { duration: 7, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }
  ), [shouldReduceMotion]);

  const value = useMemo<MotionContextValue>(() => ({
    pageVariants,
    pageTransition,
    childVariants,
    fadeVariants,
    floatTransition,
    shouldReduceMotion
  }), [pageVariants, pageTransition, childVariants, fadeVariants, floatTransition, shouldReduceMotion]);

  return (
    <MotionContext.Provider value={value}>
      {children}
    </MotionContext.Provider>
  );
}

export function useMotionPresets() {
  const context = useContext(MotionContext);

  if (!context) {
    throw new Error("useMotionPresets must be used within a MotionProvider");
  }

  return context;
}
