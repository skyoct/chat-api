import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Captcha } from './entities/captcha.entity';
import { MoreThan, Repository } from 'typeorm';
import { CustomException } from 'src/common/exception/custom-exception';
import { ServerConfig } from 'src/config';

@Injectable()
export class SmsService {


    constructor(
        @InjectRepository(Captcha) 
        private captchaRepository: Repository<Captcha>,
    ) {

    }

    async sendSms(telphone: string) {
        const curDate = new Date();
        curDate.setMinutes(curDate.getMinutes() - 1);
        const count = await this.captchaRepository.count({
            where: {
                telphone: telphone,
                createTime: MoreThan(curDate),
                isAvailable: true,
            }
        })
        if (count > 0) {
            throw new CustomException('验证码发送过于频繁');
        }
        const code = this.generateVerificationCode();

        console.log(`telphone: ${telphone}, code: ${code}`);

        // 这里去调用第三方短信服务
        const url = ServerConfig.SMS_URL + `&m=${telphone}&c=[舜若科技] 您好，您的验证码为${code}`
        const res = await fetch(url);
        console.log(res);

        const captcha: Captcha = {
            telphone: telphone,
            captcha: code,
            createTime: new Date(),
            isAvailable: true,
        }
        await this.captchaRepository.save(captcha);
        return true;
    }

    async verifySms(telphone: string, captcha: string) {
        const curDate = new Date();
        curDate.setMinutes(curDate.getMinutes() - 30);
        const count = await this.captchaRepository.count({
            where: {
                telphone: telphone,
                captcha: captcha,
                createTime: MoreThan(curDate),
                isAvailable: true,
            }
        })
        if (count > 0) {
            return true;
        }
        return false;
    }

    generateVerificationCode(): string {
        let code = "";
        for (let i = 0; i < 6; i++) {
          code += Math.floor(Math.random() * 10).toString();
        }
        return code;
      }

}
