import { faker } from "@faker-js/faker";
import { getTestDb } from "@test/integration/utils/getTestDb";
import { Factory } from "fishery";
import { Example } from "@prisma/client";

export const exampleFactory = Factory.define<Example>(
    ({ onCreate, sequence }) => {
        const db = getTestDb();

        onCreate(async (example) => {
            return db.example.create({
                data: example
            });
        });

        return {
            id: faker.string.uuid(),
            name: String(sequence)
        };
    }
);
