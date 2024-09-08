import { Controller, Get, Post, Body, BadRequestException,Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDto,VendorLogInDto,LogInUserResponseDto,LogInVendorResponseDto } from './dto/login.dto';
import { User } from '../user/entities/user.entity';
import { Vendor } from '../vendor/entities/vendor.entity';
import { VendorService } from '../vendor/vendor.service';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private readonly vendorService: VendorService,

  ) {}

  @Post("users/")
  async login(@Body() createAuthDto: LogInDto):Promise <LogInUserResponseDto> {
    return await this.authService.loginUser(createAuthDto);
  }

  @Post("users/register")
  async registerUser(@Body() createAuthDto: User):Promise <LogInUserResponseDto>{
    try{
      return await this.authService.registerUser(createAuthDto);
    } catch (e) {
      throw new BadRequestException(this.vendorService.formatErrors(e));

    }
  }

  @Post("wave/users/")
  async uWaveLogin(@Body() createAuthDto: LogInDto):Promise <LogInUserResponseDto> {
    return await this.authService.loginUWaveUser(createAuthDto);
  }

  @Post("wave/users/register")
  async uWaveRegisterUser(@Body() createAuthDto: User):Promise <LogInUserResponseDto>{
    try{
      return await this.authService.registerUWaveUser(createAuthDto);
    } catch (e) {
      throw new BadRequestException(this.vendorService.formatErrors(e));

    }
  }

  @Post("vendors")
  async loginVendor(@Body() createAuthDto: VendorLogInDto):Promise<LogInVendorResponseDto> {
    
    return this.authService.loginVendor(createAuthDto);
  }

  @Post("vendors/register")
  async registerVendor(@Body() createAuthDto: Vendor):Promise <LogInVendorResponseDto> {
    console.log("createAuthDto:: ")
    try {
    
    console.log("createAuthDto:: ",createAuthDto)
      return await this.authService.registerVendor(createAuthDto);
    } catch (e) {
      throw new BadRequestException(this.vendorService.formatErrors(e));
  
    }
  }
 
}
