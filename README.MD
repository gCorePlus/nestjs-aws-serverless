[![npm version](http://img.shields.io/npm/v/@gcoreplus/nestjs-storage.svg?style=flat)](https://npmjs.org/package/@gCorePlus/nestjs-storage "View this project on npm")
[![Codecov Coverage](https://codecov.io/gh/gCorePlus/nestjs-storage/branch/master/graph/badge.svg)](https://codecov.io/gh/gCorePlus/nestjs-storage)
[![ISC license](http://img.shields.io/badge/license-ISC-brightgreen.svg)](http://opensource.org/licenses/ISC)

<p align="center">
  <h3 align="center">
    @gCorePlus/nestjs-storage
  </h3>

  <p align="center">
    Provides an injectable service with client to provide S3 (AWS) and GS (Google Storage) storage access from nestjs modules
  </p>
</p>

## Table Of Contents

- [About](#about)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## About

`@gCorePlus/nestjs-storage` implements a module, `NSStorageModule`, which when imported into
your nestjs project provides an S3 and GS client to any class that injects it. This
lets S3 and GS be worked into your dependency injection workflow without having to
do any extra work outside of the initial setup.

## Installation

1. General
    
    `npm install --save @gCorePlus/nestjs-storage`

2. AWS (Optional)

    `npm install --save aws-sdk`

3. Google Storage (Optional)

    `npm install --save @google-cloud/storage` 

## Getting Started

The simplest way to use `@gCorePlus/nestjs-storage` is to use `NSStorageModule.forRoot`

```typescript
import { Module } from '@nestjs-common';
import { NSStorageModule } from '@gCorePlus/nestjs-storage';

@Module({
  imports: [
    NSStorageModule.forRoot({
      id?: '<projectid>',
      s3: {
        accessKeyId: 'AWS_ACCESS_KEY_ID',
        secretAccessKey: 'AWS_AWS_SECRET_ACCESS_KEY',
        region?: 'AWS_REGION_ID',
        sessionToken?: 'AWS_SESSION_TOKEN', | null, 
        apiVersion?: 'S3_API_VERSION', //based on s3 api version //
        buckets?: [
          { id: 'bucket-a', name: 'Bucket_A' },
        ]
      }
    }),
  ],
})
export class AppModule {}
```

The async way `@gCorePlus/nestjs-storage` is to use `NSStorageModule.forRootAsync`

```typescript
import { Module } from '@nestjs-common';
import { NSStorageModule } from '@gCorePlus/nestjs-storage';
import { ConfigModule } from '@gCorePlus/nestjs-config';
import { ConfigService } from '@gCorePlus/nestjs-config';

@Module({
  imports: [
    NSStorageModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (cfg:ConfigService) => ({
        id: 'MyProjectS3',
        s3: {
          accessKeyId: cfg.get('ACCESS_KEY_ID'),
          secretAccessKey: 'AWS_SECRET_ACCESS_KEY',
          buckets: [
            { id: 'bucket-a', name: 'Bucket_A' },
          ]
        },
      }),
      inject: [ConfigService],
    })
  ]
})

export class AppModule {}
```

You can then inject the S3 client into any of your injectables by using a
custom decorator

```typescript
import { Injectable } from '@nestjs/common';
import { NSBody, NSBucket, NSPutObjectRequest, createBucketToken, NSService, NSProvider } from '@gCorePlus/nestjs-storage';

@Injectable()
export class AppService {

  public constructor(@NSProvider() private readonly service: NSService) { }

  async upload(pdf: NSBody) {
    try {
      const bucket: NSBucket | undefined = this.service.getNSBucketByKey(createBucketToken('MyProjectS3', 'Bucket_A'));

      if (bucket) {
        const params: NSPutObjectRequest = {
          Key: 'file_name.pdf',
          ACL: 'public-read',
          Body: pdf,
        };

        await bucket.putObject(params);
      }
    } catch (error) {
      console.log('ERROR S3 FILE UPLOAD => ', error);
    }
  }
}
```

## License

Distributed under the ISC License. See `LICENSE` for more information.

## Acknowledgements

- [nestjs](https://nestjs.com)
- [aws-sdk](https://github.com/aws/aws-sdk-js)
- [google-storage](https://github.com/googleapis/nodejs-storage)

Copyright &copy; 2020 gCorePlus Inc.
