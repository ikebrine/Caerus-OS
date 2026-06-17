import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { TenantService } from "./tenant.service";

@UseGuards(JwtAuthGuard)
@Controller("tenant")
export class TenantController {
  constructor(private readonly tenants: TenantService) {}

  @Get("profile")
  profile(@Req() request: { user: { tenantId: string } }) {
    return this.tenants.profile(request.user.tenantId);
  }
}
