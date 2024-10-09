import { Controller, Get,Query, Post, Body, Patch, Param, Delete, Req, BadRequestException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ProductCategoryService } from '../product-category/product-category.service';
import { ProductSubCategoryService } from '../product-sub-category/product-sub-category.service';
import { ProductCategory } from '../product-category/entities/product-category.entity';
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


  // updates

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
  createSubCategory(@Body() createAdminDto: ProductSubCategory,
  @Req() req: Request,

) {

  try {    
    const role = req['user'].role
    const userType = req['user'].sub

    if(role !="admin" || userType != "usave_admin"){
      throw new BadRequestException("unaccessible");
    }
    return this.subCategory.create(createAdminDto);
  } catch (e) {
    console.log("eRROR @controlelr",e)
    throw new BadRequestException(this.errorFormat.formatErrors(e))
  }
  }

  @Get("sub-categories")
  findAllSubCategory(

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

    return this.subCategory.findAll(where);
  } catch (e) {
    console.log("eRROR @controlelr",e)
    throw new BadRequestException(this.errorFormat.formatErrors(e))
  }
  }

 
 

  @Delete("sub-categories/:id")
  removeSubCategory(@Param('id') id: string,
  @Req() req: Request,

) {
  try {    
    const role = req['user'].role
    const userType = req['user'].sub

    if(role !="admin" || userType != "usave_admin"){
      throw new BadRequestException("unaccessible");
    }
    const where ={"_id":id}

    return this.subCategory.remove(where);
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


    if(role !="admin" || userType != "isAdmin"){
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

    if(role !="admin" || userType != "isAdmin"){
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

    if(role !="admin" || userType != "isAdmin"){
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

    if(role !="admin" || userType != "isAdmin"){
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

      if(role !="admin" || userType != "isAdmin"){
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

    
    @Get('items/:vendorID')  // Updated the route from 'wave/shipments/:id' to 'shipments/:id'
    async adminListItemByVendors(
      @Req() req: Request,
      @Param("vendorID") vendorID : string,
      @Query('page') page: number = 1, 
      @Query('status') status: ItemStatus, 
      @Query('limit') limit: number = 50 
    ) {
      try {    
      const role = req['user'].role
      const userType = req['user'].sub
      if(role !="admin" || userType != "isAdmin"){
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

 
}
