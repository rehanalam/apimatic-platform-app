/**
 * Client-side auth functions
 * These are mock implementations for development
 * Replace with actual API calls to your backend
 */

import { z } from 'zod'

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().optional(),
  workspaceName: z.string().optional(),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type SignUpData = z.infer<typeof signUpSchema>
type LoginData = z.infer<typeof loginSchema>

/**
 * Mock signup function
 * TODO: Replace with actual API call to your backend
 */
export async function signUp({ data }: { data: SignUpData }) {
  // Validate input
  const validated = signUpSchema.parse(data)

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Mock response
  return {
    user: {
      id: 'mock-user-id',
      email: validated.email,
      fullName: validated.fullName || null,
    },
    workspace: {
      id: 'mock-workspace-id',
      name: validated.workspaceName || `${validated.fullName || 'My'}'s Workspace`,
    },
    project: {
      id: 'mock-project-id',
      name: 'My First Project',
    },
    redirectTo: '/onboarding?projectId=mock-project-id',
  }
}

/**
 * Mock login function
 * TODO: Replace with actual API call to your backend
 */
export async function login({ data }: { data: LoginData }) {
  // Validate input
  const validated = loginSchema.parse(data)

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Mock response
  return {
    user: {
      id: 'mock-user-id',
      email: validated.email,
      fullName: 'Test User',
    },
    redirectTo: '/dashboard',
  }
}

/**
 * Mock getMe function
 * TODO: Replace with actual API call to your backend
 */
export async function getMe() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  // Mock - return null (not logged in)
  return null
}
