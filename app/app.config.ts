export default defineAppConfig({
  nuxtIcon: {
    size: "24px",
  },
  ui: {
    tabs: {
      wrapper: "relative",
      container: "relative w-full",
      base: "focus:outline-none",
      list: {
        base: "relative border-b px-1",
        background: "bg-base-300",
        rounded: "",
        shadow: "",
        padding: "",
        height: "h-10",
        width: "w-full",
        marker: {
          wrapper:
            "absolute top-[4px] left-[4px] duration-200 ease-out focus:outline-none",
          base: "w-full h-full",
          background: "",
          rounded: "",
          shadow: "shadow-sm",
        },
        tab: {
          base: "!text-base-content relative inline-flex items-center justify-center flex-shrink-0 w-full ui-focus-visible:outline-0 ui-focus-visible:ring-2 ui-focus-visible:ring-primary-500 dark:ui-focus-visible:ring-primary-400 ui-not-focus-visible:outline-none focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 transition-colors duration-200 ease-out",
          background: "",
          active: "bg-base-100 h-[72%] rounded",
          inactive: "bg-base-300 h-full",
          height: "",
          padding: "px-6",
          size: "text-sm",
          font: "font-medium",
          rounded: "",
          shadow: "",
        },
      },
    },
  },
});
