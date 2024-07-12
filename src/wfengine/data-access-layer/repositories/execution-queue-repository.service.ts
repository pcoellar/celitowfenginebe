import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditableFieldsManager } from 'src/common/business-logic-layer/services/audit/utils';
import { IExecutionQueueRepositoryService } from './interfaces/execution-queue-repository.interface';
import { ExecutionQueueEntity } from 'src/wfengine/entities/data-entities/execution-queue.data.entity';

@Injectable()
export class ExecutionQueueRepositoryService
  implements IExecutionQueueRepositoryService
{
  constructor(
    @InjectRepository(ExecutionQueueEntity)
    private readonly entityRepository: Repository<ExecutionQueueEntity>,
  ) {}

  async findAll(relations?: string[]): Promise<ExecutionQueueEntity[]> {
    const entities: ExecutionQueueEntity[] = await this.entityRepository.find({
      relations: relations ?? [],
    });
    return entities;
  }

  async findByFilter(
    filter: any,
    relations?: string[],
  ): Promise<ExecutionQueueEntity[]> {
    try {
      return await this.entityRepository.find({
        where: filter,
        relations: relations ?? [],
      });
    } catch {
      throw new NotFoundException();
    }
  }

  async find(id: string, relations?: string[]): Promise<ExecutionQueueEntity> {
    try {
      return await this.entityRepository.findOne({
        where: { id },
        relations: relations ?? [],
      });
    } catch {
      throw new NotFoundException();
    }
  }

  async create(entity: ExecutionQueueEntity): Promise<ExecutionQueueEntity> {
    const auditableFieldsManager = new AuditableFieldsManager();
    entity = auditableFieldsManager.IncludeAuditableFieldsOnCreate(entity);
    const data = this.entityRepository.create(entity);
    const result = await this.entityRepository.save(data);
    return result;
  }

  async update(
    entity: Partial<ExecutionQueueEntity>,
  ): Promise<ExecutionQueueEntity> {
    const auditableFieldsManager = new AuditableFieldsManager();
    entity = auditableFieldsManager.IncludeAuditableFieldsOnUpdate(entity);
    let entityToModify: ExecutionQueueEntity = await this.find(entity.id);
    if (!entityToModify) {
      throw new NotFoundException();
    }
    entityToModify = {
      ...entityToModify,
      ...entity,
    };
    const result: ExecutionQueueEntity =
      await this.entityRepository.save(entityToModify);
    return result;
  }

  async delete(id: string) {
    const entityToDelete: ExecutionQueueEntity = await this.find(id);
    if (!entityToDelete) {
      throw new NotFoundException();
    }
    await this.entityRepository.remove(entityToDelete);
  }
}
