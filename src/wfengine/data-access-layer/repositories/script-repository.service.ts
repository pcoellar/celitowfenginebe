import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IScriptRepositoryService } from './interfaces/script-repository.interface';
import { ScriptEntity } from 'src/wfengine/entities/data-entities/script.data.entity';
import { AuditableFieldsManager } from 'src/common/business-logic-layer/services/audit/utils';

@Injectable()
export class ScriptRepositoryService implements IScriptRepositoryService {
  constructor(
    @InjectRepository(ScriptEntity)
    private readonly entityRepository: Repository<ScriptEntity>,
  ) {}

  async findAll(relations?: string[]): Promise<ScriptEntity[]> {
    const entities: ScriptEntity[] = await this.entityRepository.find({
      relations: relations ?? [],
    });
    return entities;
  }

  async findByFilter(filter: any): Promise<ScriptEntity[]> {
    try {
      return await this.entityRepository.find({ where: filter });
    } catch {
      throw new NotFoundException();
    }
  }

  async find(id: string): Promise<ScriptEntity> {
    try {
      return await this.entityRepository.findOne({ where: { id } });
    } catch {
      throw new NotFoundException();
    }
  }

  async create(entity: ScriptEntity): Promise<ScriptEntity> {
    const auditableFieldsManager = new AuditableFieldsManager();
    entity = auditableFieldsManager.IncludeAuditableFieldsOnCreate(entity);
    const data = this.entityRepository.create(entity);
    const result = await this.entityRepository.save(data);
    return result;
  }

  async update(entity: Partial<ScriptEntity>): Promise<ScriptEntity> {
    const auditableFieldsManager = new AuditableFieldsManager();
    entity = auditableFieldsManager.IncludeAuditableFieldsOnUpdate(entity);
    let entityToModify: ScriptEntity = await this.find(entity.id);
    if (!entityToModify) {
      throw new NotFoundException();
    }
    entityToModify = {
      ...entityToModify,
      ...entity,
    };
    const result: ScriptEntity =
      await this.entityRepository.save(entityToModify);
    return result;
  }

  async delete(id: string) {
    const entityToDelete: ScriptEntity = await this.find(id);
    if (!entityToDelete) {
      throw new NotFoundException();
    }
    await this.entityRepository.delete(id);
  }
}
