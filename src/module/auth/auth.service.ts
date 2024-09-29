import {
  Injectable,
  NotFoundException,BadRequestException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  LogInDto,
  LogInUserResponseDto,
  LogInVendorResponseDto,VendorLogInDto
} from './dto/login.dto';
import { UserService } from '../user/user.service';
import { VendorService } from '../vendor/vendor.service';
import { UWaveUserService } from '../u-wave-user/u-wave-user.service';
import * as bcrypt from 'bcrypt';

import { randomBytes } from 'crypto';
import { UserDocument, User } from '../user/entities/user.entity';
import { VendorDocument, Vendor } from '../vendor/entities/vendor.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AccessTokenDto } from './dto/access-token.dto';
import { WaveUser, WaveUserDocument } from '../u-wave-user/entities/u-wave-user.entity';
import { RedisService } from '../redis/redis.service';
import { MailerService } from '../mailer/mailer.service';
import { MESSAGE_TEMPLATE } from '../notification/enum';
import { ForgotPasswordDto, ResetPasswordDto, VerifyResetPasswordDto } from './dto/reset.dto';
const jwt = require('jsonwebtoken');

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private waveUserService: UWaveUserService,
    private vendorService: VendorService,
    private redisService: RedisService,
    private mailService: MailerService,

    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Vendor.name) private vendorModel: Model<VendorDocument>,
    @InjectModel(WaveUser.name) private uWaveUserModel: Model<WaveUserDocument>,
  ) {}


  private generateRandomCharacters(length: number) {
    const characters = randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
    return characters;
  }

  generateOtp(): string {
    let text = '';
    const possible = '0123456789';

    for (let i = 0; i < 6; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  async generateTemporaryAccessCode(
    tokenType: 'create-account' | 'reset-password',
    value: string,
  ): Promise<string> {
  // ): Promise<AccessTokenDto> {
    const characters = this.generateRandomCharacters(86);
    
    console.log("characters---> ",characters)
    const key = `${tokenType}-${characters}`;

    // save to redis
    await this.redisService.setValue(key, value)
   
    return characters;

  }

  private hashData(data: string) {
    return bcrypt.hash(data, 10);
  }
  
  async loginUser(dto: LogInDto): Promise<LogInUserResponseDto> {
    try {
      dto.email = dto.email.toLowerCase()

      const user = await this.userService.findWhere({ email: dto.email.toLowerCase() });

      if (!user) {
        throw new NotFoundException("invalid email");
      }

      const passwordMatch = await bcrypt.compare(dto.password, user.password);

      if (!passwordMatch) {
        throw new UnauthorizedException('Invalid password');
      }

      const  role = 'user' 
      const accessTokenData = this.generateToken(user.userID,role);

      return {
        access_data: { access_token: accessTokenData, role },
        user: user,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException(error);
      }
      throw error;
    }
  }

  async forgotUserPassword(dto: ForgotPasswordDto): Promise<{}> {
    try {
      dto.email = dto.email.toLowerCase()

      const user = await this.userService.findWhere({ email: dto.email });

      if (!user) {
        throw new NotFoundException("no user with this email");
      }

      const OTP = this.generateOtp()
      const requestID = await this.generateTemporaryAccessCode("reset-password",OTP)

      await this.mailService.send(
        {
          subject:"reset-password",
          to:dto.email,
          otp:OTP,
          template:MESSAGE_TEMPLATE.RESET_PASSWORD_EMAIL,
        }
       )


     return {
        message: "A Password Reset OTP has been sent to this email",
        requestID,
        // data:{
        //   requestID,
        //   OTP
        // }
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException('Invalid email');
      }
      throw error;
    }
  }

  async verifyResetUserPassword(dto: VerifyResetPasswordDto): Promise<LogInUserResponseDto> {
    try {
      dto.email = dto.email.toLowerCase()

      const key = `reset-password-${dto.requestID}`

      const foundOTP = await this.redisService.getValue(key)
    
      if (foundOTP !== dto.otp) {
        throw new UnprocessableEntityException("invalid otp");
      }

       const user = await this.userService.findWhere({ email: dto.email });

      if (!user) {
        throw new NotFoundException("no user with this email");
      }
      
      const  role = 'user' 
      const accessTokenData = this.generateToken(user.userID,role);


      return {
 access_data: { access_token: accessTokenData, role },
        user: user,      };
    } catch (error) {
      console.log("error: ", error)
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error);
      }

      throw error;
    }
  }

  

  async registerUser(createUserDto: User): Promise<LogInUserResponseDto> {
    // try {
      createUserDto.email = createUserDto.email.toLowerCase()

      createUserDto.password = await this.hashData(createUserDto.password);
      const newUser = new this.userModel(createUserDto);
      
      const returnedUser = await newUser.save();
      const role = 'user'

      const token = this.generateToken(newUser.userID,role);

      return {
        access_data: { token, role },
        user: returnedUser,
      };
    
  }

  async loginUWaveUser(dto: LogInDto): Promise<LogInUserResponseDto> {
    try {
      dto.email = dto.email.toLowerCase()

      const user = await this.waveUserService.findWhere({ email: dto.email });

      if (!user) {
        throw new NotFoundException("invalid email");
      }

      const passwordMatch = await bcrypt.compare(dto.password, user.password);

      if (!passwordMatch) {
        throw new UnauthorizedException('Invalid  password');
      }

      const  role = 'user' 
      const accessTokenData = this.generateToken(user.userID,role);

      return {
        access_data: { access_token: accessTokenData, role },
        user: user,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException(error);
      }
      throw error;
    }
  }

  async forgotUWaveUserPassword(dto: ForgotPasswordDto): Promise<{}> {
    try {
      dto.email = dto.email.toLowerCase()

      const user = await this.waveUserService.findWhere({ email: dto.email });

      if (!user) {
        throw new NotFoundException("no user with this email");
      }

      const OTP = this.generateOtp()
      const requestID = await this.generateTemporaryAccessCode("reset-password",OTP)

      await this.mailService.send(
        {
          subject:"reset-password",
          to:dto.email,
          otp:OTP,
          template:MESSAGE_TEMPLATE.RESET_PASSWORD_EMAIL,
        }
       )


       
      return {
        message: "A Password Reset OTP has been sent to this email",
        requestID,
        // data:{
        //   requestID,
        //   OTP
        // }
      };

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException(error);
      }
      throw error;
    }
  }

  async verifyUWaveUserPassword(dto: VerifyResetPasswordDto): Promise<LogInUserResponseDto> {
    try {
      dto.email = dto.email.toLowerCase()

      const key = `reset-password-${dto.requestID}`

      const foundOTP = await this.redisService.getValue(key)
      // ({ email: dto.email });

      if (foundOTP !== dto.otp) {
        throw new UnprocessableEntityException();
      }

       const user = await this.waveUserService.findWhere({ email: dto.email });

      if (!user) {
        throw new NotFoundException("no user with this email");
      }
      
      const  role = 'user' 
      const accessTokenData = this.generateToken(user.userID,role);


      return {
        access_data: { access_token: accessTokenData, role },
        user: user,      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException(error);
      }
      throw error;
    }
  }

  async resetUWaveUserPassword(dto: ResetPasswordDto): Promise<{}> {
    try {

      if(dto.password != dto.confirmPassword){
        throw new UnauthorizedException("password and confirmPassword don't match");
        
      }
      const userID = dto.userID 
      const user = await this.waveUserService.findWhere({ userID});

      if (!user) {
        throw new NotFoundException();
      }

      user.password = await this.hashData(dto.password);

      this.waveUserService.update(userID,user)

      return {
        message: "Password Reset successful",
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException(error);
      }
      throw error;
    }
  }


  async registerUWaveUser(createUserDto: WaveUser): Promise<LogInUserResponseDto> {
    // try {
      createUserDto.email = createUserDto.email.toLowerCase()

      createUserDto.password = await this.hashData(createUserDto.password);
      const newUser = new this.uWaveUserModel(createUserDto);
      
      const returnedUser = await newUser.save();
      const role = 'user'

      const token = this.generateToken(newUser.userID,role);

      return {
        access_data: { token, role },
        user: returnedUser,
      };
    
  }

  async loginVendor(dto: VendorLogInDto): Promise<LogInVendorResponseDto> {
    try {
      dto.email = dto.email.toLowerCase()

      const vendor = await this.vendorService.findWhere({ email: dto.email });
      
      if (!vendor) {
        throw new NotFoundException("Invalid email");
      }

      const passwordMatch = await bcrypt.compare(dto.password, vendor.password);

      if (!passwordMatch) {
        throw new UnauthorizedException('Invalid password');
      }
      const role = 'vendor'
      const accessTokenData = this.generateToken(vendor.vendorID,role);

      return {
        access_data: { access_token: accessTokenData, role },
        vendor,
      };
    } catch (e) {
      console.log("e:: ",e)
      if (e instanceof NotFoundException) {
        throw new UnauthorizedException(e);
      }
      throw e;
    }
  }

  async forgotVendorPassword(dto: ForgotPasswordDto): Promise<{}> {
    try {
      dto.email = dto.email.toLowerCase()
      const vendor = await this.vendorService.findWhere({ email: dto.email });

      if (!vendor) {
        throw new NotFoundException("no vendor with this email");
      }
      const OTP = this.generateOtp()
      const requestID = await this.generateTemporaryAccessCode("reset-password",OTP)

      await this.mailService.send(
        {
          subject:"reset-password",
          to:dto.email,
          otp:OTP,
          template:MESSAGE_TEMPLATE.RESET_PASSWORD_EMAIL,
        }
       )

       
      return {
        message: "A Password Reset OTP has been sent to this email",
        requestID,
        // data:{
        //   requestID,
        //   OTP
        // }
      };


    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException('Invalid email');
      }
      throw error;
    }
  }

  async verifyResetVendorPassword(dto: VerifyResetPasswordDto): Promise<LogInUserResponseDto> {
    try {
      dto.email = dto.email.toLowerCase()

      const key = `reset-password-${dto.requestID}`

      const foundOTP = await this.redisService.getValue(key)
      // ({ email: dto.email });

      if (foundOTP !== dto.otp) {
        throw new UnprocessableEntityException();
      }

       const user = await this.vendorService.findWhere({ email: dto.email });

      if (!user) {
        throw new NotFoundException("no user with this email");
      }
      
      const  role = 'vendor' 
      const accessTokenData = this.generateToken(user.vendorID,role);


      return {
        access_data: { access_token: accessTokenData, role },
        user: user, 
           };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException(error);
      }
      throw error;
    }
  }

  

  async registerVendor(

    createVendorDto: Vendor,
  ): Promise<LogInVendorResponseDto> {
    console.log("registerVendor:: ")

      createVendorDto.password = await this.hashData(createVendorDto.password);
      createVendorDto.email = createVendorDto.email.toLowerCase()
      const newVendor = new this.vendorModel(createVendorDto);

      const returnedVendorUser = await newVendor.save();
      const role = 'vendor'

      const token = this.generateToken(returnedVendorUser.vendorID,role);

      return {
        vendor: returnedVendorUser,
        access_data: {
          token,
          role
        },
      };
  
  }

  generateToken(userID: string, role:string) {
  
    const payload = { sub:userID, role: role };
   
    return jwt.sign(payload, 'process.env.JWT_SECRET', { expiresIn: '3600m' });
  }

  async verifyAccessToken(token: string): Promise<any> {
    try {
      return jwt.verify(token,'process.env.JWT_SECRET');
    } catch (err) {
      throw new UnauthorizedException('Invalid access token');
    }
  }

}
