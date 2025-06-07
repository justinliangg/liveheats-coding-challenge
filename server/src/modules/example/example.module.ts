import { Logger, Module } from "@nestjs/common";
import { ExampleController } from "./example.controller";
import { ExampleService } from "./example.service";
import { PrismaService } from "@src/prisma.service";

@Module({
    imports: [],
    controllers: [ExampleController],
    providers: [Logger, ExampleService, PrismaService],
    exports: [ExampleService]
})
export class ExampleModule {}
