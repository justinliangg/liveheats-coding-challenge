import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { ExampleModule } from "./modules/example/example.module";
import { StudentModule } from "./modules/student/student.module";
import { RaceModule } from "./modules/race/race.module";

@Module({
    imports: [ConfigModule.forRoot(), ExampleModule, StudentModule, RaceModule],
    controllers: [AppController],
    providers: [Logger]
})
export class AppModule {}
