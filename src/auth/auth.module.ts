import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { RepositoryModule } from "src/repository/repository.module";
import { RepositoryService } from "../repository/repository.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserJwtStrategy } from "./jwt/jwt.strategy";

@Module({
  imports: [RepositoryModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, UserJwtStrategy, RepositoryService],
})
export class AuthModule {}
