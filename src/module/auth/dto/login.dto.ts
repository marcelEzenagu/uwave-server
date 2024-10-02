import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { User } from '../../user/entities/user.entity'
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Vendor } from 'src/module/vendor/entities/vendor.entity';
import { ApiProperty } from '@nestjs/swagger';

export class LogInDto {
  @ApiProperty({
    example: 'rehmat.sayani@gmail.com',
    required: true
 })
    @Prop({ required:true,unique:true})
    @IsEmail()
  email:string;

  @ApiProperty({
    example: 'rHem23gmail@.m',
    required: true
 })
    @Prop({ required:true})
    @IsNotEmpty()
    @Length(6, 20)
    @Matches(/(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
      { message: 'Password must contain at least one uppercase letter, one number, and one special character.' })
  password: string;
}

export class VendorLogInDto {
  @Prop({ required:true,unique:true})
  @IsEmail()
    email:string;
  @Prop({ required:true})
  @IsNotEmpty()
  @Length(6, 20)
  @Matches(/(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
    { message: 'Password must contain at least one uppercase letter, one number, and one special character.' })
    password: string;
}

export class LogInUserResponseDto {
  access_data: {};
  user: {};
}

export class LogInVendorResponseDto {
  access_data: {};
  vendor: Vendor;
}