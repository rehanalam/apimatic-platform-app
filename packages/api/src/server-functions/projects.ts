import { createServerFn } from '@tanstack/react-start'
import { db } from '@apimatic/db'
import { z } from 'zod'

const createProjectSchema = z.object({
  workspaceId: z.string(),
  name: z.string(),
})

export const getUserProjects = createServerFn({ method: 'GET' })
  .handler(async ({ context }) => {
    // Get userId from context/session
    const userId = context.userId
    
    if (!userId) {
      throw new Error('Unauthorized')
    }
    
    return db.project.findMany({
      where: {
        workspace: {
          members: {
            some: { userId },
          },
        },
      },
      include: {
        workspace: true,
        _count: {
          select: {
            runs: true,
            apiSpecs: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  })

export const createProject = createServerFn({ method: 'POST' })
  .inputValidator(createProjectSchema)
  .handler(async ({ data, context }) => {
    const userId = context.userId
    
    if (!userId) {
      throw new Error('Unauthorized')
    }
    
    return db.project.create({
      data: {
        workspaceId: data.workspaceId,
        name: data.name,
        slug: data.name.toLowerCase().replace(/\s+/g, '-'),
        status: 'active',
      },
    })
  })
