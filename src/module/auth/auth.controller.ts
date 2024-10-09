import { Controller, Get, Post, Body, BadRequestException,Patch, Param, Delete, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDto,VendorLogInDto,LogInUserResponseDto,LogInVendorResponseDto } from './dto/login.dto';
import { User } from '../user/entities/user.entity';
import { Vendor } from '../vendor/entities/vendor.entity';
import { VendorService } from '../vendor/vendor.service';
import { ForgotPasswordDto, ResetPasswordDto, VerifyResetPasswordDto } from './dto/reset.dto';
import { Request } from 'express';

import { ApiTags } from '@nestjs/swagger';
import { AgentService } from '../agent/agent.service';
import { Agent } from '../agent/entities/agent.entity';
import { ErrorFormat } from 'src/helpers/errorFormat';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private readonly vendorService: VendorService,
    private readonly errorFormat: ErrorFormat,
  ) {}

  @Post("users/")
  async login(@Body() createAuthDto: LogInDto):Promise <LogInUserResponseDto> {
   

    return await this.authService.loginUser(createAuthDto);
  }

  @Post("admin/")
  async adminLogin(@Body() createAuthDto: LogInDto):Promise <LogInUserResponseDto> {
    return await this.authService.loginAdmin(createAuthDto);
  }

  @Post("users/register")
  async registerUser(@Body() createAuthDto: User):Promise <LogInUserResponseDto>{
    try{
      return await this.authService.registerUser(createAuthDto);
    } catch (e) {
      throw new BadRequestException(this.errorFormat.formatErrors(e));

    }
  }

  @Post("users/forgot-password")
  async forgotPassword(@Body() createAuthDto: ForgotPasswordDto):Promise<{}>{
      return await this.authService.forgotUserPassword(createAuthDto);
  }

  @Post("users/verify-password")
  async verifyPassword(@Body() dto: VerifyResetPasswordDto):Promise <LogInUserResponseDto>{
      return await this.authService.verifyResetUserPassword(dto);
  }

  @Post("agents/")
  async loginAgent(@Body() createAuthDto: LogInDto):Promise <LogInUserResponseDto> {
    return await this.authService.loginAgent(createAuthDto);
  }

  @Post("agents/register")
  async registerAgent(@Body() createAuthDto: Agent):Promise <LogInUserResponseDto>{
    try{
      return await this.authService.registerAgent(createAuthDto);
    } catch (e) {
      throw new BadRequestException(this.errorFormat.formatErrors(e));

    }
  }

  @Post("agents/forgot-password")
  async forgotAgentPassword(@Body() createAuthDto: ForgotPasswordDto):Promise<{}>{
      return await this.authService.forgotAgentPassword(createAuthDto);
  }

  @Post("agents/verify-password")
  async verifyAgentPassword(@Body() dto: VerifyResetPasswordDto):Promise <LogInUserResponseDto>{
      return await this.authService.verifyResetAgentPassword(dto);
  }

  @Post("wave/users/forgot-password")
  async forgotWaveUserPassword(@Body() createAuthDto: ForgotPasswordDto):Promise<{}>{
      return await this.authService.forgotUWaveUserPassword(createAuthDto);
   
  }
  

  @Post("wave/users/verify-password")
  async verifyResetUWaveUserPassword(@Body() dto: VerifyResetPasswordDto):Promise <LogInUserResponseDto>{
      return await this.authService.verifyUWaveUserPassword(dto);
    
  }

 

  @Post("wave/users/")
  async uWaveLogin(@Body() createAuthDto: LogInDto):Promise <LogInUserResponseDto> {
    return await this.authService.loginUWaveUser(createAuthDto);
  }

  @Post("wave/admin/")
  async uWaveAdminLogin(@Body() createAuthDto: LogInDto):Promise <LogInUserResponseDto> {
    return await this.authService.loginUWaveAdmin(createAuthDto);
  }

  @Post("wave/users/register")
  async uWaveRegisterUser(@Body() createAuthDto: User):Promise <LogInUserResponseDto>{
    try{
      return await this.authService.registerUWaveUser(createAuthDto);
    } catch (e) {
      throw new BadRequestException(this.errorFormat.formatErrors(e));

    }
  }


  @Post("vendors")
  async loginVendor(@Body() createAuthDto: VendorLogInDto):Promise<LogInVendorResponseDto> {
    
    return this.authService.loginVendor(createAuthDto);
  }


  @Post("vendors/forgot-password")
  async forgotVendorPassword(@Body() createAuthDto: ForgotPasswordDto):Promise<{}>{
      return await this.authService.forgotVendorPassword(createAuthDto);
    
  }

  @Post("vendors/verify-password")
  async verifyVendorPassword(@Body() dto: VerifyResetPasswordDto):Promise <LogInUserResponseDto>{
      return await this.authService.verifyResetVendorPassword(dto);
    
  }

  @Post("vendors/register")
  async registerVendor(@Body() createAuthDto: Vendor):Promise <LogInVendorResponseDto> {
    console.log("createAuthDto:: ")
    try {
    
    console.log("createAuthDto:: ",createAuthDto)
      return await this.authService.registerVendor(createAuthDto);
    } catch (e) {
      throw new BadRequestException(this.errorFormat.formatErrors(e));
  
    }
  }

  
 

  // admin login;
  // accept email then check if then send otp to the email-address;
}