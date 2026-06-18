import { BullModule } from "@nestjs/bullmq";
import { DynamicModule } from "@nestjs/common";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { AiModule } from "./ai/ai.module";
import { AuditModule } from "./audit/audit.module";
import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./database.module";
import { ModulesModule } from "./modules/modules.module";
import { RbacModule } from "./rbac/rbac.module";
import { TenantModule } from "./tenant/tenant.module";
import { WorkflowModule } from "./workflow/workflow.module";

function queueRootModule(): DynamicModule {
  if (!process.env.REDIS_URL) {
    return BullModule.forRoot({ connection: { host: "127.0.0.1", port: 6379, lazyConnect: true } });
  }

  return BullModule.forRoot({
    connection: { url: process.env.REDIS_URL },
  });
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    queueRootModule(),
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
