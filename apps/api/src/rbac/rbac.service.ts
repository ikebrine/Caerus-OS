import { Injectable } from "@nestjs/common";

@Injectable()
export class RbacService {
  hasAll(actual: string[], required: string[]) {
    const permissions = new Set(actual);
    return required.every((permission) => permissions.has(permission));
  }

  withinApprovalAuthority(limit: number | null | undefined, amount: number) {
    return limit == null || amount <= limit;
  }
}
