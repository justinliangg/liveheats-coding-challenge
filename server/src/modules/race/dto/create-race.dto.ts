import { Type } from "class-transformer";
import {
    ArrayNotEmpty,
    IsDefined,
    IsInt,
    IsString,
    IsUUID,
    Min,
    ValidateNested
} from "class-validator";

class CreateRaceParticipantDTO {
    @IsUUID(4, { message: "Student ID must be a valid UUID." })
    @IsDefined({ message: "Student ID is required." })
    studentId: string;

    @Min(1, { message: "Lane must be at least 1." })
    @IsInt({ message: "Lane must be an integer." })
    @IsDefined({ message: "Lane is required." })
    lane: number;
}

export class CreateRaceDTO {
    @IsString()
    @IsDefined({ message: "Name is required." })
    name: string;

    @ValidateNested({ each: true })
    @ArrayNotEmpty({ message: "Participants are required." })
    @Type(() => CreateRaceParticipantDTO)
    participants: CreateRaceParticipantDTO[];
}
