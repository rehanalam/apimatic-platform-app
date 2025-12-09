import * as React from 'react'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const textVariants = cva('font-normal', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl',
    },
    variant: {
      primary: 'text-foreground',
      secondary: 'text-muted-foreground',
      danger: 'text-destructive',
      success: 'text-green-600 dark:text-green-500',
      warning: 'text-yellow-600 dark:text-yellow-500',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
  },
  defaultVariants: {
    size: 'base',
    variant: 'primary',
    weight: 'normal',
  },
})

export interface TextProps
  extends
    React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  as?: 'p' | 'span' | 'div' | 'label'
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  (
    { className, size, variant, weight, as: Component = 'p', ...props },
    ref,
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(textVariants({ size, variant, weight, className }))}
        {...props}
      />
    )
  },
)

Text.displayName = 'Text'

export { Text, textVariants }
