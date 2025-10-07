import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./contexts/ThemeContext";
import { MotionProvider, useMotionPresets } from "./contexts/MotionContext";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  const { pageVariants, pageTransition, childVariants, shouldReduceMotion } = useMotionPresets();

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
              variants={pageVariants}
              transition={pageTransition}
              style={{
                position: "relative",
                width: "100%",
                minHeight: "100vh",
                willChange: "transform, opacity, filter",
                transformStyle: shouldReduceMotion ? "flat" : "preserve-3d",
                translateZ: 0
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
              variants={pageVariants}
              transition={pageTransition}
              style={{
                position: "relative",
                width: "100%",
                minHeight: "100vh",
                willChange: "transform, opacity, filter",
                transformStyle: shouldReduceMotion ? "flat" : "preserve-3d",
                translateZ: 0
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
      <MotionProvider>
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
                overflow: "hidden",
                translateZ: 0
              }}
            >
              <AnimatedRoutes />
            </motion.div>
          </BrowserRouter>
        </TooltipProvider>
      </MotionProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;