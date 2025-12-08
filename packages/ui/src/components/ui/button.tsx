import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { SyncLoader } from 'react-spinners'

import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      loadingText,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'

    // Determine loader color based on variant
    const getLoaderColor = () => {
      switch (variant) {
        case 'destructive':
          return 'hsl(var(--destructive-foreground))'
        case 'default':
          return 'hsl(var(--primary-foreground))'
        case 'secondary':
          return 'hsl(var(--secondary-foreground))'
        case 'link':
          return 'hsl(var(--primary))'
        default:
          return 'hsl(var(--foreground))'
      }
    }

    // Determine loader size based on button size
    const getLoaderSize = () => {
      switch (size) {
        case 'sm':
          return 4
        case 'lg':
          return 7
        case 'icon':
          return 5
        default:
          return 6
      }
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        aria-live={isLoading ? 'polite' : undefined}
        {...props}
      >
        {isLoading ? (
          <span className="relative flex items-center justify-center gap-2">
            <SyncLoader
              speedMultiplier={0.7}
              color={getLoaderColor()}
              size={getLoaderSize()}
              margin={2}
              aria-label="Loading Spinner"
              data-testid="button-loader"
            />
            {loadingText && <span className="ml-2">{loadingText}</span>}
            {!loadingText && <span className="sr-only">Loading...</span>}
          </span>
        ) : (
          children
        )}
      </Comp>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
