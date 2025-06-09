export interface Race {
  id: string;
  name: string;
  isCompleted: boolean;
  participants: RaceParticipant[];
}

export interface RaceParticipant {
  student: Student;
  lane: number;
  position: number | null;
}

export interface Student {
  id: string;
  name: string;
}
