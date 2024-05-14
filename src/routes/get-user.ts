import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { BadRequest } from './_errors/bad-request';

export async function getUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/users/:userId',
    {
      schema: {
        summary: 'Get User details',
        tags: ['Users'],
        params: z.object({
          userId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            id: z.string().uuid(),
            email: z.string().email(),
            role: z.enum(['ADMIN', 'NON_CAREGIVER', 'CAREGIVER']),
            jobsAmount: z.number().int(),
            caregiver: z
              .object({
                id: z.string().uuid(),
                name: z.string(),
              })
              .nullable(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { userId } = request.params;

      const user = await prisma.user.findUnique({
        select: {
          id: true,
          email: true,
          role: true,
          caregiver: true,
          _count: {
            select: {
              jobs: true,
            },
          },
        },
        where: { id: userId },
      });

      if (user === null) {
        throw new BadRequest('User not found');
      }

      return reply.send({
        id: user.id,
        email: user.email,
        role: user.role,
        caregiver: user.caregiver,
        jobsAmount: user._count.jobs,
      });
    }
  );
}
