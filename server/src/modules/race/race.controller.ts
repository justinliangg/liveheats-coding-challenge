import { Controller, Get } from "@nestjs/common";
import { RaceService } from "./race.service";

@Controller("races")
export class RaceController {
    constructor(private readonly raceService: RaceService) {}

    @Get("/")
    async getRaces() {
        return this.raceService.getMany();
    }
}
