import { createServerFn } from '@tanstack/react-start'
import { db } from '@apimatic/db'
import { hashPassword, verifyPassword, signToken, verifyToken } from '../lib/auth'
import { z } from 'zod'
import { getCookie, setCookie } from 'vinxi/http'

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

// Server function for signup
export const signUp = createServerFn({ method: 'POST' })
  .inputValidator(signUpSchema)
  .handler(async ({ data }) => {
    // Check existing user
    const existing = await db.user.findUnique({
      where: { email: data.email },
    })
    
    if (existing) {
      throw new Error('User already exists')
    }
    
    // Create user
    const user = await db.user.create({
      data: {
        email: data.email,
        passwordHash: await hashPassword(data.password),
        fullName: data.fullName,
      },
    })
    
    // Create workspace
    const workspaceName = data.workspaceName || `${data.fullName || 'My'}'s Workspace`
    const workspace = await db.workspace.create({
      data: {
        name: workspaceName,
        slug: workspaceName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
        ownerId: user.id,
      },
    })
    
    // Add member
    await db.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        userId: user.id,
        role: 'owner',
      },
    })
    
    // Create first project
    const project = await db.project.create({
      data: {
        workspaceId: workspace.id,
        name: 'My First Project',
        slug: 'my-first-project',
        status: 'initializing',
      },
    })
    
    // Initialize onboarding
    await db.onboardingState.create({
      data: {
        projectId: project.id,
        status: 'not_started',
        currentStep: 1,
      },
    })
    
    const token = await signToken({ userId: user.id })
    
    // Set cookie
    setCookie('auth_token', token, {
      httpOnly: true,
      secure: process.env['NODE_ENV'] === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    
    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
      workspace: {
        id: workspace.id,
        name: workspace.name,
      },
      project: {
        id: project.id,
        name: project.name,
      },
      redirectTo: `/onboarding?projectId=${project.id}`,
    }
  })

// Server function for login
export const login = createServerFn({ method: 'POST' })
  .inputValidator(loginSchema)
  .handler(async ({ data }) => {
    const user = await db.user.findUnique({
      where: { email: data.email },
    })
    
    if (!user) {
      throw new Error('Invalid credentials')
    }
    
    const valid = await verifyPassword(data.password, user.passwordHash)
    
    if (!valid) {
      throw new Error('Invalid credentials')
    }
    
    const token = await signToken({ userId: user.id })
    
    setCookie('auth_token', token, {
      httpOnly: true,
      secure: process.env['NODE_ENV'] === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    
    // Check incomplete onboarding
    const incompleteProject = await db.project.findFirst({
      where: {
        workspace: {
          members: {
            some: { userId: user.id },
          },
        },
        onboardingState: {
          status: { in: ['not_started', 'in_progress'] },
        },
      },
      include: {
        onboardingState: true,
      },
    })
    
    const redirectTo = incompleteProject
      ? `/onboarding?projectId=${incompleteProject.id}`
      : '/dashboard'
    
    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
      redirectTo,
    }
  })

// Server function to get current user
export const getMe = createServerFn({ method: 'GET' })
  .handler(async () => {
    const token = getCookie('auth_token')
    
    if (!token) {
      return null
    }
    
    const payload = await verifyToken(token)
    
    if (!payload) {
      return null
    }
    
    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
      },
    })
    
    return user
  })
