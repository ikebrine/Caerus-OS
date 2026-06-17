import { Module } from "@nestjs/common";
import { AuditModule } from "../audit/audit.module";
import { BusinessModulesController } from "./modules.controller";
import { BusinessModulesService } from "./modules.service";

@Module({
  imports: [AuditModule],
  controllers: [BusinessModulesController],
  providers: [BusinessModulesService],
})
export class ModulesModule {}
