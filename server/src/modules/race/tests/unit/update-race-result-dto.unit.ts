import { validate } from "class-validator";

import { UpdateRaceResultDTO } from "../../dto/update-race-result.dto";
import { plainToInstance } from "class-transformer";

describe("UpdateRaceResultDTO", () => {
    it("should pass with valid data", async () => {
        // Arrange
        const validRaceResultData = {
            results: [
                {
                    studentId: "ecfc7251-8efc-4fdd-8786-0b009014138b",
                    position: 1
                },
                {
                    studentId: "321ba242-bc80-43dd-bce7-ca104f99d4b4",
                    position: 2
                }
            ]
        };

        // Act
        const raceResultDTO = plainToInstance(
            UpdateRaceResultDTO,
            validRaceResultData
        );
        const errors = await validate(raceResultDTO);

        // Assert
        expect(errors.length).toBe(0);
    });

    it("should fail if the studentId is not a valid UUID", async () => {
        // Arrange
        const invalidRaceResultData = {
            results: [
                {
                    studentId: "invalid-uuid",
                    position: 1
                },
                {
                    studentId: "321ba242-bc80-43dd-bce7-ca104f99d4b4",
                    position: 2
                }
            ]
        };

        // Act
        const raceResultDTO = plainToInstance(
            UpdateRaceResultDTO,
            invalidRaceResultData
        );
        const errors = await validate(raceResultDTO);

        // Assert
        expect(errors.length).toBe(1);
    });

    it("should fail if position is not an integer", async () => {
        // Arrange
        const invalidRaceResultData = {
            results: [
                {
                    studentId: "ecfc7251-8efc-4fdd-8786-0b009014138b",
                    position: "one" // Invalid position
                },
                {
                    studentId: "321ba242-bc80-43dd-bce7-ca104f99d4b4",
                    position: 2
                }
            ]
        };

        // Act
        const raceResultDTO = plainToInstance(
            UpdateRaceResultDTO,
            invalidRaceResultData
        );
        const errors = await validate(raceResultDTO);

        // Assert
        expect(errors.length).toBe(1);
    });

    it("should fail if position is less than 1", async () => {
        // Arrange
        const invalidRaceResultData = {
            results: [
                {
                    studentId: "ecfc7251-8efc-4fdd-8786-0b009014138b",
                    position: 0 // Invalid position
                },
                {
                    studentId: "321ba242-bc80-43dd-bce7-ca104f99d4b4",
                    position: 2
                }
            ]
        };

        // Act
        const raceResultDTO = plainToInstance(
            UpdateRaceResultDTO,
            invalidRaceResultData
        );
        const errors = await validate(raceResultDTO);

        // Assert
        expect(errors.length).toBe(1);
    });

    it("should fail if position is not defined", async () => {
        // Arrange
        const invalidRaceResultData = {
            results: [
                {
                    studentId: "ecfc7251-8efc-4fdd-8786-0b009014138b"
                    // Missing position
                },
                {
                    studentId: "321ba242-bc80-43dd-bce7-ca104f99d4b4",
                    position: 2
                }
            ]
        };

        // Act
        const raceResultDTO = plainToInstance(
            UpdateRaceResultDTO,
            invalidRaceResultData
        );
        const errors = await validate(raceResultDTO);

        // Assert
        expect(errors.length).toBe(1);
    });
});
