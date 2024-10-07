import { Controller,Query, Get, Post, BadRequestException,Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item, ItemFilter } from './entities/item.entity';
import { Request } from 'express';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('items')
@Controller('items')
export class ItemsController {
  constructor(
    private readonly itemsService: ItemsService,
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
@ApiQuery({
  name: 'query',
  required: false,
  description: 'Search word for item search',
  type: String,
})
@ApiQuery({
  name: 'country',
  required: false,
  description: 'Country for filtering items',
  type: String,
})
@ApiQuery({
  name: 'filter',
  required: false,
  enum: ItemFilter,
  description: 'Filter for item sorting (bestseller, priceLowToHigh, priceHighToLow)',
})

async searchItem(
  @Query('query') searchWord: string, 
  @Query('country') country: string, 
  @Query('filter') filter: ItemFilter, 
) {
   
  return await this.itemsService.searchItem(searchWord.trim(),country.trim(),filter.trim());
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
