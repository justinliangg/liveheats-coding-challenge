import { Logger, Module } from "@nestjs/common";
import { PrismaService } from "@src/prisma.service";
import { RaceController } from "./race.controller";
import { RaceService } from "./race.service";

@Module({
    imports: [],
    controllers: [RaceController],
    providers: [Logger, RaceService, PrismaService],
    exports: [RaceService]
})
export class RaceModule {}
