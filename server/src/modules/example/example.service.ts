import { Injectable } from "@nestjs/common";
import { Example } from "@prisma/client";
import { PrismaService } from "@src/prisma.service";
import { ExampleDTO } from "./dto/example.dto";

@Injectable()
export class ExampleService {
    constructor(private prismaService: PrismaService) {}

    async getMany(): Promise<ExampleDTO[]> {
        const examples = await this.prismaService.example.findMany();
        return examples.map((example) => this.toDTO(example));
    }

    toDTO(example: Example): ExampleDTO {
        return {
            id: example.id,
            name: example.name
        };
    }
}
