import {
    BadRequestException,
    Injectable,
    NotFoundException
} from "@nestjs/common";
import { Prisma, PrismaPromise } from "@prisma/client";
import { PrismaService } from "@src/prisma.service";
import { RaceDTO } from "./dto/race.dto";
import { CreateRaceDTO } from "./dto/create-race.dto";
import { UpdateRaceResultDTO } from "./dto/update-race-result.dto";

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

    async updateResults(
        raceId: string,
        data: UpdateRaceResultDTO
    ): Promise<void> {
        const raceResults = data.results;

        const race = await this.prismaService.race.findUnique({
            where: { id: raceId },
            include: {
                raceParticipants: {
                    include: {
                        student: true
                    }
                }
            }
        });
        if (!race) {
            throw new NotFoundException(`Race with ID ${raceId} not found.`);
        }

        // Check participant ids are valid
        const studentIds = Array.from(
            new Set(raceResults.map((result) => result.studentId))
        );
        const existingParticipants = race.raceParticipants.map(
            (p) => p.student.id
        );

        if (studentIds.length !== existingParticipants.length) {
            throw new BadRequestException(
                "The number of results does not match the number of participants for the race"
            );
        }

        const invalidParticipants = studentIds.filter(
            (id) => !existingParticipants.includes(id)
        );
        if (invalidParticipants.length > 0) {
            throw new BadRequestException(
                `Invalid participant IDs: ${invalidParticipants.join(", ")}`
            );
        }

        // Validating race positions
        const racePositions = raceResults.map((result) => result.position);
        this.validateRacePositions(racePositions);

        // Update race results
        const transactions: PrismaPromise<unknown>[] = raceResults.map(
            (result) =>
                this.prismaService.raceParticipant.updateMany({
                    where: {
                        raceId,
                        studentId: result.studentId
                    },
                    data: {
                        position: result.position
                    }
                })
        );
        transactions.push(
            this.prismaService.race.update({
                where: { id: raceId },
                data: { isCompleted: true }
            })
        );
        await this.prismaService.$transaction(transactions);
    }

    /**
     * Validates the sequence of the race positions provided.
     * @param positions
     * @throws {BadRequestException} if the positions are not in a valid sequence
     */
    private validateRacePositions(positions: number[]): void {
        // Getting the count of each position
        const positionCountMap = new Map<number, number>();
        for (const pos of positions) {
            positionCountMap.set(pos, (positionCountMap.get(pos) || 0) + 1);
        }

        // Sort the unique positions in ascending order
        const sortedPositions = Array.from(positionCountMap.keys()).sort(
            (a, b) => a - b
        );

        // Check for gaps based on tie rules
        let expectedPosition = 1;
        for (const position of sortedPositions) {
            if (position !== expectedPosition) {
                throw new BadRequestException(
                    `Invalid sequence: expected position ${expectedPosition}, but got ${position}.`
                );
            }
            expectedPosition += positionCountMap.get(position)!;
        }
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
