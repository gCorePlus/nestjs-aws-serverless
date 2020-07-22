import { APIGatewayProxyEvent, APIGatewayProxyResult, Context, EventBridgeEvent, Handler, SQSEvent } from 'aws-lambda';
import { ProxyResult } from 'aws-serverless-express';
import { INestApplication } from '@nestjs/common';
import * as http from 'http';

let cachedApp: INestApplication;

export interface Options {
  engine: 'express' | 'fastify',
  warmup?: {
    source: string;
  }
  fastify?: {
    options?: any;
    binaryTypes?: string[];
  },
}

const bootstrap = async (module: any, opts?: Options): Promise<any> => {
  const { NestFactory } = await import('@nestjs/core');

  if (opts?.engine === 'express') {
    let app = await NestFactory.create<INestApplication>(module);
    await app.init();

    return app;
  } else if (opts?.engine === 'fastify') {
    const { FastifyAdapter } = await import('@nestjs/platform-fastify');

    let app = await NestFactory.create<INestApplication>(module, new FastifyAdapter(opts?.fastify?.options));
    await app.init();

    const instance = app.getHttpAdapter().getInstance();
    await instance.ready();

    return app;
  }
};

const handleAPIGatewayProxyEvent = async (app: INestApplication, event: APIGatewayProxyEvent, context: Context, opts?: Options): Promise<APIGatewayProxyResult | http.Server | ProxyResult> => {
  if  (opts?.engine === 'fastify') {
    const { proxy } = await import('aws-serverless-fastify');
    return await proxy(app.getHttpAdapter().getInstance(), event, context, opts?.fastify?.binaryTypes || []);
  } else {
    const { proxy, createServer } = await import('aws-serverless-express');
    return proxy(createServer(app.getHttpAdapter().getInstance()), event, context, 'PROMISE').promise;
  }
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const lambda = (module: any, opts?: Options): Handler => {
  opts = opts ? opts : { engine: 'express' };
  if (opts.fastify) {
    opts.fastify.binaryTypes = opts.fastify.binaryTypes || [];
  }

  return async (event: APIGatewayProxyEvent & SQSEvent & EventBridgeEvent<string, void>, context: Context): Promise<APIGatewayProxyResult | http.Server | ProxyResult | string | undefined> => {
    try {
      // Immediate response for WarmUp plugin
      if (event?.source && event?.source === opts?.warmup?.source) return 'Lambda is warm!';

      if (event?.httpMethod) {
        // App bootstrap
        if (!cachedApp) {
          cachedApp = await bootstrap(module, opts);
        }

        return handleAPIGatewayProxyEvent(cachedApp, event, context, opts);
      }
    } catch (err) {
      console.error('Couldn\'t start server', err);
    }
  };
};
