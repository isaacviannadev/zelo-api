import { FastifyInstance } from 'fastify';

declare function getEvent(app: FastifyInstance): Promise<void>;

export { getEvent };
