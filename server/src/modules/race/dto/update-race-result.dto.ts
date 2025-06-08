import { Type } from "class-transformer";
import {
    ArrayNotEmpty,
    IsDefined,
    IsInt,
    IsUUID,
    Min,
    ValidateNested
} from "class-validator";

export class UpdateRaceResultDTO {
    @ValidateNested({ each: true })
    @ArrayNotEmpty({ message: "Results are required." })
    @Type(() => RaceResultsDTO)
    results: RaceResultsDTO[];
}

class RaceResultsDTO {
    @IsUUID(4, { message: "Student ID must be a valid UUID." })
    studentId: string;

    @Min(1, { message: "Position must be at least 1" })
    @IsInt({ message: "Position must be an integer." })
    @IsDefined({ message: "Position is required." })
    position: number;
}
