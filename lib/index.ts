import { APIGatewayProxyEvent, APIGatewayProxyResult, Context, EventBridgeEvent, SQSEvent } from 'aws-lambda';
import { ProxyResult } from 'aws-serverless-express';
import { INestApplication, NestApplicationOptions } from '@nestjs/common';
import * as http from 'http';

export interface Options {
  engine: 'express' | 'fastify',
  warmup?: {
    source: string;
  }
  fastify?: {
    options?: any;
    binaryTypes?: string[];
  },
  nestOptions?: NestApplicationOptions
}

const bootstrap = async (module: any, opts: Options): Promise<any> => {
  const { NestFactory } = await import('@nestjs/core');

  if (opts.engine === 'fastify') {
    const { FastifyAdapter } = await import('@nestjs/platform-fastify');

    let app = await NestFactory.create<INestApplication>(module, new FastifyAdapter(opts.fastify?.options), opts.nestOptions);
    await app.init();

    const instance = app.getHttpAdapter().getInstance();
    await instance.ready();

    return app;
  } else { // Default Express
    let app = await NestFactory.create<INestApplication>(module, opts.nestOptions);
    await app.init();

    return app;
  }
};

const handleAPIGatewayProxyEvent = async (app: INestApplication, event: APIGatewayProxyEvent, context: Context, opts: Options): Promise<APIGatewayProxyResult | http.Server | ProxyResult> => {
  if  (opts.engine === 'fastify') {
    const { proxy } = await import('aws-serverless-fastify');
    return await proxy(app.getHttpAdapter().getInstance(), event, context, opts.fastify?.binaryTypes || []);
  } else { // Default Express
    const { proxy, createServer } = await import('aws-serverless-express');
    return proxy(createServer(app.getHttpAdapter().getInstance()), event, context, 'PROMISE').promise;
  }
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const lambda = (module: any, options?: Options): any => {
  const opts: Options = options ? options : { engine: 'express', warmup: { source: 'serverless-plugin-warmup'}, nestOptions: {  } };
  if (opts.fastify) {
    opts.fastify.binaryTypes = opts.fastify.binaryTypes || [];
  }

  let cachedApp: INestApplication;
  return async (event: APIGatewayProxyEvent & SQSEvent & EventBridgeEvent<string, void>, context: Context): Promise<APIGatewayProxyResult | http.Server | ProxyResult | string | undefined> => {
    // Immediate response for WarmUp plugin
    if (event?.source && event?.source === opts?.warmup?.source) return 'Lambda is warm!';

    if (event?.httpMethod) {
      // App bootstrap
      if (!cachedApp) {
        cachedApp = await bootstrap(module, opts);
      }

      return handleAPIGatewayProxyEvent(cachedApp, event, context, opts);
    }
  };
};
