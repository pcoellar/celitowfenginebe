import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IScriptRepositoryService } from './interfaces/script-repository.interface';
import { ScriptEntity } from 'src/wfengine/entities/data-entities/script.data.entity';

@Injectable()
export class ScriptRepositoryService implements IScriptRepositoryService {
  constructor(
    @InjectRepository(ScriptEntity)
    private readonly entityRepository: Repository<ScriptEntity>,
  ) {}

  async findAll(): Promise<ScriptEntity[]> {
    const entities: ScriptEntity[] = await this.entityRepository.find();
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
}
