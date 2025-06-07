import { Logger, Module } from "@nestjs/common";
import { PrismaService } from "@src/prisma.service";
import { StudentController } from "./student.controller";
import { StudentService } from "./student.service";

@Module({
    imports: [],
    controllers: [StudentController],
    providers: [Logger, StudentService, PrismaService],
    exports: [StudentService]
})
export class StudentModule {}
