export const variantClasses = {
  neutral: "btn-neutral",
  primary: "btn-primary",
  secondary: "btn-secondary",
  accent: "btn-accent",
  error: "btn-error",
  warning: "btn-warning",
  info: "btn-info",
  success: "btn-success",
};

export const sizeClasses = {
  tiny: "btn-xs",
  small: "btn-sm",
  medium: "btn-md",
  large: "btn-lg",
};

export const shapeClasses = {
  square: "btn-square",
  circle: "btn-circle",
  wide: "btn-wide",
};

export interface BlButtonProps {
  size?: keyof typeof sizeClasses;
  shape?: keyof typeof shapeClasses;
  variant?: keyof typeof variantClasses;
  tag?: "button" | "link" | "a" | "div" | "details";
  to?: string;
};
