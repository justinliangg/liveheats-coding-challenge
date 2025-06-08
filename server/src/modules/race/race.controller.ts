import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post
} from "@nestjs/common";
import { RaceService } from "./race.service";
import { CreateRaceDTO } from "./dto/create-race.dto";
import { UpdateRaceResultDTO } from "./dto/update-race-result.dto";

@Controller("races")
export class RaceController {
    constructor(private readonly raceService: RaceService) {}

    @Get("/")
    async getRaces() {
        return this.raceService.getMany();
    }

    @Post("/")
    async createRace(@Body() createRaceDto: CreateRaceDTO) {
        await this.raceService.create(createRaceDto);
    }

    @Patch("/:raceId/results")
    async updateRaceResults(
        @Param("raceId", ParseUUIDPipe) raceId: string,
        @Body() data: UpdateRaceResultDTO
    ) {
        return this.raceService.updateResults(raceId, data);
    }
}
