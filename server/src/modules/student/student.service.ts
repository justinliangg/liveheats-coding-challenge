import { Injectable } from "@nestjs/common";
import { Student } from "@prisma/client";
import { PrismaService } from "@src/prisma.service";
import { StudentDTO } from "./dto/student.dto";
import { CreateStudentDTO } from "./dto/create-student.dto";

@Injectable()
export class StudentService {
    constructor(private readonly prismaService: PrismaService) {}

    async getMany(): Promise<StudentDTO[]> {
        const students = await this.prismaService.student.findMany();
        return students.map((student) => this.toDTO(student));
    }

    async create(createStudent: CreateStudentDTO): Promise<StudentDTO> {
        const student = await this.prismaService.student.create({
            data: {
                name: createStudent.name
            }
        });
        return this.toDTO(student);
    }

    toDTO(student: Student): StudentDTO {
        return {
            id: student.id,
            name: student.name
        };
    }
}
