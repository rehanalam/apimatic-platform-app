import { useForm } from '@tanstack/react-form'
import { Input } from '../ui'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/client/components/ui/card'

interface LoginFormData {
  email: string
  password: string
}

const initialFormValues: LoginFormData = {
  email: '',
  password: '',
}

export function LoginForm() {
  const form = useForm({
    defaultValues: initialFormValues,
    onSubmit: ({ value }) => {
      console.log(value)
    },
  })

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
          <form.Field
            name="email"
            children={(field) => (
              <>
                <Input
                  name={field.name}
                  value={field.state.value}
                  type="text"
                />
                {!field.state.meta.isValid && (
                  <em>{field.state.meta.errors.join(',')}</em>
                )}
              </>
            )}
          />
          <form.Field
            name="password"
            children={(field) => (
              <>
                <Input
                  name={field.name}
                  value={field.state.value}
                  type="text"
                />
                {!field.state.meta.isValid && (
                  <em>{field.state.meta.errors.join(',')}</em>
                )}
              </>
            )}
          />
        </CardContent>
      </Card>
    </div>
  )
}
