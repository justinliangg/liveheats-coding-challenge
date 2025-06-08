import { Body, Controller, Get, Post } from "@nestjs/common";
import { RaceService } from "./race.service";
import { CreateRaceDTO } from "./dto/create-race.dto";

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
}
