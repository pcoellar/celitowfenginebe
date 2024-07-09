import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditableFieldsManager } from 'src/common/business-logic-layer/services/audit/utils';
import { IPendingActionRepositoryService } from './interfaces/pending-action-repository.interface';
import { PendingActionEntity } from 'src/wfengine/entities/data-entities/pending-action.data.entity';

@Injectable()
export class PendingActionRepositoryService
  implements IPendingActionRepositoryService
{
  constructor(
    @InjectRepository(PendingActionEntity)
    private readonly entityRepository: Repository<PendingActionEntity>,
  ) {}

  async findAll(): Promise<PendingActionEntity[]> {
    const entities: PendingActionEntity[] = await this.entityRepository.find();
    return entities;
  }

  async findByFilter(filter: any): Promise<PendingActionEntity[]> {
    try {
      return await this.entityRepository.find({ where: filter });
    } catch {
      throw new NotFoundException();
    }
  }

  async find(id: string): Promise<PendingActionEntity> {
    try {
      return await this.entityRepository.findOne({ where: { id } });
    } catch {
      throw new NotFoundException();
    }
  }

  async create(entity: PendingActionEntity): Promise<PendingActionEntity> {
    const auditableFieldsManager = new AuditableFieldsManager();
    entity = auditableFieldsManager.IncludeAuditableFieldsOnCreate(entity);
    const data = this.entityRepository.create(entity);
    const result = await this.entityRepository.save(data);
    return result;
  }

  async update(
    entity: Partial<PendingActionEntity>,
  ): Promise<PendingActionEntity> {
    const auditableFieldsManager = new AuditableFieldsManager();
    entity = auditableFieldsManager.IncludeAuditableFieldsOnUpdate(entity);
    let entityToModify: PendingActionEntity = await this.find(entity.id);
    if (!entityToModify) {
      throw new NotFoundException();
    }
    entityToModify = {
      ...entityToModify,
      ...entity,
    };
    const result: PendingActionEntity =
      await this.entityRepository.save(entityToModify);
    return result;
  }

  async delete(id: string) {
    const entityToDelete: PendingActionEntity = await this.find(id);
    if (!entityToDelete) {
      throw new NotFoundException();
    }
    await this.entityRepository.remove(entityToDelete);
  }
}
