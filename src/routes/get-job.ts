import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { BadRequest } from './_errors/bad-request';

export async function getJob(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/jobs/:jobId',
    {
      schema: {
        summary: 'Get Job details',
        tags: ['Jobs'],
        params: z.object({
          jobId: z.coerce.number().int(),
        }),
        response: {
          200: z.object({
            id: z.number().int(),
            title: z.string(),
            description: z.string(),
            salary: z.number().positive(),
            contractType: z.enum(['CLT', 'PJ']),
            location: z.string(),
            user: z.object({
              id: z.string().uuid(),
              email: z.string().email(),
              role: z.enum(['ADMIN', 'NON_CAREGIVER', 'CAREGIVER']),
              caregiver: z
                .object({
                  id: z.string().uuid(),
                  name: z.string(),
                })
                .nullable(),
              jobsAmount: z.number().int(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { jobId } = request.params;

      const job = await prisma.job.findUnique({
        select: {
          id: true,
          title: true,
          description: true,
          salary: true,
          contractType: true,
          location: true,
          user: {
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
          },
        },
        where: { id: jobId },
      });

      if (job === null) {
        throw new BadRequest('Job not found');
      }

      return reply.send({
        id: job.id,
        title: job.title,
        description: job.description,
        salary: job.salary,
        contractType: job.contractType,
        location: job.location,
        user: {
          id: job.user.id,
          email: job.user.email,
          role: job.user.role,
          caregiver: job.user.caregiver,
          jobsAmount: job.user._count.jobs,
        },
      });
    }
  );
}
