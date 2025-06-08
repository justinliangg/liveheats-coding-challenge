import { getTestDb } from "@test/integration/utils/getTestDb";
import { PrismaClient } from "@prisma/client";
import { raceFactory } from "@test/factories/race.factory";
import { studentFactory } from "@test/factories/student.factory";
import * as request from "supertest";
import { app } from "@test/integration/setupTests";
import { resetDB } from "@test/integration/utils/resetDb";

describe("PATCH /v1/races/:id/results", () => {
    let db: PrismaClient;

    beforeEach(async () => {
        await resetDB();
    });

    beforeAll(async () => {
        db = getTestDb();
    });

    it("should be able to successfully update a race results", async () => {
        // Arrange
        const students = await studentFactory.createList(5);
        const race = await raceFactory.create({
            name: "100m Dash",
            raceParticipants: {
                create: students.map((student, index) => ({
                    studentId: student.id,
                    lane: index + 1
                }))
            },
            isCompleted: false
        });

        // Act
        const url = `/v1/races/${race.id}/results`;
        const res = await request(app.getHttpServer())
            .patch(url)
            .send({
                results: students.map((student, index) => ({
                    studentId: student.id,
                    position: index + 1
                }))
            });

        // Assert
        expect(res.status).toBe(200);
        const updatedRaceParticipants = await db.raceParticipant.findMany({
            where: {
                raceId: race.id
            }
        });

        expect(updatedRaceParticipants.length).toBe(5);
        expect(updatedRaceParticipants.map((p) => p.position)).toEqual(
            students.map((_, index) => index + 1)
        );
    });

    it("should allow for ties when the skipped position is correct (e.g. [1, 1, 3, 3, 5])", async () => {
        // Arrange
        const students = await studentFactory.createList(5);
        const race = await raceFactory.create({
            name: "100m Dash",
            raceParticipants: {
                create: students.map((student, index) => ({
                    studentId: student.id,
                    lane: index + 1
                }))
            },
            isCompleted: false
        });

        // Act
        const results = [
            { studentId: students[0].id, position: 1 },
            { studentId: students[1].id, position: 1 },
            { studentId: students[2].id, position: 3 },
            { studentId: students[3].id, position: 3 },
            { studentId: students[4].id, position: 5 }
        ];
        const url = `/v1/races/${race.id}/results`;
        const res = await request(app.getHttpServer()).patch(url).send({
            results
        });

        // Assert
        expect(res.status).toBe(200);
        const updatedRaceParticipants = await db.raceParticipant.findMany();
        expect(updatedRaceParticipants.length).toBe(5);
        expect(updatedRaceParticipants.map((p) => p.position)).toEqual([
            1, 1, 3, 3, 5
        ]);
    });

    it("should mark the race as completed after submitting valid results", async () => {
        // Arrange
        const students = await studentFactory.createList(5);
        const race = await raceFactory.create({
            name: "100m Dash",
            raceParticipants: {
                create: students.map((student, index) => ({
                    studentId: student.id,
                    lane: index + 1
                }))
            },
            isCompleted: false
        });

        // Act
        const url = `/v1/races/${race.id}/results`;
        const res = await request(app.getHttpServer())
            .patch(url)
            .send({
                results: students.map((student, index) => ({
                    studentId: student.id,
                    position: index + 1
                }))
            });

        // Assert
        expect(res.status).toBe(200);
        const updatedRace = await db.race.findUniqueOrThrow({
            where: { id: race.id }
        });
        expect(updatedRace.isCompleted).toBe(true);
    });

    it("should return 400 if a position value is less than 1", async () => {
        // Arrange
        const students = await studentFactory.createList(5);
        const race = await raceFactory.create({
            name: "100m Dash",
            raceParticipants: {
                create: students.map((student, index) => ({
                    studentId: student.id,
                    lane: index + 1
                }))
            },
            isCompleted: false
        });

        // Act
        const url = `/v1/races/${race.id}/results`;
        const res = await request(app.getHttpServer())
            .patch(url)
            .send({
                results: students.map((student, index) => ({
                    studentId: student.id,
                    position: -index
                }))
            });

        // Assert
        expect(res.status).toBe(400);
    });

    it("should return 404 if race is not found", async () => {
        // Arrange
        const students = await studentFactory.createList(5);
        const nonExistentRaceId = "123e4567-e89b-12d3-a456-426614174000";

        // Act
        const url = `/v1/races/${nonExistentRaceId}/results`;
        const res = await request(app.getHttpServer())
            .patch(url)
            .send({
                results: students.map((student, index) => ({
                    studentId: student.id,
                    position: index + 1
                }))
            });

        // Assert
        expect(res.status).toBe(404);
        expect(res.body.message).toBe(
            `Race with ID ${nonExistentRaceId} not found.`
        );
    });

    it("should return 400 if the length of the results does not match the number of participants for the race", async () => {
        // Arrange
        const students = await studentFactory.createList(5);
        const race = await raceFactory.create({
            name: "100m Dash",
            raceParticipants: {
                create: students.map((student, index) => ({
                    studentId: student.id,
                    lane: index + 1
                }))
            },
            isCompleted: false
        });

        // Act
        const url = `/v1/races/${race.id}/results`;
        const res = await request(app.getHttpServer())
            .patch(url)
            .send({
                results: students.slice(0, 4).map((student, index) => ({
                    studentId: student.id,
                    position: index + 1
                }))
            });

        // Assert
        expect(res.status).toBe(400);

        // Check DB is not updated
        const existingRace = await db.race.findUniqueOrThrow({
            where: {
                id: race.id
            }
        });
        expect(existingRace.isCompleted).toBe(false);

        const existingRaceParticipants = await db.raceParticipant.findMany({
            where: {
                position: null
            }
        });
        expect(existingRaceParticipants.length).toBe(5);
    });

    it("should return 400 if a student ID in results does not match any participant in the race", async () => {
        // Arrange
        const students = await studentFactory.createList(5);
        const race = await raceFactory.create({
            name: "100m Dash",
            raceParticipants: {
                create: students.map((student, index) => ({
                    studentId: student.id,
                    lane: index + 1
                }))
            },
            isCompleted: false
        });

        // Act
        const results = students.slice(0, 4).map((student, index) => ({
            studentId: student.id,
            position: index + 1
        }));
        results.push({
            // Adding an invalid student ID
            studentId: "123e4567-e89b-12d3-a456-426614174000",
            position: 5
        });

        const url = `/v1/races/${race.id}/results`;
        const res = await request(app.getHttpServer()).patch(url).send({
            results
        });

        // Assert
        expect(res.status).toBe(400);

        // Check DB is not updated
        const existingRace = await db.race.findUniqueOrThrow({
            where: {
                id: race.id
            }
        });
        expect(existingRace.isCompleted).toBe(false);

        const existingRaceParticipants = await db.raceParticipant.findMany({
            where: {
                position: null
            }
        });
        expect(existingRaceParticipants.length).toBe(5);
    });

    it("should return 400 if there are gaps in the positions", async () => {
        // Arrange
        const students = await studentFactory.createList(5);
        const race = await raceFactory.create({
            name: "100m Dash",
            raceParticipants: {
                create: students.map((student, index) => ({
                    studentId: student.id,
                    lane: index + 1
                }))
            },
            isCompleted: false
        });

        // Act
        const url = `/v1/races/${race.id}/results`;
        const res = await request(app.getHttpServer())
            .patch(url)
            .send({
                results: [
                    { studentId: students[0].id, position: 1 },
                    { studentId: students[1].id, position: 2 },
                    { studentId: students[2].id, position: 4 }, // Gap here
                    { studentId: students[3].id, position: 5 },
                    { studentId: students[4].id, position: 6 }
                ]
            });

        // Assert
        expect(res.status).toBe(400);

        // Check DB is not updated
        const existingRace = await db.race.findUniqueOrThrow({
            where: {
                id: race.id
            }
        });
        expect(existingRace.isCompleted).toBe(false);

        const existingRaceParticipants = await db.raceParticipant.findMany({
            where: {
                position: null
            }
        });
        expect(existingRaceParticipants.length).toBe(5);
    });

    it("should return 400 if a tie is not handled correctly (e.g. [1, 1, 3, 3, 4])", async () => {
        // Arrange
        const students = await studentFactory.createList(5);
        const race = await raceFactory.create({
            name: "100m Dash",
            raceParticipants: {
                create: students.map((student, index) => ({
                    studentId: student.id,
                    lane: index + 1
                }))
            },
            isCompleted: false
        });

        // Act
        const url = `/v1/races/${race.id}/results`;
        const res = await request(app.getHttpServer())
            .patch(url)
            .send({
                results: [
                    { studentId: students[0].id, position: 1 },
                    { studentId: students[1].id, position: 1 },
                    { studentId: students[2].id, position: 3 },
                    { studentId: students[3].id, position: 3 },
                    { studentId: students[4].id, position: 4 }
                ]
            });

        // Assert
        expect(res.status).toBe(400);
        // Check DB is not updated
        const existingRace = await db.race.findUniqueOrThrow({
            where: {
                id: race.id
            }
        });
        expect(existingRace.isCompleted).toBe(false);

        const existingRaceParticipants = await db.raceParticipant.findMany({
            where: {
                position: null
            }
        });
        expect(existingRaceParticipants.length).toBe(5);
    });

    it("should return 400 if a student appears multiple times in results", async () => {
        // Arrange
        const students = await studentFactory.createList(5);
        const race = await raceFactory.create({
            name: "100m Dash",
            raceParticipants: {
                create: students.map((student, index) => ({
                    studentId: student.id,
                    lane: index + 1
                }))
            },
            isCompleted: false
        });

        // Act
        const url = `/v1/races/${race.id}/results`;
        const res = await request(app.getHttpServer())
            .patch(url)
            .send({
                results: [
                    { studentId: students[0].id, position: 1 },
                    { studentId: students[0].id, position: 2 },
                    { studentId: students[1].id, position: 3 },
                    { studentId: students[2].id, position: 4 },
                    { studentId: students[3].id, position: 5 }
                ]
            });

        // Assert
        expect(res.status).toBe(400);
        // Check DB is not updated
        const existingRace = await db.race.findUniqueOrThrow({
            where: {
                id: race.id
            }
        });
        expect(existingRace.isCompleted).toBe(false);

        const existingRaceParticipants = await db.raceParticipant.findMany({
            where: {
                position: null
            }
        });
        expect(existingRaceParticipants.length).toBe(5);
    });
});
