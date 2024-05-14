import { FastifyInstance } from 'fastify';

declare function createEvent(app: FastifyInstance): Promise<void>;

export { createEvent };
