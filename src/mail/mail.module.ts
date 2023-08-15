import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
    useFactory: async (config: ConfigService) => ({
      transport: {
        host: config.get<string>("MAILER_HOST"),
        secure: false,
        auth: {
          user: config.get<string>("MAILER_USER"),
          pass: config.get<string>("MAILER_PASS"),
        },
      },
      defaults: {
        from: `"Clean_Center" <${config.get("MAILER_HOST")}>`,
      },
      template: {
        dir: join(__dirname, "templates"),
        adapter: new HandlebarsAdapter(),
        templates: "confirmation",
        options: {
          strict: true,
        },
      },
    }),
    inject: [ConfigService],
  }),
],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}