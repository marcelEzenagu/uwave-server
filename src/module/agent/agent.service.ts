import { Injectable } from '@nestjs/common';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { InjectModel } from  '@nestjs/mongoose';
import { Agent, AgentDocument } from './entities/agent.entity';
import { Model } from  'mongoose';

import * as bcrypt from 'bcrypt';
import { ResetPasswordDto } from '../auth/dto/reset.dto';


@Injectable()
export class AgentService {
  constructor(
    @InjectModel(Agent.name) private readonly agentModel: Model<AgentDocument>,

  ){}



  // change import to b e the from auth
   hashData(data: string) {
    return bcrypt.hash(data, 10);
  }
  
  // async resetAgentPassword(dto: ResetPasswordDto): Promise<{}> {
  //   try {

  //     if(dto.password != dto.confirmPassword){
  //       throw new BadRequestException("password and confirmPassword don't match");
        
  //     }
  //     const AgentID = dto.AgentID 
  //     const user = await this.findWhere({ AgentID});

  //     if (!user) {
  //       throw new NotFoundException("no Agent with this email");
  //     }

  //     user.password = await this.hashData(dto.password);

  //     this.update(AgentID,user)

  //     return {
  //       message: "Password Reset successful",
  //     };
  //   } catch (error) {
  //     if (error instanceof NotFoundException) {
  //       throw new BadRequestException(error);
  //     }
  //     throw error;
  //   }
  // }

  create(createAgentDto: Agent) {
    const newAgent = new this.agentModel(createAgentDto)
    return newAgent.save();
    
  }

  async findAll():Promise<Agent[]> {
    const where = {"deletedAt":null}
    return await  this.agentModel.find().where(where).exec();
  }

  async adminFindAll(page,limit,search:string) {
    search = search.trim()
    const skip = (page - 1) * limit;
    const filter: any = {}
    
    // $text: { $search: search? search :null },   
    // };

    if(search){
      const regex = new RegExp(search, 'i'); // 'i' for case-insensitive matching

      filter.$or = [
        { firstName: { $regex: regex } }, // Search firstName
        { lastName: { $regex: regex } },  // Search lastName
        { email: { $regex: regex } },      // Search email
      ];    
    }  

    const data =  await  this.agentModel.find(filter).skip(skip)
                                              .limit(limit)
                                              .exec();

    const total = await this.agentModel.countDocuments();

    return{
      data,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    }

  }
  
  async findOne(id):Promise<Agent> {
    const where = {"_id":id}

    return await  this.agentModel.findOne().where(where).exec();
  }
  
  async update(id: string, updateAgentDto: UpdateAgentDto):Promise<Agent> {
    const where= {"_id":id}
    return await  this.agentModel.findOneAndUpdate(where,updateAgentDto, {new: true })
  }

  async findWhere(where:{}):Promise<AgentDocument> {
    return await  this.agentModel.findOne().where(where).exec();
  }
  
  async remove(where):Promise<any> {
  return await  this.agentModel.where(where).findOneAndDelete().exec;
  }

  formatErrors(error: any) {
   
    // console.log("ERROR._name:: ", error)
    // console.log("ERROR.name:: ", Object.values(error.keyValue)[0])
    // console.log("ERROR__name:: ", Object.keys(error.keyPattern))
    
    // return
    if(error.name === 'MongoServerError'){
     const field = Object.keys(error.keyPattern)[0];
     const value =Object.values(error.keyValue)[0];
       return `this ${field},${value} already exists in our record` ;
 
     }else{
       const formattedErrors = [];
       for (const key in error.errors) {
         if (error.errors.hasOwnProperty(key)) {
           formattedErrors.push({
             field: key,
             message: error.errors[key].message,
           });
         }
       }
       return formattedErrors;
 
     }
 
   }
   }
