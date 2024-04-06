import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { RepositoryService } from "../repository/repository.service";
import { CreateUserDto, LoginDto } from "./dto/auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private repositoryService: RepositoryService,
    private configsService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async userSignUp(dto: CreateUserDto) {
    try {
      const { name, email, password, confirmPassword } = dto;
      // verificar se o usuário já existe
      const userExists = await this.verifyIfUserExists(email);
      if (userExists) {
        return new HttpException("Usuário já existe", HttpStatus.CONFLICT);
      }
      if (password !== confirmPassword) {
        return new HttpException("Senhas não correspondem.", HttpStatus.BAD_REQUEST);
      }

      const salt = await bcrypt.genSalt();
      const password_hash = await this.passwordHash(password, salt);
      const user = await this.repositoryService.user.create({
        data: {
          password_hash,
          salt,
          name,
          email,
        },
      });
      delete user.password_hash;
      delete user.salt;
      
      const { id } = user;
      return await this.signToken(id);
    } catch (error) {
      if (error.code === "23505") {
        return new HttpException("Usuário já existe", HttpStatus.CONFLICT);
      } else {
        throw new HttpException("Erro interno", error.message);
      }
    }
  }

  async userSignIn(dto: LoginDto) {
    try {
      const { email, password } = dto;
      const user = await this.repositoryService.user.findUnique({
        where: { email },
      });
      const { id, password_hash, salt } = user;
      const comparePassword = await this.passwordHash(password, salt);
      const isMatch = comparePassword === password_hash;

      if (user && isMatch) {
        return await this.signToken(id);
      } else {
        return new HttpException("Credenciais Inválidas", HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async passwordHash(password: string, salt: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  async signToken(id: string): Promise<{ token: string }> {
    try {
      const payload = {
        id,
      };
      const secret = this.configsService.get("JWT_SECRET");
      const token = await this.jwtService.signAsync(payload, {
        expiresIn: "3d",
        secret,
      });
      const perfil = await this.userInfo(id);
      const data = { token, perfil, status: 200 };
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async userInfo(id: string) {
    try {
      const user = await this.repositoryService.user.findUnique({
        where: { id },
      });
      delete user.password_hash;
      delete user.salt;
      delete user.id;
      delete user.createdAt;
      delete user.updatedAt;
      delete user.isAdmin;
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async verifyIfUserExists(email: string) {
    try {
      const user = await this.repositoryService.user.findUnique({
        where: { email },
      });
      if (user) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
