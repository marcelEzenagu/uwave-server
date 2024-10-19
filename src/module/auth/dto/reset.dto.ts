import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

export class VerifyResetPasswordDto {

  @Prop({ required:true})
  requestID: string;

  @Prop({ required:true})
  otp: string;

  @Prop({ required:true})
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @Prop({ type:String})
  userID:string;
  
  @Prop({ type:String})
  vendorID:string;

  @Prop({ required:true})
    @IsNotEmpty()
    @Length(6, 20)
    @Matches(/(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
      { message: 'Password must contain at least one uppercase letter, one number, and one special character.' })
  password: string;

  @Prop({ required:true})
  @IsNotEmpty()
  @Length(6, 20)
  @Matches(/(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
    { message: 'confirmPassword must contain at least one uppercase letter, one number, and one special character.' })
    confirmPassword: string;
    

}

export class ChangePasswordDto {
  @Prop({ type:String})
  userID:string;
  
  @Prop({ type:String})
  vendorID:string;


  @Prop({ required:true})
  @IsNotEmpty()
  @Length(6, 20)
  @Matches(/(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
    { message: 'newPassword must contain at least one uppercase letter, one number, and one special character.' })
    newPassword: string;

  @Prop({ type:String})
  @IsNotEmpty()
  @Length(6, 20)
  @Matches(/(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
    { message: 'oldPassword must contain at least one uppercase letter, one number, and one special character.' })
    oldPassword: string;

}

export class ForgotPasswordDto {

  @Prop({ required:true,unique:true})
  @IsEmail()
  email:string;  
}
export class ResendOTPDto {

  @Prop({ required:true})
  @IsEmail()
  email:string;  

  @Prop({ required:true})
  userType:"user" |"admin"|"vendor"|"agent";  

  @Prop({ required:true})
  resendType:"forgot-password" |"email-verification";  
}
