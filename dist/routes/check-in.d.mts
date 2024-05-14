import { FastifyInstance } from 'fastify';

declare function checkIn(app: FastifyInstance): Promise<void>;

export { checkIn };
