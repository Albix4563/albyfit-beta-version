import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { ReactNode, CSSProperties } from "react";

interface LiquidGlassProps {
  children: ReactNode;
  className?: string;
  intensity?: "light" | "medium" | "heavy" | "mobile-nav";
  animated?: boolean;
  variant?: "default" | "card" | "surface" | "accent";
  size?: "sm" | "md" | "lg" | "xl";
  blurIntensity?: number;
  accentTone?: "cool" | "warm" | "neutral";
  radius?: "md" | "lg" | "xl";
  floatingParticles?: boolean;
  padding?: string;
}

export function LiquidGlass({
  children,
  className,
  intensity = "medium",
  animated = true,
  variant = "default",
  size = "md",
  blurIntensity,
  accentTone = "cool",
  radius,
  floatingParticles = true,
  padding
}: LiquidGlassProps) {
  const shouldReduceMotion = useReducedMotion();

  const intensityTokens = {
    light: {
      background: "rgba(15, 23, 42, 0.58)",
      border: "rgba(255, 255, 255, 0.16)",
      shadow: "0 12px 40px rgba(8, 15, 34, 0.35)",
      blur: 14,
      saturation: 140
    },
    medium: {
      background: "rgba(15, 23, 42, 0.78)",
      border: "rgba(255, 255, 255, 0.22)",
      shadow: "0 16px 48px rgba(5, 10, 30, 0.45)",
      blur: 20,
      saturation: 160
    },
    heavy: {
      background: "rgba(10, 15, 30, 0.88)",
      border: "rgba(255, 255, 255, 0.28)",
      shadow: "0 18px 56px rgba(2, 6, 20, 0.55)",
      blur: 26,
      saturation: 170
    },
    "mobile-nav": {
      background: "rgba(255, 255, 255, 0.16)",
      border: "rgba(255, 255, 255, 0.20)",
      shadow: "0 8px 24px rgba(0, 0, 0, 0.25)",
      blur: 10,
      saturation: 135
    }
  } as const;

  const variantTokens = {
    default: {
      from: "rgba(15, 23, 42, 0.92)",
      via: "rgba(30, 41, 59, 0.72)",
      to: "rgba(8, 16, 32, 0.88)"
    },
    card: {
      from: "rgba(30, 41, 59, 0.88)",
      via: "rgba(15, 23, 42, 0.80)",
      to: "rgba(2, 6, 23, 0.85)"
    },
    surface: {
      from: "rgba(255, 255, 255, 0.16)",
      via: "rgba(224, 232, 255, 0.08)",
      to: "rgba(255, 255, 255, 0.14)"
    },
    accent: {
      from: "rgba(37, 99, 235, 0.22)",
      via: "rgba(109, 40, 217, 0.20)",
      to: "rgba(12, 10, 30, 0.78)"
    }
  } as const;

  const accentToneTokens = {
    cool: {
      highlight: "rgba(125, 211, 252, 0.22)",
      glow: "rgba(56, 189, 248, 0.14)"
    },
    warm: {
      highlight: "rgba(251, 146, 60, 0.20)",
      glow: "rgba(249, 115, 22, 0.16)"
    },
    neutral: {
      highlight: "rgba(226, 232, 240, 0.16)",
      glow: "rgba(148, 163, 184, 0.12)"
    }
  } as const;

  const resolvedIntensity = intensityTokens[intensity];
  const resolvedVariant = variantTokens[variant];
  const resolvedAccentTone = accentToneTokens[accentTone];

  const resolvedBlur = blurIntensity ?? resolvedIntensity.blur;
  const isMobileNav = intensity === "mobile-nav";

  const baseRadiusBySize = {
    sm: "rounded-xl",
    md: "rounded-2xl",
    lg: "rounded-[28px]",
    xl: "rounded-[32px]"
  } as const;

  const radiusOverrides = {
    md: "rounded-2xl",
    lg: "rounded-[28px]",
    xl: "rounded-[32px]"
  } as const;

  const paddingBySize = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10"
  } as const;

  const resolvedRadius = radius ? radiusOverrides[radius] : baseRadiusBySize[size];
  const resolvedPadding = padding ?? paddingBySize[size];

  const styleVars: CSSProperties = isMobileNav
    ? {
        background: resolvedIntensity.background,
        backdropFilter: `blur(${resolvedBlur}px) saturate(${resolvedIntensity.saturation}%)`,
        WebkitBackdropFilter: `blur(${resolvedBlur}px) saturate(${resolvedIntensity.saturation}%)`,
        borderColor: resolvedIntensity.border,
        boxShadow: resolvedIntensity.shadow
      }
    : {
        "--glass-from": resolvedVariant.from,
        "--glass-via": resolvedVariant.via,
        "--glass-to": resolvedVariant.to,
        "--glass-highlight": resolvedAccentTone.highlight,
        "--glass-glow": resolvedAccentTone.glow,
        background: `linear-gradient(135deg, ${resolvedVariant.from}, ${resolvedVariant.via}, ${resolvedVariant.to})`,
        backdropFilter: `blur(${resolvedBlur}px) saturate(${resolvedIntensity.saturation}%)`,
        WebkitBackdropFilter: `blur(${resolvedBlur}px) saturate(${resolvedIntensity.saturation}%)`,
        borderColor: resolvedIntensity.border,
        boxShadow: resolvedIntensity.shadow
      };

  const shouldAnimate = animated && !shouldReduceMotion;
  const Component = shouldAnimate ? motion.div : "div";

  return (
    <Component
      className={cn(
        "relative overflow-hidden border transition-all duration-300 ease-out",
        resolvedRadius,
        resolvedPadding,
        "before:absolute before:inset-0 before:pointer-events-none",
        "before:opacity-50 before:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.25),transparent_55%)]",
        !isMobileNav && shouldAnimate && "hover:-translate-y-0.5 hover:shadow-[0_26px_65px_rgba(8,15,35,0.45)]",
        isMobileNav && "hover:bg-white/20",
        className
      )}
      style={styleVars}
      {...(shouldAnimate && !isMobileNav && {
        whileHover: { y: -3, scale: 1.005 },
        whileTap: { scale: 0.995 },
        transition: { type: "spring", stiffness: 320, damping: 26 }
      })}
    >
      {isMobileNav ? (
        <div className="absolute inset-0 opacity-8 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-300/8 via-transparent to-purple-300/8" />
        </div>
      ) : (
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <div
            className="absolute top-[-20%] right-[-10%] w-40 h-40 rounded-full blur-3xl"
            style={{
              background: resolvedAccentTone.highlight
            }}
          />
          <div
            className="absolute bottom-[-20%] left-[-5%] w-32 h-32 rounded-full blur-3xl"
            style={{
              background: resolvedAccentTone.glow
            }}
          />
        </div>
      )}

      <div className="relative z-10">
        {children}
      </div>

      {shouldAnimate && floatingParticles && isMobileNav && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(1)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-white/25 rounded-full"
              style={{
                left: `${50 + i * 15}%`,
                top: `${45 + i * 10}%`
              }}
              animate={{
                y: [0, -6, 0],
                opacity: [0.25, 0.45, 0.25],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: i * 1.2
              }}
            />
          ))}
        </div>
      )}

      {shouldAnimate && floatingParticles && !isMobileNav && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 rounded-full"
              style={{
                left: `${30 + i * 40}%`,
                top: `${40 + i * 20}%`,
                background: resolvedAccentTone.highlight
              }}
              animate={{
                y: [0, -8, 0],
                opacity: [0.35, 0.6, 0.35],
                scale: [1, 1.08, 1]
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.8
              }}
            />
          ))}
        </div>
      )}
    </Component>
  );
}