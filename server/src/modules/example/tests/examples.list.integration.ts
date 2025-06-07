import { exampleFactory } from "@test/factories/example.factory";
import { app } from "@test/integration/setupTests";
import * as request from "supertest";

describe("GET /v1/examples", () => {
    it("should be able to get list of examples", async () => {
        // Arrange
        const testExamples = await exampleFactory.createList(5);

        // Act
        const url = `/v1/examples`;
        const res = await request(app.getHttpServer()).get(url);

        // Assert
        expect(res.status).toBe(200);
        const expectedResponse = testExamples.map((example) => ({
            id: example.id,
            name: example.name
        }));
        expect(res.body).toEqual(expect.arrayContaining(expectedResponse));
    });
});
