import { FastifyInstance } from 'fastify';

declare function registerForEvent(app: FastifyInstance): Promise<void>;

export { registerForEvent };
