import { Controller, Get,BadRequestException, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { AgentService } from './agent.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { Agent } from './entities/agent.entity';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ShipmentService } from '../shipment/shipment.service';
import { OptionType, ShipmentOptionType } from '../order/entities/order.entity';
import { ErrorFormat } from 'src/helpers/errorFormat';
import { FileService } from 'src/helpers/upload';
import { Frequency } from 'src/helpers/utils';

@ApiTags('agents')
@Controller('agents')
export class AgentController {
  constructor(
    private readonly agentService: AgentService,
    private readonly errorFormat: ErrorFormat,

    private readonly shipmentService: ShipmentService,
    private readonly fileService: FileService) {}

 
 

  @Get('/details')
  findOne(
    @Req() req:Request) {
    const userID = req['user'].sub
    return this.agentService.findOne(userID);
  }

  @Patch()
  async update(
    @Req() req:Request,
    @Body() updateAgentDto: UpdateAgentDto) {
      const agentID = req['user'].sub
      updateAgentDto.password =undefined
      updateAgentDto.email =undefined
      updateAgentDto.firstName =undefined
      updateAgentDto.lastName =undefined

      const vPath = "public/images/vendors"
      const vidPath = "public/videos/vendors"
  
      const imageName =`${agentID}.png`
      if(updateAgentDto.idDocumentFront){
        const imageName =`${agentID}_front.png`
  
        const imagePath = `${vPath}/ID`
        const success =  await this.fileService.uploadImage(updateAgentDto.idDocumentFront,imagePath,imageName)
        updateAgentDto.idDocumentFront = `${imagePath}/${imageName}`
      }
      if(updateAgentDto.idDocumentBack){
        const imageName =`${agentID}_back.png`
  
        const imagePath = `${vPath}/ID`
        const success =  await this.fileService.uploadImage(updateAgentDto.idDocumentBack,imagePath,imageName)
        updateAgentDto.idDocumentBack = `${imagePath}/${imageName}`
      }
    return this.agentService.update(agentID, updateAgentDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.agentService.remove(+id);
  // }

  // shipments

  @Get("warehouse")
  findAllOpenShipment(
    @Req() req: Request,
    @Query('orderID') orderID: string, 
    @Query('daysDiff') daysDifference: string,
    @Query('page') page: number = 1, 
    @Query('limit') limit: number = 50 , 
    @Query('status') status: ShipmentOptionType ,
    @Query("countries") countries:string[],

  ) {
    const agentID = req['user'].sub
    const role = req['user'].role
  
    console.log("findAllOpenShipment",countries)
    page = Number(page);
    limit = Number(limit);
  
    if (page < 1) page = 1;  // Page should be at least 1
    if (limit < 1 || limit > 100) limit = 100;  // Limit should be between 1 and 100
  
    return this.shipmentService.findShipmentsForAgent(countries,page,limit,status);
  }

  @Patch("warehouse")
  async accept(
    @Req() req: Request,
    @Body() data :any
  ){
    try {
      const agentID = req['user'].sub
      const role = req['user'].role
      
      if(data.rejectMessage != undefined){
        console.log("AT REJECT")
        return await this.shipmentService.rejectShipment (data.shipmentID,agentID,data.rejectMessage) 
      }
      console.log("NOT_AT REJECT")
      return await this.shipmentService.acceptShipment(data.shipmentID,agentID,data.status)
    } catch (e) {
      throw new BadRequestException(this.errorFormat.formatErrors(e));
    }
  }

  @Get('/recent-shipments')
  async recentShipments(
    @Req() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
    @Query('daysDifference') daysDifference: Frequency,
  ) {
    try {
      const agentID = req['user'].sub;
      const role = req['user'].role;
      page = Number(page);
      limit = Number(limit);

      if (!page) page = 1; // Page should be at least 1
      if (!limit || limit > 100) limit = 10; // Limit should be between 1 and 100

      if (role != 'agent') {
        throw new BadRequestException('unaccessible to non-agent');
      }

      console.log("++ endter")
      return await this.shipmentService.getAgentRecentShipments(
        agentID,
        daysDifference,
        page,
        limit,
      );
    } catch (e) {
      throw new BadRequestException(this.errorFormat.formatErrors(e));
    }
  }
}
