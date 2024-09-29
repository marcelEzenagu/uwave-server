import { Controller,Query, Get, Post, BadRequestException,Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';
// import { FileService } from 'src/helpers/upload';
import { Request } from 'express';

@Controller('items')
export class ItemsController {
  constructor(
    private readonly itemsService: ItemsService,
    // private readonly fileService: FileService
  ) {}

  @Post()
  async create(@Req() req: Request,
    @Body() createItemDto: Item) { 
    const vendorID = req['user'].sub;

    createItemDto.vendorID = vendorID
    

    createItemDto.itemName = createItemDto.itemName.toLowerCase()

      return this.itemsService.create(createItemDto);

  }

  @Get()
  findAll(
    @Query('subCategory') subCategory?: string,
    @Query('category') category?: string
  ) {

    let where :any = {}

    if (category)where.productCategory = category.toLowerCase()
    if(subCategory)where.productSubCategory = subCategory.toLowerCase()
    return this.itemsService.findAll(where);
}

@Get('search')
async searchItem(
  @Query('query') query: string, 
  @Query('country') country: string, 
) {
   
  return await this.itemsService.searchItem(query,country);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(+id, updateItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsService.remove(+id);
  }
}
