import * as React from 'react'
import { useForm } from '@tanstack/react-form'
import type {
  CheckboxFieldProps,
  NumberFieldProps,
  SelectFieldProps,
  TextAreaFieldProps,
  TextFieldProps,
} from '@/client/components/formField'
import { Button } from '@/client/components/ui/button'
import { FormFieldComponents } from '@/client/components/formField'

// Re-export field components for backward compatibility
export const fieldComponents = FormFieldComponents

// Form configuration interface
// Note: Validators accept Zod schemas directly (Zod v4+ supports Standard Schema spec)
export interface AppFormConfig<TFormData extends Record<string, unknown>> {
  defaultValues: TFormData
  onSubmit: (values: TFormData) => void | Promise<void>
  validators?: {
    onChange?: unknown
    onBlur?: unknown
    onSubmit?: unknown
  }
}

// Create strongly typed form hook
export function createAppForm<TFormData extends Record<string, unknown>>(
  config: AppFormConfig<TFormData>,
) {
  const form = useForm({
    defaultValues: config.defaultValues,
    onSubmit: async ({ value }) => {
      await config.onSubmit(value)
    },
    // Type assertion needed because Zod v4 schemas implement Standard Schema spec
    // but TypeScript can't infer this automatically
    validators: config.validators as any,
  })

  // Create AppField component bound to this form
  const AppField = <TName extends keyof TFormData>({
    name,
    children,
  }: {
    name: TName
    children: (field: any) => React.ReactElement
  }) => {
    return (
      <form.Field
        name={name as string}
        children={(field: any) => {
          // Attach field components to the field
          const fieldWithComponents = Object.assign(field, fieldComponents)
          return children(fieldWithComponents)
        }}
      />
    )
  }

  // Create AppForm component for form-level components
  const AppForm = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>
  }

  // Submit button component
  const SubmitButton = ({
    children = 'Submit',
    className,
    ...props
  }: React.ComponentProps<typeof Button>) => {
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [canSubmit, setCanSubmit] = React.useState(true)

    React.useEffect(() => {
      const unsubscribe = form.store.subscribe(() => {
        setIsSubmitting(form.state.isSubmitting)
        setCanSubmit(form.state.canSubmit)
      })
      return unsubscribe
    }, [])

    return (
      <Button
        type="submit"
        disabled={!canSubmit || isSubmitting}
        className={className}
        {...props}
      >
        {isSubmitting ? 'Submitting...' : children}
      </Button>
    )
  }

  // Reset button component
  const ResetButton = ({
    children = 'Reset',
    className,
    ...props
  }: React.ComponentProps<typeof Button>) => {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={() => form.reset()}
        className={className}
        {...props}
      >
        {children}
      </Button>
    )
  }

  return {
    ...form,
    AppField,
    AppForm,
    SubmitButton,
    ResetButton,
  }
}

// Export types for external use (re-exported from formField)
export type {
  TextFieldProps,
  NumberFieldProps,
  TextAreaFieldProps,
  SelectFieldProps,
  CheckboxFieldProps,
}
