import { app } from "@test/integration/setupTests";
import * as request from "supertest";
import { getTestDb } from "@test/integration/utils/getTestDb";
import { PrismaClient } from "@prisma/client";
import { studentFactory } from "@test/factories/student.factory";
import { raceFactory } from "@test/factories/race.factory";

describe("GET /v1/races", () => {
    let db: PrismaClient;

    beforeAll(async () => {
        db = getTestDb();
    });

    it("should be able to get races", async () => {
        // Arrange
        const students = await studentFactory.createList(5);
        await raceFactory.createList(3, {
            raceParticipants: {
                create: students.map((student, index) => ({
                    studentId: student.id,
                    lane: index + 1
                }))
            }
        });

        // Act
        const url = `/v1/races`;
        const res = await request(app.getHttpServer()).get(url);

        // Assert
        expect(res.status).toBe(200);

        const races = await db.race.findMany({
            include: {
                raceParticipants: {
                    include: {
                        student: true
                    }
                }
            }
        });
        const expectedResponse = races.map((r) => ({
            id: r.id,
            name: r.name,
            isCompleted: r.isCompleted,
            participants: r.raceParticipants.map((p) => ({
                student: {
                    id: p.student.id,
                    name: p.student.name
                },
                lane: p.lane,
                position: p.position
            }))
        }));
        expect(res.body).toEqual(expectedResponse);
    });
});
