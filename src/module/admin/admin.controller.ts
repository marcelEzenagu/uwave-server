import { Controller, Get,Query, Post, Body, Patch, Param, Delete, Req, BadRequestException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ProductCategoryService } from '../product-category/product-category.service';
import { ProductSubCategoryService } from '../product-sub-category/product-sub-category.service';
import { CategoryStatus, ProductCategory } from '../product-category/entities/product-category.entity';
import { ProductSubCategory } from '../product-sub-category/entities/product-sub-category.entity';
import { ApiTags } from '@nestjs/swagger';
import { FreightService } from '../freight/freight.service';
import { Request } from 'express';
import { ErrorFormat } from 'src/helpers/errorFormat';
import { Freight } from '../freight/entities/freight.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { VendorService } from '../vendor/vendor.service';
import { ItemsService } from '../items/items.service';
import { ItemStatus } from '../items/entities/item.entity';
import { OptionType } from '../order/entities/order.entity';
import { OrderService } from '../order/order.service';
import { AgentService } from '../agent/agent.service';
import { ProductService } from '../product/product.service';
import { ProductStatus } from '../product/entities/product.entity';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private  errorFormat: ErrorFormat,

    private readonly category: ProductCategoryService,
    private readonly subCategory: ProductSubCategoryService,
    private readonly shipmentService: FreightService,
    private readonly userService: UserService,
    private readonly vendorService: VendorService,
    private readonly itemService: ItemsService,
    private readonly orderService: OrderService,
    private readonly agentService: AgentService,
    private readonly productService: ProductService,

  ) {}
 // categories
  //add, edit, delete List
  @Post("categories")
    createCategory(@Body() createAdminDto: ProductCategory,
    @Req() req: Request,
    ) {
    try {    
      const role = req['user'].role
      const userType = req['user'].sub
  
      if(role !="admin" || userType != "usave_admin"){
        throw new BadRequestException("unaccessible");
      }
    return this.category.create(createAdminDto);
  } catch (e) {
    console.log("eRROR @controlelr",e)
    throw new BadRequestException(this.errorFormat.formatErrors(e))
  }
  }

  @Patch('categories/:id')
  updateCategory(@Param('id') id: string,
  @Req() req: Request,
  @Body() updateAdminDto: UpdateAdminDto) {
   
    try {    
      const role = req['user'].role
      const userType = req['user'].sub
  
      if(role !="admin" || userType != "usave_admin"){
        throw new BadRequestException("unaccessible");
      }
    return this.category.update(id, updateAdminDto);
  } catch (e) {
    console.log("eRROR @controlelr",e)
    throw new BadRequestException(this.errorFormat.formatErrors(e))
  }
  }

  @Get("categories")
  findAllCategories() {

    let where :any = {}
     where={}

    return this.category.findAll(where);
  }

  @Get('categories-search/')  
  async adminGetCategories(
    @Req() req: Request,
    @Query('page') page: number = 1, 
    @Query('limit') limit: number = 50,
    @Query('status') status: CategoryStatus, 
    @Query('search') search: string ,
  ) {
    try {    
      page = Number(page);
    limit = Number(limit);

    if (page < 1) page = 1;  // Page should be at least 1
    if (limit < 1 || limit > 100) limit = 10;  // Limit should be between 1 and 100


    const role = req['user'].role
    const userType = req['user'].sub
    console.log("userType:: ",userType)
    if(role !="admin" || userType != "usave_admin"){
      throw new BadRequestException("unaccessible");
    }
    return await this.category.adminSearchCategories(page,limit,status,search);
  } catch (e) {
    console.log("eRROR @controlelr",e)
    throw new BadRequestException(this.errorFormat.formatErrors(e))
  }
  }

  @Delete("categories/:id")
  removeCategory(@Param('id') id: string,
  @Req() req: Request,

) {
    try {    
      const role = req['user'].role
      const userType = req['user'].sub
  
      if(role !="admin" || userType != "usave_admin"){
        throw new BadRequestException("unaccessible");
      }
    const where ={"_id":id}
    return this.category.remove(where);
  } catch (e) {
    console.log("eRROR @controlelr",e)
    throw new BadRequestException(this.errorFormat.formatErrors(e))
  }
  }


