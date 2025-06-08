import { validate } from "class-validator";

import { CreateRaceDTO } from "../../dto/create-race.dto";
import { plainToInstance } from "class-transformer";

describe("CreateRaceDTO", () => {
    it("should pass with valid data", async () => {
        // Arrange
        const validRaceData = {
            name: "100m Dash",
            participants: [
                {
                    studentId: "321ba242-bc80-43dd-bce7-ca104f99d4b4",
                    lane: 1
                },
                {
                    studentId: "2d264676-d858-41c2-9432-a64f27b8b2bf",
                    lane: 2
                }
            ]
        };

        // Act
        const raceDTO = plainToInstance(CreateRaceDTO, validRaceData);
        const errors = await validate(raceDTO);

        // Assert
        expect(errors.length).toBe(0);
    });

    it("should fail if participants list is empty", async () => {
        // Arrange
        const invalidRaceData = {
            name: "100m Dash",
            participants: []
        };

        // Act
        const raceDTO = plainToInstance(CreateRaceDTO, invalidRaceData);
        const errors = await validate(raceDTO);

        // Assert
        expect(errors.length).toBe(1);
        expect(errors[0].constraints).toEqual({
            arrayNotEmpty: "Participants are required."
        });
    });

    it("should fail if participant's studentId is not a valid UUID", async () => {
        // Arrange
        const invalidRaceData = {
            name: "100m Dash",
            participants: [
                {
                    studentId: "invalid-uuid",
                    lane: 1
                }
            ]
        };

        // Act
        const raceDTO = plainToInstance(CreateRaceDTO, invalidRaceData);
        const errors = await validate(raceDTO);

        // Assert
        expect(errors.length).toBe(1);
    });

    it("should fail if participant's lane is not a positive integer", async () => {
        // Arrange
        const invalidRaceData = {
            name: "100m Dash",
            participants: [
                {
                    studentId: "ecfc7251-8efc-4fdd-8786-0b009014138b",
                    lane: 0 // Invalid lane
                }
            ]
        };

        // Act
        const raceDTO = plainToInstance(CreateRaceDTO, invalidRaceData);
        const errors = await validate(raceDTO);

        // Assert
        expect(errors.length).toBe(1);
    });
});
