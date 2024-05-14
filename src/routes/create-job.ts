import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export async function createJob(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/jobs',
    {
      schema: {
        summary: 'Create a new job',
        tags: ['Jobs'],
        body: z.object({
          title: z.string().min(4),
          description: z.string(),
          salary: z.number().positive(),
          contractType: z.enum(['CLT', 'PJ']),
          location: z.string(),
          user: z.string().uuid(),
        }),
        response: {
          201: z.object({
            jobId: z.number().int(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { title, description, salary, contractType, location, user } =
        request.body;

      const job = await prisma.job.create({
        data: {
          title,
          description,
          salary,
          contractType,
          location,
          user: {
            connect: {
              id: user,
            },
          },
        },
      });

      return reply.code(201).send({ jobId: job.id });
    }
  );
}
