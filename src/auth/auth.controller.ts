import { Body, Controller, Post } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { CreateUserDto, LoginDto } from "./dto/auth.dto";

@ApiTags("Autenticação de Usuário")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("user/create")
  async userSignup(@Body() dto: CreateUserDto) {
    return await this.authService.userSignUp(dto);
  }

  @Post("user/login")
  @ApiOperation({ summary: "Login como um usuário normal" })
  @ApiResponse({
    status: 200,
    description: "Usuário logado com sucesso.",
    schema: {
      type: "object",
      properties: {
        token: {
          type: "string",
          example:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE2MWNkNTE2LTZmZTUtNDdjNy1iOThkLWI1NTE1MzFmMmI3NyIsImlhdCI6MTcwNjM1Njg4MiwiZXhwIjoxNzA2NjE2MDgyfQ.PTOUKCCpZpSBOoHhQCilvbWalthErtg_4L-f7-aLaRw",
        },
        perfil: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "Mario",
            },
            fullName: {
              type: "string",
              example: "Mario dos Santos",
            },
            email: {
              type: "string",
              example: "mario@email.com",
            },
          },
        },
      },
    },
  })
  @ApiBody({
    type: LoginDto,
    description: "Detalhes necessarios para efetuar o login como usuario",
    examples: {
      a: {
        summary: "User Login Example",
        value: {
          email: "string",
          password: "string",
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Credenciais inválidas",
    schema: {
      type: "object",
      properties: {
        status: {
          type: "number",
          example: 400,
        },
        message: {
          type: "string",
          example: "Credenciais inválidas",
        },
      },
    },
  })
  async userSignIn(@Body() dto: LoginDto) {
    return await this.authService.userSignIn(dto);
  }
}
