import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
    constructor() {}

    @Get("/healthcheck")
    healthcheck() {
        return "Service is healthy";
    }
}
