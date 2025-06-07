import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { ExampleModule } from "./modules/example/example.module";
import { StudentModule } from "./modules/student/student.module";

@Module({
    imports: [ConfigModule.forRoot(), ExampleModule, StudentModule],
    controllers: [AppController],
    providers: [Logger]
})
export class AppModule {}
