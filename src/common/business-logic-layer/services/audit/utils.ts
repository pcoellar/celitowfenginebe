export class AuditableFieldsManager {
  IncludeAuditableFieldsOnCreate(entity: any) {
    return {
      ...entity,
      createdDate: new Date(),
    };
  }

  IncludeAuditableFieldsOnUpdate(entity: any) {
    return {
      ...entity,
      lastModified: new Date(),
    };
  }
}
