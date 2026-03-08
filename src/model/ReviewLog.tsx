import { Model } from '@nozbe/watermelondb';
import type { Associations } from '@nozbe/watermelondb/Model';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class ReviewLog extends Model {
  static table = 'review_log';

  static associations: Associations = {
    cards: { type: 'belongs_to', key: 'card_id' },
    themes: { type: 'belongs_to', key: 'theme_id' },
  };

  @field('card_id') cardId!: string;
  @field('theme_id') themeId!: string;
  @date('reviewed_at') reviewedAt!: Date;
  @field('rating') rating!: string;
  @field('is_correct') isCorrect!: boolean;
  @field('duration_ms') durationMs!: number;
}
