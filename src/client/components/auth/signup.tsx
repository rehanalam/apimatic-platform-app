import { Link } from '@tanstack/react-router';
import { createAppForm } from '@/client/components/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/client/components/ui/card';

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

const initialFormValues: SignupFormData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  termsAccepted: false,
};

export function SignupForm() {
  const form = createAppForm<SignupFormData>({
    defaultValues: initialFormValues,
    onSubmit: (values) => {
      console.log('Signup form submitted:', values);
      // TODO: Implement signup logic
    },
  });

  const { FormField, SubmitButton } = form;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Create an Account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your details to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void form._handleSubmit();
            }}
            className="space-y-4"
          >
            <FormField name="name">
              {(field) =>
                field.TextField({
                  label: 'Full Name',
                  placeholder: 'John Doe',
                  required: true,
                  autoComplete: 'name',
                })
              }
            </FormField>

            <FormField name="email">
              {(field) =>
                field.TextField({
                  type: 'email',
                  label: 'Email',
                  placeholder: 'john@example.com',
                  required: true,
                  autoComplete: 'email',
                })
              }
            </FormField>

            <FormField name="password">
              {(field) =>
                field.TextField({
                  type: 'password',
                  label: 'Password',
                  placeholder: '""""""""',
                  required: true,
                  autoComplete: 'new-password',
                })
              }
            </FormField>

            <FormField name="confirmPassword">
              {(field) =>
                field.TextField({
                  type: 'password',
                  label: 'Confirm Password',
                  placeholder: '""""""""',
                  required: true,
                  autoComplete: 'new-password',
                })
              }
            </FormField>

            <FormField name="termsAccepted">
              {(field) =>
                field.CheckboxField({
                  label: 'I agree to the Terms of Service and Privacy Policy',
                  required: true,
                })
              }
            </FormField>

            <SubmitButton className="w-full">Create Account</SubmitButton>

            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
