import {
  Injectable,
  NotFoundException,BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  LogInDto,
  LogInUserResponseDto,
  LogInVendorResponseDto,VendorLogInDto
} from './dto/login.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { UserDocument, User } from '../user/entities/user.entity';
import { VendorDocument, Vendor } from '../vendor/entities/vendor.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AccessTokenDto } from './dto/access-token.dto';
import { VendorService } from '../vendor/vendor.service';
const jwt = require('jsonwebtoken');

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private vendorService: VendorService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Vendor.name) private vendorModel: Model<VendorDocument>,
  ) {}

  private generateRandomCharacters(length: number) {
    const characters = randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
    return characters;
  }

  async loginUser(dto: LogInDto): Promise<LogInUserResponseDto> {
    try {
      const user = await this.userService.findWhere({ email: dto.email });

      if (!user) {
        throw new NotFoundException();
      }

      const passwordMatch = await bcrypt.compare(dto.password, user.password);

      if (!passwordMatch) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const  role = 'user' 
      const accessTokenData = this.generateToken(user.userID,role);

      return {
        access_data: { access_token: accessTokenData, role },
        user: user,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException('Invalid email or password');
      }
      throw error;
    }
  }

  async loginVendor(dto: VendorLogInDto): Promise<LogInVendorResponseDto> {
    try {
      const vendor = await this.vendorService.findWhere({ email: dto.email });

      if (!vendor) {
        throw new NotFoundException();
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
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException('Invalid phone number or password');
      }
      throw error;
    }
  }

  private hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async registerUser(createUserDto: User): Promise<LogInUserResponseDto> {
    // try {
      createUserDto.password = await this.hashData(createUserDto.password);
      const newUser = new this.userModel(createUserDto);
      // console.log('createUserDto.password1 :: ', createUserDto.password);
      // createUserDto.password = await this.hashData(createUserDto.password);
      // console.log('createUserDto.password:: ', createUserDto.password);

      // console.log('newUser:: ', newUser);
      const returnedUser = await newUser.save();
      const role = 'user'

      const token = this.generateToken(newUser.userID,role);

      return {
        access_data: { token, role },
        user: returnedUser,
      };
    
  }

  async registerVendor(
    createVendorDto: Vendor,
  ): Promise<LogInVendorResponseDto> {
    console.log("registerVendor:: ")

      createVendorDto.password = await this.hashData(createVendorDto.password);
      const newVendor = new this.vendorModel(createVendorDto);

      const returnedVendorUser = await newVendor.save();
      const role = 'vendor'

      const token =  this.generateToken(returnedVendorUser.id,role);

      return {
        vendor: returnedVendorUser,
        access_data: {
          token,
          role
        },
      };
  
  }

  generateToken(userID: string, role:string) {
    const payload = { sub: userID, role: role };
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
