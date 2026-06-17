import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { IsArray, IsBoolean, IsString } from "class-validator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RequirePermissions } from "../rbac/permissions.decorator";
import { RbacGuard } from "../rbac/rbac.guard";
import { WorkflowService } from "./workflow.service";

class WorkflowDto {
  @IsString()
  name!: string;

  @IsString()
  trigger!: string;

  @IsArray()
  conditions!: unknown[];

  @IsArray()
  actions!: unknown[];

  @IsBoolean()
  enabled!: boolean;
}

@UseGuards(JwtAuthGuard, RbacGuard)
@Controller("workflow")
export class WorkflowController {
  constructor(private readonly workflows: WorkflowService) {}

  @RequirePermissions("CREATE_WORKFLOW")
  @Post()
  create(@Body() dto: WorkflowDto, @Req() request: { user: { tenantId: string; sub: string } }) {
    return this.workflows.create(request.user.tenantId, request.user.sub, dto);
  }
}
