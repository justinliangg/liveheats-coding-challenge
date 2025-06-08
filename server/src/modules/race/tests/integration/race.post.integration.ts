import { app } from "@test/integration/setupTests";
import * as request from "supertest";
import { getTestDb } from "@test/integration/utils/getTestDb";
import { PrismaClient } from "@prisma/client";
import { studentFactory } from "@test/factories/student.factory";

describe("POST /v1/races", () => {
    let db: PrismaClient;

    beforeAll(async () => {
        db = getTestDb();
    });

    it("should be able to create a race successfully with two or more participants", async () => {
        // Arrange
        const students = await studentFactory.createList(5);

        // Act
        const url = `/v1/races`;
        const res = await request(app.getHttpServer())
            .post(url)
            .send({
                name: "100m Dash",
                participants: students.map((student, index) => ({
                    studentId: student.id,
                    lane: index + 1
                }))
            });

        // Assert
        expect(res.status).toBe(201);

        const races = await db.race.findMany({
            include: {
                raceParticipants: {
                    include: {
                        student: true
                    }
                }
            }
        });
        expect(races.length).toBe(1);

        const createdRace = races[0];
        expect(createdRace.name).toBe("100m Dash");
        expect(createdRace.isCompleted).toBe(false);
        expect(createdRace.raceParticipants.length).toBe(5);

        const raceParticipants = createdRace.raceParticipants.map((p) => ({
            studentId: p.student.id,
            lane: p.lane
        }));
        expect(raceParticipants).toEqual(
            students.map((student, index) => ({
                studentId: student.id,
                lane: index + 1
            }))
        );
    });

    it("should return 400 if less than two participants are provided", async () => {
        // Arrange
        const students = await studentFactory.createList(1);

        // Act
        const url = `/v1/races`;
        const res = await request(app.getHttpServer())
            .post(url)
            .send({
                name: "100m Dash",
                participants: students.map((student, index) => ({
                    studentId: student.id,
                    lane: index + 1
                }))
            });

        // Assert
        expect(res.status).toBe(400);
        expect(res.body.message).toContain(
            "At least 2 participants are required"
        );
    });

    it("should return 400 if a participant's lane is not unique", async () => {
        // Arrange
        const students = await studentFactory.createList(3);

        // Act
        const url = `/v1/races`;
        const res = await request(app.getHttpServer())
            .post(url)
            .send({
                name: "100m Dash",
                participants: [
                    { studentId: students[0].id, lane: 1 },
                    { studentId: students[1].id, lane: 2 },
                    { studentId: students[2].id, lane: 1 }
                ]
            });

        // Assert
        expect(res.status).toBe(400);
        expect(res.body.message).toContain(
            "Lane 1 is already taken by another participant."
        );
    });

    it("should return 400 if a participant has been assigned to more than one lane", async () => {
        // Arrange
        const students = await studentFactory.createList(5);

        // Act
        const url = `/v1/races`;
        const res = await request(app.getHttpServer())
            .post(url)
            .send({
                name: "100m Dash",
                participants: [
                    { studentId: students[0].id, lane: 1 },
                    { studentId: students[1].id, lane: 2 },
                    { studentId: students[0].id, lane: 3 }
                ]
            });

        // Assert
        expect(res.status).toBe(400);
        expect(res.body.message).toContain(
            "Student ID " +
                students[0].id +
                " is already registered as a participant."
        );
    });

    it("should return 400 if a participant's studentId does not exist", async () => {
        // Arrange
        const students = await studentFactory.createList(2);

        // Act
        const url = `/v1/races`;
        const res = await request(app.getHttpServer())
            .post(url)
            .send({
                name: "100m Dash",
                participants: [
                    { studentId: students[0].id, lane: 1 },
                    {
                        studentId: "730ac4f1-ca18-4bef-89b8-b0f35bda89b5", // Non-existent student ID
                        lane: 2
                    }
                ]
            });

        // Assert
        expect(res.status).toBe(400);
        expect(res.body.message).toContain(
            "One or more student IDs do not exist in the database"
        );
    });
});
