import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "@src/prisma.service";
import { RaceDTO } from "./dto/race.dto";

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
