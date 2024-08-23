import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLogisticDto } from './dto/create-logistic.dto';
import { UpdateLogisticDto } from './dto/update-logistic.dto';
import { Logistic, LogisticDocument } from './entities/logistic.entity';
import { InjectModel } from  '@nestjs/mongoose';
import { Model } from  'mongoose';
import { throwError } from 'rxjs';

@Injectable()
export class LogisticsService {
  constructor(@InjectModel(Logistic.name) private shipmentModel: Model<LogisticDocument>) {}


  create(createLogisticDto: CreateLogisticDto) {
    return 'This action adds a new logistic';
  }

  createExistingShipment(createLogisticDto: CreateLogisticDto) {
    
    const newShipment = new this.shipmentModel(createLogisticDto)
    return newShipment.save(); 
  }
  
  
  async findAll() {
    return await this.shipmentModel.find().exec();
  }

  async findOne(id: string):Promise<Logistic> {
    return await  this.shipmentModel.findById(id).exec();
  }

  async findWhere(where:{}):Promise<Logistic> {
    return await  this.shipmentModel.findOne().where(where).exec();
  }

  async update(id: number, updateLogisticDto: UpdateLogisticDto) {
  
    const where = {"shipmentID":updateLogisticDto.shipmentID}
    const found = await this.findWhere(where)
    if (found.parcelWeight > updateLogisticDto.parcelWeight){        
      throw new HttpException("old weight should be less than new weight.", HttpStatus.BAD_REQUEST)
    }
     
       const result = await  this.shipmentModel.updateOne( where,updateLogisticDto)
       if (result.modifiedCount === 0) {
        throw new HttpException(
          'No document found with the provided shipmentID or no changes were made.',
          HttpStatus.NOT_FOUND
        );
      }

      return { message: 'Document updated successfully.' };
    } catch (error) {
      console.error('Error in updateLogisticDynamic:', error);

      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'An error occurred while updating the document.',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

  }

  updateShipment(id: string, updateLogisticDto: UpdateLogisticDto) {
    NB:// the weight should only increase and not Decrease
    
   
    return `This action updates a #${id} logistic`;
  }

  remove(id: number) {
    return `This action removes a #${id} logistic`;
  }

  formatErrors(error: any) {
    console.log("ERROR:: ",error.name)

    if(error.name === 'MongoServerError'){
     const field = Object.keys(error.keyPattern)[0];
       return `Duplicate value for field: ${field}`;
 
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
