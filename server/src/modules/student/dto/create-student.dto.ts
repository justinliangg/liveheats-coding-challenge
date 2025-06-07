import { IsDefined, IsString } from "class-validator";

export class CreateStudentDTO {
    @IsString()
    @IsDefined({ message: "Name is required." })
    name: string;
}
