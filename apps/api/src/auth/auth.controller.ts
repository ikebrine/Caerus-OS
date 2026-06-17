import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { IsEmail, IsString, MinLength } from "class-validator";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";

class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  tenantSlug!: string;
}

class ResetDto {
  @IsEmail()
  email!: string;

  @IsString()
  tenantSlug!: string;
}

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("login")
  login(@Body() dto: LoginDto, @Req() request: { headers: Record<string, string | undefined> }) {
    return this.auth.login(dto, request.headers["user-agent"]);
  }

  @Post("password-reset")
  requestPasswordReset(@Body() dto: ResetDto) {
    return this.auth.requestPasswordReset(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("session")
  session(@Req() request: { user: unknown }) {
    return request.user;
  }
}
