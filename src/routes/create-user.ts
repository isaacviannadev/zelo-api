import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { BadRequest } from './_errors/bad-request';

export async function createUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        summary: 'Create a new user',
        tags: ['Users'],
        body: z.object({
          email: z.string().email(),
          password: z.string(),
          role: z.enum(['ADMIN', 'NON_CAREGIVER', 'CAREGIVER']),
        }),
        response: {
          201: z.object({
            userId: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password, role } = request.body;

      const userWithSameEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (userWithSameEmail !== null) {
        throw new BadRequest('User with same email already exists');
      }

      const user = await prisma.user.create({
        data: {
          email,
          password,
          role,
        },
      });

      return reply.code(201).send({ userId: user.id });
    }
  );
}
