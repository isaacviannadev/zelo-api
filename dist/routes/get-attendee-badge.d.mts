import { FastifyInstance } from 'fastify';

declare function getAttendeeBadge(app: FastifyInstance): Promise<void>;

export { getAttendeeBadge };
