import { faker } from "@faker-js/faker";
import { getTestDb } from "@test/integration/utils/getTestDb";
import { Factory } from "fishery";
import { Student } from "@prisma/client";

export const studentFactory = Factory.define<Student>(({ onCreate }) => {
    const db = getTestDb();

    onCreate(async (student) => {
        return db.student.create({
            data: student
        });
    });

    return {
        id: faker.string.uuid(),
        name: faker.person.fullName()
    };
});
