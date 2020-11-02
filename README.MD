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
npm install --save @gcoreplus/nestjs-aws-serverless
```

Install the libs for your favorite engine

##### Express

```shell script
npm install --save @nestjs/platform-express
npm install --save aws-serverless-express
```

##### Fastify

```shell script
npm install --save @nestjs/platform-fastify
npm install --save aws-serverless-fastify
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

### Options


| Name                 | Description |
| :------------------- | ----------- |
| engine               | Engine name to be use `express` or `fastify`. Default value `express` |
| warmup.source        | Check for aws event source (`context.source === warmup.source`), if equal it will return string `Lambda is warm!`. See [serverless-plugin-warmup](https://github.com/FidelLimited/serverless-plugin-warmup) |
| fastify.options      | Fastify options. See [options](https://github.com/fastify/fastify/blob/master/docs/Server.md) |
| fastify.binaryTypes  | List of binaries for Fastify. See [aws-lambda-fastify](https://github.com/fastify/aws-lambda-fastify) |
| nestjs.options      | NestJs application options. See [NestApplicationOptions](https://github.com/nestjs/nest/blob/master/packages/common/interfaces/nest-application-options.interface.ts) |
| nestjs.onBeforeInit  | Function called before the `app.init()` is invoked |
| nestjs.onAfterInit  | Function called after the `app.init()` is invoked |

## Examples

Check the examples for express and fastify and deploy using the follow commands

```shell script
npm install
npm run build
npm run deploy:test:us-east-1
```

## Backers

<a href="https://github.com/rennanboni">
<img src="https://avatars0.githubusercontent.com/u/9962013?v=4" class="avatar" alt="Rennan Stefan Boni" width="50" />
</a>

<a href="https://github.com/shoxsz">
<img src="https://avatars0.githubusercontent.com/u/8078131?v=4" class="avatar" alt="Paulo Márcio" width="50" />
</a>

## License

Distributed under the ISC License. See `LICENSE` for more information.

## Acknowledgements

- [nestjs](https://nestjs.com)
- [aws-serverless-express](https://github.com/awslabs/aws-serverless-express)
- [aws-lambda-fastify](https://github.com/fastify/aws-lambda-fastify)

Copyright &copy; 2020 gCorePlus Inc.
