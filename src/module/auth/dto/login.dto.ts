import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { User } from '../../user/entities/user.entity'
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Vendor } from 'src/module/vendor/entities/vendor.entity';

export class LogInDto {
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

export class VendorLogInDto {
  @Prop({ required:true,unique:true})
  @IsEmail()
    businessEmail:string;
  @Prop({ required:true})
  @IsNotEmpty()
  @Length(6, 20)
  @Matches(/(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
    { message: 'Password must contain at least one uppercase letter, one number, and one special character.' })
    password: string;
}

export class LogInUserResponseDto {
  access_data: {};
  user: User;
}

export class LogInVendorResponseDto {
  access_data: {};
  vendor: Vendor;
}
