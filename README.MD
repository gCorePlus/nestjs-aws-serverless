[![npm version](http://img.shields.io/npm/v/@gcoreplus/nestjs-aws-serverless.svg?style=flat)](https://npmjs.org/package/@gCorePlus/nestjs-aws-serverless "View this project on npm")
[![Codecov Coverage](https://codecov.io/gh/gCorePlus/nestjs-aws-serverless/branch/master/graph/badge.svg)](https://codecov.io/gh/gCorePlus/nestjs-aws-serverless)
[![ISC license](http://img.shields.io/badge/license-ISC-brightgreen.svg)](http://opensource.org/licenses/ISC)

# Nestjs AWS Serverless

## About

`@gCorePlus/nestjs-aws-serverless` provide easy way to run Nest.js on AWS Lambda using express or fastify engines

Inspired by the [aws-serverless-express](https://github.com/awslabs/aws-serverless-express) and [aws-lambda-fastify](https://github.com/fastify/aws-lambda-fastify) library  

## 👨🏻‍💻Installation

Install the main lib
    
```shell script
npm install --save @gCorePlus/nestjs-aws-serverless
```

Install the libs for your favorite engine

##### Express

```shell script
npm install --save @nestjs/platform-express
npm install --save aws-serverless-express
```

##### Fastify

```shell script
npm install --save @nestjs/platform-express
npm install --save aws-serverless-express
``` 

### Create the aws handler

Create a file (e.g. `main-aws.ts`) to boot your app on lambda

##### Express

```typescript
import { lambda } from '@gcoreplus/nestjs-aws-serverless';
import { AppModule } from './app.module';

export const handler = lambda(AppModule);
```

##### Fastify

```typescript
import { lambda } from '@gcoreplus/nestjs-aws-serverless';
import { AppModule } from './app.module';

export const handler = lambda(AppModule, {engine: 'fastify'});
```

### Deploy

Deploy your app on AWS Lambda with [serverless](https://github.com/serverless/serverless) or setup manually pointing to `main-aws.ts` as `main-aws.handler`

see example from [express](https://github.com/gCorePlus/nestjs-aws-serverless/blob/master/examples/nestjs-aws-serverless-express/serverless.yml) or [fastify](https://github.com/gCorePlus/nestjs-aws-serverless/blob/master/examples/nestjs-aws-serverless-fastify/serverless.yml)
```yaml
...
functions:
  hello-world:
    name: ${self:custom.prefix-name}
    handler: dist/test/nestjs-aws-serverless-express/src/main-aws.handler
...
```

## Examples

Check the examples for express and fastify and deploy using the follow commands

```shell script
npm install
npm run build
npm run deploy:test:us-east-1
```

## License

Distributed under the ISC License. See `LICENSE` for more information.

## Acknowledgements

- [nestjs](https://nestjs.com)
- [aws-serverless-express](https://github.com/awslabs/aws-serverless-express)
- [aws-lambda-fastify](https://github.com/fastify/aws-lambda-fastify)

Copyright &copy; 2020 gCorePlus Inc.
