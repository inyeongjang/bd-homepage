import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "default" | "ghost";
type ButtonSize = "default" | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", type = "button", ...props }, ref) => {
    const base = "inline-flex items-center justify-center rounded-2xl font-semibold transition-all";
    const sizes = {
      default: "px-4 py-2 text-sm",
      icon: "h-10 w-10",
    };
    const variants = {
      default: "bg-white text-black hover:opacity-90",
      ghost: "bg-transparent text-white hover:bg-white/10",
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cx(base, sizes[size], variants[variant], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
