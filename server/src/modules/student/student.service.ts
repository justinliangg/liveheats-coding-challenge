import { Injectable } from "@nestjs/common";
import { Student } from "@prisma/client";
import { PrismaService } from "@src/prisma.service";
import { StudentDTO } from "./dto/student.dto";

@Injectable()
export class StudentService {
    constructor(private readonly prismaService: PrismaService) {}

    async getMany(): Promise<StudentDTO[]> {
        const students = await this.prismaService.student.findMany();
        return students.map((student) => this.toDTO(student));
    }

    toDTO(student: Student): StudentDTO {
        return {
            id: student.id,
            name: student.name
        };
    }
}
