import { faker } from "@faker-js/faker";
import { Prisma, Race } from "@prisma/client";
import { getTestDb } from "@test/integration/utils/getTestDb";
import { Factory } from "fishery";

export const raceFactory = Factory.define<
    Prisma.RaceCreateInput,
    unknown,
    Race
>(({ onCreate }) => {
    const db = getTestDb();

    onCreate(async (raceWithParticipants) => {
        return db.race.create({
            data: raceWithParticipants
        });
    });

    return {
        id: faker.string.uuid(),
        name: faker.word.words(3),
        isCompleted: faker.datatype.boolean()
    };
});
