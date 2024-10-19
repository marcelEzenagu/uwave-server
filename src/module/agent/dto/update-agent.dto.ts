import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateAgentDto } from './create-agent.dto';
import { Agent } from '../entities/agent.entity';

export class UpdateAgentDto extends PartialType(
    OmitType(Agent, ['firstName','password','lastName', 'email'] as const),
){
    firstName?: string|undefined;
    lastName?: string|undefined;
    password?:  string|undefined;
    email?: string|undefined;
}
