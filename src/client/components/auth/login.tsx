import { Link } from '@tanstack/react-router';
import { createAppForm } from '../form';
import type { FormEvent } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/client/components/ui/card';

interface LoginFormData {
  email: string;
  password: string;
}

const initialFormValues: LoginFormData = {
  email: '',
  password: '',
};

export function LoginForm() {
  const form = createAppForm({
    defaultValues: initialFormValues,
    onSubmit: (values) => {
      console.log('submitted values' + values);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form._handleSubmit();
  };

  const { FormField, SubmitButton } = form;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField name="email">
              {(field) =>
                field.TextField({
                  label: 'Email',
                  placeholder: 'John Doe',
                  required: true,
                  autoComplete: 'name',
                })
              }
            </FormField>
            <FormField name="password">
              {(field) =>
                field.TextField({
                  label: 'Password',
                  placeholder: 'Your Password Here',
                  required: true,
                })
              }
            </FormField>
            <SubmitButton className="w-full">Sign in</SubmitButton>
            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link
                to="/signup"
                className="font-medium text-primary hover:underline"
              >
                Sign Up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
