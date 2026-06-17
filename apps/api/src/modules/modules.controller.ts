import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RequirePermissions } from "../rbac/permissions.decorator";
import { RbacGuard } from "../rbac/rbac.guard";
import { BusinessModulesService } from "./modules.service";

class CreatePaymentDto {
  @IsString()
  title!: string;

  @IsNumber()
  amount!: number;

  @IsOptional()
  @IsString()
  vendor?: string;

  @IsOptional()
  @IsString()
  costCenter?: string;
}

@UseGuards(JwtAuthGuard, RbacGuard)
@Controller("modules")
export class BusinessModulesController {
  constructor(private readonly modules: BusinessModulesService) {}

  @Get("command-center")
  commandCenter(@Req() request: { user: { tenantId: string } }) {
    return this.modules.commandCenter(request.user.tenantId);
  }

  @Get(":moduleName")
  moduleOverview(@Param("moduleName") moduleName: string, @Req() request: { user: { tenantId: string } }) {
    return this.modules.overview(request.user.tenantId, moduleName);
  }

  @RequirePermissions("CREATE_PAYMENT")
  @Post("finance/payments")
  createPayment(@Body() dto: CreatePaymentDto, @Req() request: { user: { tenantId: string; sub: string } }) {
    return this.modules.createPaymentRequest(request.user.tenantId, request.user.sub, dto);
  }
}
