import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(staffId: string, password: string): Promise<any> {
    this.logger.debug(`Validating user: ${staffId}`);
    const user = await this.userService.findByUsername(staffId);
    if (user && await bcrypt.compare(password, user.auth.password)) {
      const { auth, ...result } = user;
      this.logger.debug(`User validation successful ${result}`);
      return result;
    }
    this.logger.warn(`Failed validation attempt for user: ${staffId}`);
    return null;
  }

  async login(loginDto: LoginDto) {
    this.logger.log(`Login attempt for user: ${loginDto.staffId}`);
    const user = await this.validateUser(loginDto.staffId, loginDto.password);
    if (!user) {
      this.logger.warn(`Failed login attempt for user: ${loginDto.staffId}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user.id, role: user.role , name : user.name, email : user.email};
    this.logger.log(`Successful login for user: ${loginDto.staffId}`);
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        name : user.name,
        email :user.email
      },
    };
  }

  /**
   * Handles staff registration process
   * @param registerDto - Registration data
   * @returns Created user object
   */
  async register(registerDto: RegisterDto) {
    this.logger.log(`Registration attempt for staff ID: ${registerDto.staffId}`);
    
    try {
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      const user = await this.userService.create({
        ...registerDto,
        password: hashedPassword,
      });

      // Generate JWT token after successful registration
      const payload = { username: user.staffId, sub: user.profileID, role: user.role };
      const access_token = this.jwtService.sign(payload);

      this.logger.log(`Successfully registered staff ID: ${registerDto.staffId}`);
      
      return {
        success: true,
        message: 'Registration successful',
        access_token,
        user: {
          id: user.profileID,
          username: user.staffId,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      this.logger.error(`Registration failed for staff ID: ${registerDto.staffId}`, error.stack);
      throw error;
    }
  }

  async verifyToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token);
      const user = await this.userService.findOne(payload.sub);
      
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      
      return {
        valid: true,
        user: {
          id: user.profileID,
          username: user.staffId,
          role: user.role,
        }
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
