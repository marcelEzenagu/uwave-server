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
import { ForgotPasswordDto, ResendOTPDto, ResetPasswordDto, VerifyResetPasswordDto } from './dto/reset.dto';
import { AgentService } from '../agent/agent.service';
import { Agent, AgentDocument } from '../agent/entities/agent.entity';
const jwt = require('jsonwebtoken');

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private waveUserService: UWaveUserService,
    private vendorService: VendorService,
    private redisService: RedisService,
    private agentService: AgentService,
    private mailService: MailerService,

    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Agent.name) private agentModel: Model<AgentDocument>,
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
    tokenType: 'create-account' | 'reset-password' | 'email-verification',
    value,
    email
    : string,
  ): Promise<string> {
    const characters = this.generateRandomCharacters(86);

    const key = `${tokenType}-${characters}-${email}`;

    // save to redis
    await this.redisService.setValue(key, value);

    return characters;
  }

  private hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async loginUser(dto: LogInDto): Promise<LogInUserResponseDto> {
    try {
      dto.email = dto.email.toLowerCase();

      const user = await this.userService.findWhere({
        email: dto.email.toLowerCase(),
      });

      if (!user) {
        throw new NotFoundException('invalid email');
      }

      const passwordMatch = await bcrypt.compare(dto.password, user.password);

      if (!passwordMatch) {
        throw new UnauthorizedException('Invalid password');
      }

      const role = 'user';
      const accessTokenData = this.generateToken(user.userID, role);

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
      dto.email = dto.email.toLowerCase();

      const user = await this.userService.findWhere({ email: dto.email });

      if (!user) {
        throw new NotFoundException('no user with this email');
      }

      const OTP = this.generateOtp();
      const requestID = await this.generateTemporaryAccessCode(
        'reset-password',
        OTP,
        dto.email
      );

      await this.mailService.send({
        subject: 'reset-password',
        to: dto.email,
        otp: OTP,
        template: MESSAGE_TEMPLATE.RESET_PASSWORD_EMAIL,
      });

      return {
        message: 'A Password Reset OTP has been sent to this email',
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

  async verifyResetUserPassword(
    dto: VerifyResetPasswordDto,
  ): Promise<LogInUserResponseDto> {
    try {
      dto.email = dto.email.toLowerCase();

      const key = `reset-password-${dto.requestID}-${dto.email}`;

      const foundOTP = await this.redisService.getValue(key);

      if (foundOTP !== dto.otp) {
        throw new UnprocessableEntityException('invalid otp');
      }

      const user = await this.userService.findWhere({ email: dto.email });

      if (!user) {
        throw new NotFoundException('no user with this email');
      }

      const role = 'user';
      const accessTokenData = this.generateToken(user.userID, role);

      return {
        access_data: { access_token: accessTokenData, role },
        user: user,
      };
    } catch (error) {
      console.log('error: ', error);
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error);
      }

      throw error;
    }
  }

  async registerUser(createUserDto: User): Promise<LogInUserResponseDto> {
    // try {
    createUserDto.email = createUserDto.email.toLowerCase();

    createUserDto.password = await this.hashData(createUserDto.password);
    const newUser = new this.userModel(createUserDto);

    const returnedUser = await newUser.save();
    const role = 'user';

    const token = this.generateToken(newUser.userID, role);

    return {
      access_data: { token, role },
      user: returnedUser,
    };
  }

  async loginAgent(dto: LogInDto): Promise<LogInUserResponseDto> {
    try {
      dto.email = dto.email.toLowerCase();

      const agent = await this.agentService.findWhere({
        email: dto.email.toLowerCase(),
      });
      if (!agent) {
        throw new NotFoundException('invalid email');
      }

      const passwordMatch = await bcrypt.compare(dto.password, agent.password);
      if (!passwordMatch) {
        throw new UnauthorizedException('Invalid password');
      }

      const role = 'agent';
      const accessTokenData = this.generateToken(agent.agentID, role);

      return {
        access_data: { access_token: accessTokenData, role },
        user: agent,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException(error);
      }
      throw error;
    }
  }

  async forgotAgentPassword(dto: ForgotPasswordDto): Promise<{}> {
    try {
      dto.email = dto.email.toLowerCase();

      const user = await this.agentService.findWhere({ email: dto.email });

      if (!user) {
        throw new NotFoundException('no user with this email');
      }

      const OTP = this.generateOtp();
      const requestID = await this.generateTemporaryAccessCode(
        'reset-password',
        OTP,
        dto.email,
      );

      await this.mailService.send({
        subject: 'reset-password',
        to: dto.email,
        otp: OTP,
        template: MESSAGE_TEMPLATE.RESET_PASSWORD_EMAIL,
      });

      return {
        message: 'A Password Reset OTP has been sent to this email',
        requestID,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException('Invalid email');
      }
      throw error;
    }
  }

  async verifyResetAgentPassword(
    dto: VerifyResetPasswordDto,
  ): Promise<LogInUserResponseDto> {
    try {
      dto.email = dto.email.toLowerCase();

      const key = `reset-password-${dto.requestID}-${dto.email}`;

      const foundOTP = await this.redisService.getValue(key);

      if (foundOTP !== dto.otp) {
        throw new UnprocessableEntityException('invalid otp');
      }

      const agent = await this.agentService.findWhere({ email: dto.email });
      if (!agent) {
        throw new NotFoundException('no agent with this email');
      }

      const role = 'agent';
      const accessTokenData = this.generateToken(agent.agentID, role);

      return {
        access_data: { access_token: accessTokenData, role },
        user: agent,
      };
    } catch (error) {
      console.log('error: ', error);
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error);
      }

      throw error;
    }
  }

  async verifyAgentEmail(
    dto: VerifyResetPasswordDto,
  ): Promise<LogInUserResponseDto> {
    try {
      dto.email = dto.email.toLowerCase();

      const key = `email-verification-${dto.requestID}-${dto.email}`;
      const foundOTP = await this.redisService.getValue(key);

      if (foundOTP !== dto.otp) {
        throw new UnprocessableEntityException('invalid otp');
      }

      // update isEmailVerified;

      const agent = await this.agentService.verifyEmail({ email: dto.email });
      if (!agent) {
        throw new NotFoundException('no agent with this email');
      }

      const role = 'agent';
      const accessTokenData = this.generateToken(agent.agentID, role);

      return {
        access_data: { access_token: accessTokenData, role },
        user: agent,
      };
    } catch (error) {
      console.log('error: ', error);
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error);
      }

      throw error;
    }
  }

  async verifyVendorEmail(
    dto: VerifyResetPasswordDto,
  ): Promise<LogInUserResponseDto> {
    try {
      dto.email = dto.email.toLowerCase();

      const key = `email-verification-${dto.requestID}-${dto.email}`;
      const foundOTP = await this.redisService.getValue(key);

      if (foundOTP !== dto.otp) {
        throw new UnprocessableEntityException('invalid otp');
      }

      // update isEmailVerified;
      const vendor = await this.vendorService.verifyEmail({ email: dto.email });
      if (!vendor) {
        throw new NotFoundException('no vendor with this email');
      }

      const role = 'vendor';
      const accessTokenData = this.generateToken(vendor.vendorID, role);

      return {
        access_data: { access_token: accessTokenData, role },
        user: vendor,
      };
    } catch (error) {
      console.log('error: ', error);
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error);
      }

      throw error;
    }
  }

  async resendOTP(dto: ResendOTPDto): Promise<{}> {
    let { email, resendType, userType } = dto;
    email = email.toLowerCase().trim();

    // format is user_email-verification, agent_email-verification
    let user: any;
    const emailWhere = {
      email,
    };

    if (userType == 'user') {
      const result = await this.userService.findWhere(emailWhere);
      if (!result) {
        throw new NotFoundException('invalid email');
      }
      user = result;
    }else if(userType == 'vendor'){
      const result = await this.vendorService.findWhere(emailWhere);
      if (!result) {
        throw new NotFoundException('invalid email');
      }
      user = result;

    }else if(userType == 'agent'){
      const result = await this.agentService.findWhere(emailWhere);
      if (!result) {
        throw new NotFoundException('invalid email');
      }
      user = result;

    }

    let requestID;

    if (resendType == 'email-verification') {
      // send emailOTP
      const OTP = this.generateOtp();
      requestID = await this.generateTemporaryAccessCode(
        'email-verification',
        OTP,
        email
      );

      await this.mailService.send({
        subject: 'email-verification',
        to: email,
        otp: OTP,
        template: MESSAGE_TEMPLATE.RESET_PASSWORD_EMAIL,
      });
    }

    return {
      message: `we have sent ${resendType} OTP to your  ${email}`,
      requestID,
    };
  }

  async registerAgent(createUserDto: Agent): Promise<{}> {
    createUserDto.email = createUserDto.email.toLowerCase();
    const where = { email: createUserDto.email };
    let returnedAgent;
    try {
      createUserDto.password = await this.hashData(createUserDto.password);

      let agentData: Agent = {
        firstName: createUserDto.firstName.toLowerCase(),
        lastName: createUserDto.lastName.toLowerCase(),
        email: createUserDto.email.toLowerCase(),
        password: createUserDto.password,
        isEmailVerified: false,
        isVerified: false,
        deletedAt: null,
        hasAcknowledged: null,
      };

      const newAgent = new this.agentModel(agentData);

      returnedAgent = await newAgent.save();

      // send emailOTP
      const OTP = this.generateOtp();
      const requestID = await this.generateTemporaryAccessCode(
        'email-verification',
        OTP,
        agentData.email,
      );
      
      const emailResponse = await this.mailService.send({
        subject: 'email-verification',
        
        to: agentData.email,
        otp: OTP,
        template: MESSAGE_TEMPLATE.RESET_PASSWORD_EMAIL,
      });

      if (!emailResponse.message_id) {
        this.agentService.remove(where);
        throw new Error('failed to send email');
      }
      returnedAgent.password = undefined;
      return {
        message: 'register successful',
        user: returnedAgent,
        requestID,
      };
    } catch (e) {
      // if (returnedAgent) {
       await  this.agentService.remove(where);
      // }
      throw new Error(e.message);
    }
  }

  async loginUWaveUser(dto: LogInDto): Promise<LogInUserResponseDto> {
    try {
      dto.email = dto.email.toLowerCase();

      const user = await this.waveUserService.findWhere({ email: dto.email });

      if (!user) {
        throw new NotFoundException('invalid email');
      }

      const passwordMatch = await bcrypt.compare(dto.password, user.password);

      if (!passwordMatch) {
        throw new UnauthorizedException('Invalid  password');
      }

      const role = 'user';
      const accessTokenData = this.generateToken(user.userID, role);

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

  async loginUWaveAdmin(dto: LogInDto): Promise<any> {
    try {
      dto.email = dto.email.toLowerCase();

      if (
        dto.email != 'uwave_admin@wave.com' ||
        dto.password != 'a08182090541@E'
      ) {
        throw new NotFoundException('invalid email or password');
      }

      const role = 'admin';
      const accessTokenData = this.generateToken('isAdmin', role);

      return {
        access_data: { access_token: accessTokenData, role },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException(error);
      }
      throw error;
    }
  }


  async loginAdmin(dto: LogInDto): Promise<any> {
    try {
      dto.email = dto.email.toLowerCase();

      if (
        dto.email != process.env.USAVE_ADMIN_EMAIL ||
        dto.password != process.env.USAVE_ADMIN_PASS
      ) {
        throw new NotFoundException('invalid email or password');
      }

      const role = 'admin';
      const accessTokenData = this.generateToken('usave_admin', role);

      return {
        access_data: { access_token: accessTokenData, role },
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
      dto.email = dto.email.toLowerCase();

      const user = await this.waveUserService.findWhere({ email: dto.email });

      if (!user) {
        throw new NotFoundException('no user with this email');
      }

      const OTP = this.generateOtp();
      const requestID = await this.generateTemporaryAccessCode(
        'reset-password',
        OTP,
        dto.email
      );

      await this.mailService.send({
        subject: 'reset-password',
        to: dto.email,
        otp: OTP,
        template: MESSAGE_TEMPLATE.RESET_PASSWORD_EMAIL,
      });

      return {
        message: 'A Password Reset OTP has been sent to this email',
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

  async verifyUWaveUserPassword(
    dto: VerifyResetPasswordDto,
  ): Promise<LogInUserResponseDto> {
    try {
      dto.email = dto.email.toLowerCase();

      const key = `reset-password-${dto.requestID}-${dto.email}`;

      const foundOTP = await this.redisService.getValue(key);
      // ({ email: dto.email });

      if (foundOTP !== dto.otp) {
        throw new UnprocessableEntityException();
      }

      const user = await this.waveUserService.findWhere({ email: dto.email });

      if (!user) {
        throw new NotFoundException('no user with this email');
      }

      const role = 'user';
      const accessTokenData = this.generateToken(user.userID, role);

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

  async resetUWaveUserPassword(dto: ResetPasswordDto): Promise<{}> {
    try {
      if (dto.password != dto.confirmPassword) {
        throw new UnauthorizedException(
          "password and confirmPassword don't match",
        );
      }
      const userID = dto.userID;
      const user = await this.waveUserService.findWhere({ userID });

      if (!user) {
        throw new NotFoundException();
      }

      user.password = await this.hashData(dto.password);

      this.waveUserService.update(userID, user);

      return {
        message: 'Password Reset successful',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException(error);
      }
      throw error;
    }
  }

  async registerUWaveUser(
    createUserDto: WaveUser,
  ): Promise<LogInUserResponseDto> {
    // try {
    createUserDto.email = createUserDto.email.toLowerCase();

    createUserDto.password = await this.hashData(createUserDto.password);
    const newUser = new this.uWaveUserModel(createUserDto);

    const returnedUser = await newUser.save();
    const role = 'user';

    const token = this.generateToken(newUser.userID, role);

    return {
      access_data: { token, role },
      user: returnedUser,
    };
  }

  async loginVendor(dto: VendorLogInDto): Promise<LogInVendorResponseDto> {
    try {
      dto.email = dto.email.toLowerCase();

      const vendor = await this.vendorService.findWhere({ email: dto.email });

      if (!vendor) {
        throw new NotFoundException('Invalid email');
      }

      const passwordMatch = await bcrypt.compare(dto.password, vendor.password);

      if (!passwordMatch) {
        throw new UnauthorizedException('Invalid password');
      }
      const role = 'vendor';
      const accessTokenData = this.generateToken(vendor.vendorID, role);

      return {
        access_data: { access_token: accessTokenData, role },
        vendor,
      };
    } catch (e) {
      console.log('e:: ', e);
      if (e instanceof NotFoundException) {
        throw new UnauthorizedException(e);
      }
      throw e;
    }
  }

  async forgotVendorPassword(dto: ForgotPasswordDto): Promise<{}> {
    try {
      dto.email = dto.email.toLowerCase();
      const vendor = await this.vendorService.findWhere({ email: dto.email });

      if (!vendor) {
        throw new NotFoundException('no vendor with this email');
      }
      const OTP = this.generateOtp();
      const requestID = await this.generateTemporaryAccessCode(
        'reset-password',
        OTP,
        dto.email
      );

      await this.mailService.send({
        subject: 'reset-password',
        to: dto.email,
        otp: OTP,
        template: MESSAGE_TEMPLATE.RESET_PASSWORD_EMAIL,
      });

      return {
        message: 'A Password Reset OTP has been sent to this email',
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

  async verifyResetVendorPassword(
    dto: VerifyResetPasswordDto,
  ): Promise<LogInUserResponseDto> {
    try {
      dto.email = dto.email.toLowerCase();

      const key = `reset-password-${dto.requestID}-${dto.email}`;

      const foundOTP = await this.redisService.getValue(key);
      // ({ email: dto.email });

      if (foundOTP !== dto.otp) {
        throw new UnprocessableEntityException();
      }

      const user = await this.vendorService.findWhere({ email: dto.email });

      if (!user) {
        throw new NotFoundException('no user with this email');
      }

      const role = 'vendor';
      const accessTokenData = this.generateToken(user.vendorID, role);

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

  async registerVendor(createVendorDto: Vendor): Promise<{}> {
    let returnedVendorUser;
    createVendorDto.email = createVendorDto.email.toLowerCase();
    const where = { email: createVendorDto.email };
    try {

      createVendorDto.password = await this.hashData(createVendorDto.password);

      let vendorData: Vendor = {
        firstName: createVendorDto.firstName.toLowerCase(),
        lastName: createVendorDto.lastName.toLowerCase(),
        email: createVendorDto.email.toLowerCase(),
        password: createVendorDto.password,
        isEmailVerified: false,
        isDisabled: false,
        isVerified: false,
        hasAcknowleged: false,
        deletedAt: null,
      };

      const newVendor = new this.vendorModel(vendorData);

      const returnedVendorUser = await newVendor.save();
      const role = 'vendor';

      // send emailOTP
      const OTP = this.generateOtp();
      const requestID = await this.generateTemporaryAccessCode(
        'email-verification',
        OTP,
        returnedVendorUser.email,
      );

      const emailResponse = await this.mailService.send({
        subject: 'email-verification',
        to: returnedVendorUser.email,
        otp: OTP,
        template: MESSAGE_TEMPLATE.RESET_PASSWORD_EMAIL,
      });

      if (!emailResponse.message_id) {
        this.vendorService.remove(where);
        throw new Error('failed to send email');
      }
      returnedVendorUser.password = undefined;

      return {
        message: 'register successful',
        user: returnedVendorUser,
        requestID,
      };
    } catch (e) {
      console.log('registerVendor error:: ',e);
      console.log('registerVendor error:: ',    returnedVendorUser);

      // if (returnedVendorUser) {
        await this.vendorService.remove(where);
      // }
      throw new Error(e.message);
    }
  }

  generateToken(userID: string, role: string) {
    const payload = { sub: userID, role: role };

    return jwt.sign(payload, 'process.env.JWT_SECRET', { expiresIn: '3600m' });
  }

  async verifyAccessToken(token: string): Promise<any> {
    try {
      return jwt.verify(token, 'process.env.JWT_SECRET');
    } catch (err) {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
