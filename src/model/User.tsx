import { Model } from '@nozbe/watermelondb';
import { date, field, text } from '@nozbe/watermelondb/decorators';

export type AiModelConfig = {
  name: string;
  token: string;
};

export default class User extends Model {
  static table = 'user';

  @text('name') name!: string;
  @text('email') email!: string | null;
  @text('avatar_uri') avatarUri!: string | null;
  @field('notification_hour') notificationHour!: number;
  @field('notification_minute') notificationMinute!: number;
  @text('ai_config') aiConfigRaw!: string | null;
  @date('created_at') createdAt!: Date;

  get aiModels(): AiModelConfig[] {
    try {
      return this.aiConfigRaw ? JSON.parse(this.aiConfigRaw) : [];
    } catch {
      return [];
    }
  }
}
