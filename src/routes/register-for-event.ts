import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { BadRequest } from './_errors/bad-request';

export async function registerForEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/events/:eventId/attendees',
    {
      schema: {
        summary: 'Register an attendee for an event',
        tags: ['Attendees'],
        body: z.object({
          name: z.string().min(4),
          email: z.string().email(),
        }),
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
          201: z.object({
            attendeeId: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { eventId } = request.params;
      const { name, email } = request.body;

      const [event, attendeesCount] = await Promise.all([
        prisma.event.findUnique({
          where: { id: eventId },
        }),

        prisma.attendee.count({
          where: { eventId },
        }),
      ]);

      if (event === null) {
        throw new BadRequest('Event not found');
      }

      if (
        event.maximumAttendees !== null &&
        attendeesCount >= event.maximumAttendees
      ) {
        throw new BadRequest('Maximum attendees reached');
      }

      const attendeeFromEmail = await prisma.attendee.findUnique({
        where: { eventId_email: { eventId, email } },
      });

      if (attendeeFromEmail !== null) {
        throw new BadRequest('Attendee already registered');
      }

      const attendee = await prisma.attendee.create({
        data: {
          name,
          email,
          eventId,
        },
      });

      return reply.code(201).send({ attendeeId: attendee.id });
    }
  );
}
