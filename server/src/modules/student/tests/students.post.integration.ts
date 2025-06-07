import { app } from "@test/integration/setupTests";
import * as request from "supertest";
import { getTestDb } from "@test/integration/utils/getTestDb";
import { PrismaClient } from "@prisma/client";
import { studentFactory } from "@test/factories/student.factory";

describe("POST /v1/students", () => {
    let db: PrismaClient;

    beforeAll(async () => {
        db = getTestDb();
    });

    it("should be able to create a student", async () => {
        // Arrange
        await studentFactory.createList(5);

        // Act
        const url = `/v1/students`;
        const res = await request(app.getHttpServer()).post(url).send({
            name: "John Doe"
        });

        // Assert
        expect(res.status).toBe(201);

        const students = await db.student.findMany();
        expect(students.length).toBe(6);

        const createdStudent = await db.student.findFirst({
            where: {
                name: "John Doe"
            }
        });
        expect(createdStudent).toBeDefined();
    });

    it("should return 400 if the student name is not provided", async () => {
        // Act
        const url = `/v1/students`;
        const res = await request(app.getHttpServer()).post(url).send({});

        // Assert
        expect(res.status).toBe(400);
        expect(res.body.message[0]).toContain("Name is required");
    });
});
