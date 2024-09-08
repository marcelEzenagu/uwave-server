import { Controller, Get,Req, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SavedItemsService } from './saved-items.service';
import { CreateSavedItemDto } from './dto/create-saved-item.dto';
import { UpdateSavedItemDto } from './dto/update-saved-item.dto';
import { Request } from 'express';

@Controller('saved-items')
export class SavedItemsController {
  constructor(private readonly savedItemsService: SavedItemsService) {}

  @Post()
  create(@Body() createSavedItemDto: CreateSavedItemDto,
    @Req() req: Request,
  ) {
  const userID = req['user'].sub;

  createSavedItemDto.userID=userID
    return this.savedItemsService.saveItem(createSavedItemDto);
  }


  @Get()
  findAll(
    @Req() req: Request,
  ) {
    const userID = req['user'].sub;
    const where = {
      userID,
    }

    return this.savedItemsService.findAllUserSavedItem(where);
  }

  @Delete(':id')
  remove(@Param('id') id: string,
  @Req() req: Request,
  ) {
    try{

      const userID = req['user'].sub;
      
      const where = {
        "_id":id,
        userID,
      }
      
      return this.savedItemsService.removeItem(where);
    }catch(e){
      console.log("ERROR:: ",e)
    }
  }
}
