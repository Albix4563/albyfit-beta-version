import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./contexts/ThemeContext";

const queryClient = new QueryClient();

// Varianti per le transizioni di pagina ultra-fluide
const pageVariants: Variants = {
  initial: {
    opacity: 0,
    x: 30,
    scale: 0.96,
    filter: "blur(4px)",
    rotateY: 3
  },
  in: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
    rotateY: 0
  },
  out: {
    opacity: 0,
    x: -30,
    scale: 0.96,
    filter: "blur(4px)",
    rotateY: -3
  }
};

// Transizione spring ultra-fluida per 60fps
const pageTransition = {
  type: "spring" as const,
  damping: 25,
  stiffness: 300,
  mass: 0.8,
  when: "beforeChildren" as const,
  staggerChildren: 0.1
};

// Varianti per gli elementi della pagina
const childVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
      delay: 0.1
    }
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 0.95
  }
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const reducedMotionTransition = {
    duration: shouldReduceMotion ? 0.2 : 0.6,
    ease: "easeInOut" as const
  };

  const finalTransition = shouldReduceMotion ? reducedMotionTransition : pageTransition;
  const finalVariants = shouldReduceMotion ? {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 }
  } : pageVariants;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/" 
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={finalVariants}
              transition={finalTransition}
              style={{
                position: "relative",
                width: "100%",
                minHeight: "100vh",
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
                willChange: "transform, opacity, filter"
              }}
            >
              <motion.div variants={childVariants}>
                <Index />
              </motion.div>
            </motion.div>
          } 
        />
        <Route 
          path="*" 
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={finalVariants}
              transition={finalTransition}
              style={{
                position: "relative",
                width: "100%",
                minHeight: "100vh",
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
                willChange: "transform, opacity, filter"
              }}
            >
              <motion.div variants={childVariants}>
                <NotFound />
              </motion.div>
            </motion.div>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              minHeight: "100vh",
              overflow: "hidden"
            }}
          >
            <AnimatedRoutes />
          </motion.div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;