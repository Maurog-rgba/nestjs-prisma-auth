import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "The email of the user to login" })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "The password of the user to login" })
  password: string;
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "The username of the admin" })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "The email of the admin" })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "The phone number of the admin" })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "The password of the admin" })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "The password of the admin" })
  confirmPassword: string;
}
