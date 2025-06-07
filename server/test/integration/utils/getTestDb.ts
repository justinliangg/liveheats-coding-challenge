import { PrismaClient } from "@prisma/client";

export const getTestDb = () => {
    return global.db as PrismaClient;
};
