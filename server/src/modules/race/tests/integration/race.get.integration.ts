import { app } from "@test/integration/setupTests";
import * as request from "supertest";
import { getTestDb } from "@test/integration/utils/getTestDb";
import { PrismaClient } from "@prisma/client";
import { studentFactory } from "@test/factories/student.factory";
import { raceFactory } from "@test/factories/race.factory";

describe("GET /v1/races/:raceId", () => {
    let db: PrismaClient;

    beforeAll(async () => {
        db = getTestDb();
    });

    it("should be able to get a race", async () => {
        // Arrange
        const students = await studentFactory.createList(5);
        const races = await raceFactory.createList(3, {
            raceParticipants: {
                create: students.map((student, index) => ({
                    studentId: student.id,
                    lane: index + 1
                }))
            }
        });

        // Act
        const url = `/v1/races/${races[0].id}`;
        const res = await request(app.getHttpServer()).get(url);

        // Assert
        expect(res.status).toBe(200);

        const expectedRace = await db.race.findUniqueOrThrow({
            where: {
                id: races[0].id
            },
            include: {
                raceParticipants: {
                    include: {
                        student: true
                    }
                }
            }
        });
        expect(res.body).toEqual({
            id: expectedRace.id,
            name: expectedRace.name,
            isCompleted: expectedRace.isCompleted,
            participants: expectedRace.raceParticipants.map((p) => ({
                student: {
                    id: p.student.id,
                    name: p.student.name
                },
                lane: p.lane,
                position: p.position
            }))
        });
    });

    it("should return 404 if an invalid raceId is provided", async () => {
        // Arrange
        const students = await studentFactory.createList(5);
        const races = await raceFactory.createList(3, {
            raceParticipants: {
                create: students.map((student, index) => ({
                    studentId: student.id,
                    lane: index + 1
                }))
            }
        });

        // Act
        const url = `/v1/races/47b27bd3-e93b-4db4-8bfe-63f57e14854a`;
        const res = await request(app.getHttpServer()).get(url);

        // Assert
        expect(res.status).toBe(404);
    });
});
