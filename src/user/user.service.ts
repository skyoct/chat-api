import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomException } from 'src/common/exception/custom-exception';
import { SmsService } from './sms.service';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private smsService: SmsService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const user =  await this.userRepository.findOne({
      where: {
        telphone: loginUserDto.telphone,
        password: loginUserDto.password,
      },
    });
    if (!user) {
      throw new CustomException('用户名或密码错误');
    }
    const playground = { telphone: user.telphone, id: user.id}
    return {
      token: this.jwtService.sign(playground),
      user: {
        id: user.id,
        telphone: user.telphone,
        level: user.level,
        balance: user.balance,
      }
    }
  }

  async create(createUserDto: CreateUserDto) {
    const count = await this.userRepository.count({
      where: {
        telphone: createUserDto.telphone,
      }
    })
    if (count > 0) {
      throw new CustomException('该手机号已经注册');
    }
    const result = await this.smsService.verifySms(createUserDto.telphone, createUserDto.code);
    if (!result) {
      throw new CustomException('验证码错误');
    }
    const createDto: User = {
      ...createUserDto,
      status: 1,
      balance: 10,
      createTime: new Date(),
      level: 0,
    }
    return this.userRepository.save(createDto);
  }

  async sendSms(telphone: string) {
    const count = await this.userRepository.count({
      where: {
        telphone: telphone,
      }
    })
    if (count > 0) {
      throw new CustomException('该手机号已经注册');
    }

    return this.smsService.sendSms(telphone);
  }
}
