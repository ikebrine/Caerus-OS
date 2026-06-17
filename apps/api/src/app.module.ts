import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { AiModule } from "./ai/ai.module";
import { AuditModule } from "./audit/audit.module";
import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./database.module";
import { ModulesModule } from "./modules/modules.module";
import { RbacModule } from "./rbac/rbac.module";
import { TenantModule } from "./tenant/tenant.module";
import { WorkflowModule } from "./workflow/workflow.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: { url: config.get<string>("REDIS_URL") ?? "redis://localhost:6379" },
      }),
    }),
    DatabaseModule,
    AuthModule,
    TenantModule,
    RbacModule,
    AuditModule,
    ModulesModule,
    AiModule,
    WorkflowModule,
  ],
})
export class AppModule {}
