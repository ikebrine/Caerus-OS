import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { IsString, MinLength } from "class-validator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RequirePermissions } from "../rbac/permissions.decorator";
import { RbacGuard } from "../rbac/rbac.guard";
import { AiService } from "./ai.service";

class AskDto {
  @IsString()
  @MinLength(5)
  question!: string;
}

@UseGuards(JwtAuthGuard, RbacGuard)
@Controller("ai")
export class AiController {
  constructor(private readonly ai: AiService) {}

  @RequirePermissions("ASK_BUSINESS_AI")
  @Post("ask")
  ask(@Body() dto: AskDto, @Req() request: { user: { tenantId: string; sub: string } }) {
    return this.ai.answerBusinessQuestion(request.user.tenantId, request.user.sub, dto.question);
  }
}
