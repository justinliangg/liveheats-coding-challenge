import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { ExampleModule } from "./modules/example/example.module";

@Module({
    imports: [ConfigModule.forRoot(), ExampleModule],
    controllers: [AppController],
    providers: [Logger]
})
export class AppModule {}
