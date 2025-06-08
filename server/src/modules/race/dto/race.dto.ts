import { StudentDTO } from "@src/modules/student/dto/student.dto";

export class RaceDTO {
    id: string;
    name: string;
    isCompleted: boolean;
    participants: RaceParticipantDTO[];
}

class RaceParticipantDTO {
    student: StudentDTO;
    lane: number;
    position: number | null;
}
