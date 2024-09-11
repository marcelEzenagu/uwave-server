import { Controller, Get, Post, Body,HttpStatus, Patch, Param, Delete, BadRequestException,HttpException } from '@nestjs/common';
import { LogisticsService } from './logistics.service';
import { CreateLogisticDto } from './dto/create-logistic.dto';
import { UpdateLogisticDto } from './dto/update-logistic.dto';
import { LogisticDocument } from './entities/logistic.entity';

@Controller('logistics')
export class LogisticsController {
  constructor(private readonly logisticsService: LogisticsService) {}

  @Post()
  create(@Body() createLogisticDto: CreateLogisticDto) {
    return this.logisticsService.create(createLogisticDto);
  }
  
  @Post("exists")
  createForExisting(@Body() createLogisticDto: CreateLogisticDto) {
    return this.logisticsService.createExistingShipment(createLogisticDto);
  }

  @Get()
  async findAll():Promise<LogisticDocument[]> {
    try {
      const resp =  await this.logisticsService.findAll();
      console.log("resp",resp)
      return resp
    } catch (error) {
      console.log("error::",error)

    }
    return 
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logisticsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateLogisticDto: UpdateLogisticDto): Promise<any>  {
    try{
      return this.logisticsService.update(+id, updateLogisticDto);
    }catch(e){
      // return e
       throw new HttpException(e,HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.logisticsService.remove(+id);
  }
}
