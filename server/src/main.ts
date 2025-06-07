import { ValidationPipe, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import {
    DocumentBuilder,
    SwaggerDocumentOptions,
    SwaggerModule
} from "@nestjs/swagger";
import {
    utilities as nestWinstonModuleUtilities,
    WinstonModule
} from "nest-winston";
import { createLogger, format, transports } from "winston";

import { AppModule } from "./app.module";
import { config } from "./constants/config";

async function bootstrap() {
    const instance = createLogger({
        transports: [
            new transports.Console({
                level: "debug",
                format: format.combine(
                    format.timestamp(),
                    format.ms(),
                    nestWinstonModuleUtilities.format.nestLike("Nest", {
                        colors: true,
                        prettyPrint: true,
                        processId: true
                    })
                )
            })
        ]
    });

    const app = await NestFactory.create(AppModule, {
        logger: WinstonModule.createLogger({
            instance
        })
    });

    app.useGlobalPipes(
        new ValidationPipe({ transform: true, stopAtFirstError: true })
    );

    // Config
    const configService = app.get<ConfigService>(ConfigService);
    checkEnvironment(configService);

    // Versioning
    app.enableVersioning({
        defaultVersion: "1",
        type: VersioningType.URI
    });

    // Swagger Docs
    const doc = new DocumentBuilder().setVersion("1.0").build();
    const options: SwaggerDocumentOptions = {
        operationIdFactory: (_controllerKey: string, methodKey: string) =>
            methodKey
    };
    const document = SwaggerModule.createDocument(app, doc, options);
    SwaggerModule.setup("api", app, document);

    const port = configService.get("PORT") ?? 5001;
    app.enableCors();
    await app.listen(port);
    console.log(`Server started on PORT: ${port}`);
}

function checkEnvironment(configService: ConfigService) {
    const requiredEnvVars = [config.DATABASE_URL, config.PORT];

    requiredEnvVars.forEach((envVar) => {
        if (!configService.get<string>(envVar)) {
            throw Error(`Undefined environment variable: ${envVar}`);
        }
    });
}

bootstrap();
