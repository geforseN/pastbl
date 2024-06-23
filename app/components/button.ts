export const sizeStyles = {
  xs: {
    btn: "btn-xs",
    icon: "18",
    iconClass: "min-w-[18px]",
  },
  sm: {
    btn: "btn-sm",
    icon: "20",
    iconClass: "min-w-5",
  },
} as const;

export type ButtonSize = keyof typeof sizeStyles;
