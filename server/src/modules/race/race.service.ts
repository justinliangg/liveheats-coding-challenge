import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "@src/prisma.service";
import { RaceDTO } from "./dto/race.dto";
import { CreateRaceDTO } from "./dto/create-race.dto";
import { validate } from "class-validator";

type RaceWithParticipants = Prisma.RaceGetPayload<{
    include: {
        raceParticipants: {
            include: {
                student: true;
            };
        };
    };
}>;

@Injectable()
export class RaceService {
    constructor(private readonly prismaService: PrismaService) {}

    async getMany(): Promise<RaceDTO[]> {
        const races = await this.prismaService.race.findMany({
            include: {
                raceParticipants: {
                    include: {
                        student: true
                    }
                }
            }
        });

        const mappedRaces = races.map((race) => this.toDTO(race));
        return mappedRaces;
    }

    async create(data: CreateRaceDTO): Promise<RaceDTO> {
        this.validateParticipants(data.participants);

        const studentIds = data.participants.map((p) => p.studentId);
        await this.validateStudentIds(studentIds);

        const createdRace = await this.prismaService.race.create({
            data: {
                name: data.name,
                raceParticipants: {
                    create: data.participants.map((participant) => ({
                        studentId: participant.studentId,
                        lane: participant.lane
                    }))
                }
            },
            include: {
                raceParticipants: {
                    include: {
                        student: true
                    }
                }
            }
        });

        return this.toDTO(createdRace);
    }

    /**
     * Validates that all student IDs exist in the database.
     * @param studentIds
     * @throws {BadRequestException} if any student ID does not exist
     */
    private async validateStudentIds(studentIds: string[]): Promise<void> {
        const students = await this.prismaService.student.findMany({
            where: {
                id: {
                    in: studentIds
                }
            }
        });

        if (students.length !== studentIds.length) {
            throw new BadRequestException(
                "One or more student IDs do not exist in the database."
            );
        }
    }

    /**
     * Validates that the participants array has at least 2 participants,
     * and that each participant has a unique lane and studentId.
     * @param participants
     * @throws {BadRequestException} if validation fails
     */
    private validateParticipants(
        participants: CreateRaceDTO["participants"]
    ): void {
        if (participants.length < 2) {
            throw new BadRequestException(
                "At least 2 participants are required."
            );
        }

        const laneSet = new Set<number>();
        const studentIdSet = new Set<string>();

        for (const participant of participants) {
            if (laneSet.has(participant.lane)) {
                throw new BadRequestException(
                    `Lane ${participant.lane} is already taken by another participant.`
                );
            }
            laneSet.add(participant.lane);

            if (studentIdSet.has(participant.studentId)) {
                throw new BadRequestException(
                    `Student ID ${participant.studentId} is already registered as a participant.`
                );
            }
            studentIdSet.add(participant.studentId);
        }
    }

    toDTO(race: RaceWithParticipants): RaceDTO {
        return {
            id: race.id,
            name: race.name,
            isCompleted: race.isCompleted,
            participants: race.raceParticipants.map((participant) => ({
                student: {
                    id: participant.student.id,
                    name: participant.student.name
                },
                lane: participant.lane,
                position: participant.position
            }))
        };
    }
}
