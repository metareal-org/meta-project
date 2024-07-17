import * as React from "react";
import cn from "classnames";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  intOnly?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, intOnly, onChange, ...props }, ref) => {
    const handleChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        if (intOnly) {
          const value = event.target.value;
          if (value === '' || /^[0-9]+$/.test(value)) {
            onChange?.(event);
          }
        } else {
          onChange?.(event);
        }
      },
      [intOnly, onChange]
    );

    return (
      <input
        type={intOnly ? "text" : type}
        inputMode={intOnly ? "numeric" : undefined}
        pattern={intOnly ? "[0-9]*" : undefined}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-black-100/5 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-black-100/5 file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };