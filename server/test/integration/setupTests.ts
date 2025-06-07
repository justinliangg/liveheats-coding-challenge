import {
    INestApplication,
    ValidationPipe,
    VersioningType
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "@src/app.module";

import { resetDB } from "./utils/resetDb";

let moduleFixture: TestingModule;
let app: INestApplication;

beforeAll(async () => {
    await resetDB();

    moduleFixture = await Test.createTestingModule({
        imports: [AppModule]
    })
        .overrideProvider(ConfigService)
        .useValue({
            get: (key: string) => {
                const configs = {
                    // Using DATABASE_URL from env as that is set in global setup file.
                    DATABASE_URL: process.env.DATABASE_URL
                };

                return configs[key];
            }
        })
        .compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            stopAtFirstError: true
        })
    );
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: "1"
    });

    await app.init();
});

afterAll(async () => {
    await app.close();
});

export { app, moduleFixture };
