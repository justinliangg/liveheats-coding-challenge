import { studentFactory } from "@test/factories/student.factory";
import { app } from "@test/integration/setupTests";
import * as request from "supertest";

describe("GET /v1/students", () => {
    it("should be able to get list of students", async () => {
        // Arrange
        const testStudents = await studentFactory.createList(5);

        // Act
        const url = `/v1/students`;
        const res = await request(app.getHttpServer()).get(url);

        // Assert
        expect(res.status).toBe(200);
        const expectedResponse = testStudents.map((student) => ({
            id: student.id,
            name: student.name
        }));
        expect(res.body).toEqual(expect.arrayContaining(expectedResponse));
    });
});
