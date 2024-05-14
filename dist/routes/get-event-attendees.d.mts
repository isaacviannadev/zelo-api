import { FastifyInstance } from 'fastify';

declare function getEventAttendees(app: FastifyInstance): Promise<void>;

export { getEventAttendees };