// subcategory
  @Patch("sub-categories/:id")
  updateSubCategory(@Param('id') id: string,
  @Req() req: Request,

  @Body() updateAdminDto: UpdateAdminDto) {
    try {    
      const role = req['user'].role
      const userType = req['user'].sub
  
      if(role !="admin" || userType != "usave_admin"){
        throw new BadRequestException("unaccessible");
      }
    return this.subCategory.update(id, updateAdminDto);
  } catch (e) {
    console.log("eRROR @controlelr",e)
    throw new BadRequestException(this.errorFormat.formatErrors(e))
  }
  }
  
  // Subcategories
  //add, edit, delete List
  @Post("sub-categories")
  async createSubCategory(@Body() createAdminDto: ProductSubCategory,
  @Req() req: Request,

) {

    try {    
    const role = req['user'].role
    const userType = req['user'].sub

    if(role !="admin" || userType != "usave_admin"){
      throw new BadRequestException("unaccessible");
    }
    return await this.subCategory.create(createAdminDto);
    } catch (e) {
      console.log("eRROR @controlelr",e)
      throw new BadRequestException(this.errorFormat.formatErrors(e))
    }
  }

  @Get("sub-categories")
  async findAllSubCategory(

    @Req() req: Request,
    @Query('category') category?: string

  ) {
    try {    
      const role = req['user'].role
      const userType = req['user'].sub
  
      if(role !="admin" || userType != "usave_admin"){
        throw new BadRequestException("unaccessible");
      }
    let where :any = {}
    where={"deletedAt":null}
    if(category)where.productCategory = category.toLowerCase()

    return await this.subCategory.findAll(where);
  } catch (e) {
    console.log("eRROR @controlelr",e)
    throw new BadRequestException(this.errorFormat.formatErrors(e))
  }
  }

  @Get('sub-categories-search/')  
  async adminGetSubCategories(
    @Req() req: Request,
    @Query('page') page: number = 1, 
    @Query('limit') limit: number = 50,
    @Query('status') status: CategoryStatus, 
    @Query('search') search: string ,
  ) {
    try {    
      page = Number(page);
    limit = Number(limit);

    if (page < 1) page = 1;  // Page should be at least 1
    if (limit < 1 || limit > 100) limit = 10;  // Limit should be between 1 and 100


    const role = req['user'].role
    const userType = req['user'].sub
    if(role !="admin" || userType != "usave_admin"){
      throw new BadRequestException("unaccessible");
    }
    return await this.subCategory.adminSearchSubCategories(page,limit,status,search);
  } catch (e) {
    console.log("eRROR @controlelr",e)
    throw new BadRequestException(this.errorFormat.formatErrors(e))
  }
  }

 

  @Delete("sub-categories/:id")
  async removeSubCategory(@Param('id') id: string,
  @Req() req: Request,

) {
  try {    
    const role = req['user'].role
    const userType = req['user'].sub

    if(role !="admin" || userType != "usave_admin"){
      throw new BadRequestException("unaccessible");
    }
    const where ={"_id":id}

    return await this.subCategory.remove(where);
  } catch (e) {
    console.log("eRROR @controlelr",e)
    throw new BadRequestException(this.errorFormat.formatErrors(e))
  }
  }




  





  

  
  

  
  // freight
  @Patch('shipments/:id')  // Updated the route from 'wave/shipments/:id' to 'shipments/:id'
  async adminUpdateFreight(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() dto :Freight,
  ) {
    try {
      
    
    const role = req['user'].role
    const userType = req['user'].sub


    if(role !="admin" || userType != "usave_admin"){
      throw new BadRequestException("unaccessible");
    }

    return await this.shipmentService.adminUpdate(id,dto);
  } catch (e) {
    console.log("eRROR @controlelr",e)
    throw new BadRequestException(this.errorFormat.formatErrors(e))
  }
  }
  
  @Get('shipments/')  // Updated the route from 'wave/shipments/:id' to 'shipments/:id'
  async adminFindAll(
    @Req() req: Request,
  ) {
    try {    
    const role = req['user'].role
    const userType = req['user'].sub

    if(role !="admin" || userType != "usave_admin"){
      throw new BadRequestException("unaccessible");
    }

    return await this.shipmentService.adminFindAll();
    
  } catch (e) {
    console.log("eRROR @controlelr",e)
    throw new BadRequestException(this.errorFormat.formatErrors(e))
  }
  }
  
  
  
  // users
  @Get('users/')  // Updated the route from 'wave/shipments/:id' to 'shipments/:id'
  async adminFindUsers(
    @Req() req: Request,
  ) {
    try {    
    const role = req['user'].role
    const userType = req['user'].sub

    if(role !="admin" || userType != "usave_admin"){
      throw new BadRequestException("unaccessible");
    }

    return await this.userService.adminFindAll();
    
  } catch (e) {
    console.log("eRROR @controlelr",e)
    throw new BadRequestException(this.errorFormat.formatErrors(e))
  }
  }

  @Get('users/:id')  // Updated the route from 'wave/shipments/:id' to 'shipments/:id'
  async adminFindUser(
    @Req() req: Request,
    @Param('id') id:string
  ) {
    try {    
    const role = req['user'].role
    const userType = req['user'].sub

    if(role !="admin" || userType != "usave_admin"){
      throw new BadRequestException("unaccessible");
    }

     id = id.trim()
    return await this.userService.adminFindOne(id);
    
  } catch (e) {
    console.log("eRROR @controlelr",e)
    throw new BadRequestException(this.errorFormat.formatErrors(e))
  }
  }
  
  @Patch('users/:id')  // Updated the route from 'wave/shipments/:id' to 'shipments/:id'
    async adminUpdateUser(
      @Req() req: Request,
      @Param('id') id:string,
      @Body() updateUserDto: User
    ) {
      try {    
      const role = req['user'].role
      const userType = req['user'].sub

      if(role !="admin" || userType != "usave_admin"){
        throw new BadRequestException("unaccessible");
      }

      id = id.trim()
      return await this.userService.adminUpdate(id,updateUserDto);
      
    } catch (e) {
      console.log("eRROR @controlelr",e)
      throw new BadRequestException(this.errorFormat.formatErrors(e))
    }
  }
    // vendors  

    // items 
    @Get('items/:vendorID')  
    async adminListItemsByVendors(
      @Req() req: Request,
      @Param("vendorID") vendorID : string,
      @Query('page') page: number = 1, 
      @Query('status') status: ItemStatus, 
      @Query('limit') limit: number = 50 
    ) {
      try {    
      const role = req['user'].role
      const userType = req['user'].sub
      if(role !="admin" || userType != "usave_admin"){
        throw new BadRequestException("unaccessible");
      }
      vendorID = vendorID.trim()

      page = Number(page);
      limit = Number(limit);
  
      if (page < 1) page = 1;  // Page should be at least 1
      if (limit < 1 || limit > 100) limit = 10;  // Limit should be between 1 and 100
  

      return await this.itemService.adminListItemByVendors(vendorID,page,limit,status);
      
    } catch (e) {
      console.log("eRROR @controlelr",e)
      throw new BadRequestException(this.errorFormat.formatErrors(e))
    }
    }

    @Delete('items/:vendorID/')  
    async adminDeleteItemByVendors(
      @Req() req: Request,
      @Param("vendorID") vendorID : string,
      @Query("itemID") itemID : string,
    ) {
      try {    
      const role = req['user'].role
      const userType = req['user'].sub
      if(role !="admin" || userType != "usave_admin"){
        throw new BadRequestException("unaccessible");
      }
      vendorID = vendorID.trim()
      itemID = itemID.trim()

      return await this.itemService.delete(vendorID,itemID);
      
    } catch (e) {
      console.log("eRROR @controlelr",e)
      throw new BadRequestException(this.errorFormat.formatErrors(e))
    }
    }
    
    
    // orders
    @Get('orders/')  
    async adminGetOrderByStatusAndRange(
      @Req() req: Request,

      @Query('page') page: number = 1, 
      @Query('limit') limit: number = 50,
      @Query('startDate') startDate: string ,
      @Query('endDate') endDate: string ,
      @Query('status') status: OptionType, 
      @Query('search') search: string ,
    ) {
      try {    
        page = Number(page);
      limit = Number(limit);
  
      if (page < 1) page = 1;  // Page should be at least 1
      if (limit < 1 || limit > 100) limit = 10;  // Limit should be between 1 and 100
  

      const role = req['user'].role
      const userType = req['user'].sub
      if(role !="admin" || userType != "usave_admin"){
        throw new BadRequestException("unaccessible");
      }


      return await this.orderService.getOrderByStatusAndRange(page,limit,status,startDate,endDate,search);

    } catch (e) {
      console.log("eRROR @controlelr",e)
      throw new BadRequestException(this.errorFormat.formatErrors(e))
    }
    }
    
    // getOrderStats totalOrderCost,totalProcessedOrder,totalshipped,totalDelivered
    
    
    // agents
    
    @Get('agents/')  
    async adminGetAgents(
      @Req() req: Request,

      @Query('page') page: number = 1, 
      @Query('limit') limit: number = 50,
      @Query('search') search: string ,
    ) {
      try {    
        page = Number(page);
      limit = Number(limit);
  
      if (page < 1) page = 1;  // Page should be at least 1
      if (limit < 1 || limit > 100) limit = 10;  // Limit should be between 1 and 100
  

      const role = req['user'].role
      const userType = req['user'].sub
      if(role !="admin" || userType != "usave_admin"){
        throw new BadRequestException("unaccessible");
      }


      return await this.agentService.adminFindAll(page,limit,search);

    } catch (e) {
      console.log("eRROR @controlelr",e)
      throw new BadRequestException(this.errorFormat.formatErrors(e))
    }
    }

    // products
    @Get('products/')  
    async adminGetProductsByStatusAndRange(
      @Req() req: Request,
      @Query('page') page: number = 1, 
      @Query('limit') limit: number = 50,
      @Query('startDate') startDate: string ,
      @Query('endDate') endDate: string ,
      @Query('status') status: ProductStatus, 
      @Query('search') search: string ,
    ) {
      try {    
        page = Number(page);
      limit = Number(limit);
  
      if (page < 1) page = 1;  // Page should be at least 1
      if (limit < 1 || limit > 100) limit = 10;  // Limit should be between 1 and 100
  

      const role = req['user'].role
      const userType = req['user'].sub
      if(role !="admin" || userType != "usave_admin"){
        throw new BadRequestException("unaccessible");
      }
      return await this.productService.adminGetProductsByStatusAndRange(page,limit,status,startDate,endDate,search);
    } catch (e) {
      console.log("eRROR @controlelr",e)
      throw new BadRequestException(this.errorFormat.formatErrors(e))
    }
  }
}
