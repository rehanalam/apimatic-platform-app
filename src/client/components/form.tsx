import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import type {
  CheckboxFieldProps,
  NumberFieldProps,
  SelectFieldProps,
  TextAreaFieldProps,
  TextFieldProps,
} from '@/client/components/formField';
import { Button } from '@/client/components/ui/button';
import { FormFieldComponents } from '@/client/components/formField';

export const fieldComponents = FormFieldComponents;

export interface AppFormConfig<TFormData> {
  defaultValues: TFormData;
  onSubmit: (values: TFormData) => void | Promise<void>;
  validators?: {
    onChange?: unknown;
    onBlur?: unknown;
    onSubmit?: unknown;
  };
}

export function createAppForm<TFormData>(config: AppFormConfig<TFormData>) {
  const form = useForm({
    defaultValues: config.defaultValues,
    onSubmit: async ({ value }) => {
      await config.onSubmit(value);
    },
    // Type assertion needed because Zod v4 schemas implement Standard Schema spec
    // but TypeScript can't infer this automatically
    validators: config.validators as any,
  });

  const FormField = <TName extends keyof TFormData>({
    name,
    children,
  }: {
    name: TName;
    children: (field: any) => React.ReactElement;
  }) => {
    return (
      <form.Field
        name={name as string}
        children={(field: any) => {
          // Attach field components to the field with proper binding
          const fieldWithComponents = Object.assign({}, field, {
            TextField: (props: any) => fieldComponents.TextField(field, props),
            NumberField: (props: any) =>
              fieldComponents.NumberField(field, props),
            TextAreaField: (props: any) =>
              fieldComponents.TextAreaField(field, props),
            SelectField: (props: any) =>
              fieldComponents.SelectField(field, props),
            CheckboxField: (props: any) =>
              fieldComponents.CheckboxField(field, props),
          });
          return children(fieldWithComponents);
        }}
      />
    );
  };

  const Form = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
  };

  const SubmitButton = ({
    children = 'Submit',
    className,
    ...props
  }: React.ComponentProps<typeof Button>) => {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [canSubmit, setCanSubmit] = React.useState(true);

    React.useEffect(() => {
      const unsubscribe = form.store.subscribe(() => {
        setIsSubmitting(form.state.isSubmitting);
        setCanSubmit(form.state.canSubmit);
      });
      return unsubscribe;
    }, []);

    return (
      <Button
        type="submit"
        disabled={!canSubmit || isSubmitting}
        className={className}
        {...props}
      >
        {isSubmitting ? 'Submitting...' : children}
      </Button>
    );
  };

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
    );
  };

  return {
    ...form,
    FormField,
    Form,
    SubmitButton,
    ResetButton,
  };
}

export type {
  TextFieldProps,
  NumberFieldProps,
  TextAreaFieldProps,
  SelectFieldProps,
  CheckboxFieldProps,
};
