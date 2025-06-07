import { Body, Controller, Get, Post } from "@nestjs/common";
import { StudentService } from "./student.service";
import { CreateStudentDTO } from "./dto/create-student.dto";

@Controller("students")
export class StudentController {
    constructor(private readonly studentService: StudentService) {}

    @Get("/")
    async getStudents() {
        return this.studentService.getMany();
    }

    @Post("/")
    async createStudent(@Body() createStudentDto: CreateStudentDTO) {
        await this.studentService.create(createStudentDto);
    }
}
