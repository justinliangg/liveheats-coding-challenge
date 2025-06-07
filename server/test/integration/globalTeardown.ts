import { getTestDb } from "./utils/getTestDb";

const teardown = () => {
    const db = getTestDb();
    db.$disconnect();
};

export default teardown;
