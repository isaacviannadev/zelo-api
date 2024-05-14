import { FastifyInstance } from 'fastify';

type FastifyErrorHandler = FastifyInstance['errorHandler'];
declare const errorHandler: FastifyErrorHandler;

export { errorHandler };
