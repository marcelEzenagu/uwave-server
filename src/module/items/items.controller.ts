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
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'page for paginating category search',
    type: Number,
    example:1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'limit for category search',
    type: Number,
    example:50,
  })
  async findAll(
    @Query('subCategory') subCategory?: string,
    @Query('category') category?: string,
    @Query('country') country?: string,
    @Query('page') page: number = 1, 
    @Query('limit') limit: number = 50,
  ) {
    try{

    page = Number(page);
    limit = Number(limit);

    if (page < 1) page = 1;  // Page should be at least 1
    if (limit < 1 || limit > 100) limit = 10;  // Limit should be between 1 and 100



    let where :any = {
      page,
      limit,
    }
    if (category)where.itemCategory = category.toLowerCase()
    if (country)where.country = country.toLowerCase()
    if(subCategory)where.itemSubCategory = subCategory.toLowerCase()
    return await this.itemsService.findAll(where);
  }catch(e){
console.log("error:: ",e)
  }
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
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'page for paginating category search',
    type: Number,
    example:1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'limit for category search',
    type: Number,
    example:50,
  })
  async searchItem(
  @Query('query') searchWord: string, 
  @Query('country') country: string, 
  @Query('filter') filter: ItemFilter, 
  @Query('page') page: number = 1, 
  @Query('limit') limit: number = 50,
) {
  try{

    page = Number(page);
    limit = Number(limit);

    if (page < 1) page = 1;  // Page should be at least 1
    if (limit < 1 || limit > 100) limit = 10;  // Limit should be between 1 and 100


  return await this.itemsService.searchItem(page,limit,searchWord?.trim(),country?.trim(),filter?.trim());
}catch(e){
  console.log("eror1 :::",e)

}  
}


  @Get(':id')
  findOne(@Param('id') id: string) {
    const where ={"_id":id}
    return this.itemsService.findWhere(where);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(id, updateItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsService.remove(id);
  }
}
