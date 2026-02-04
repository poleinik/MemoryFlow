import { Model } from '@nozbe/watermelondb'
import type { Associations } from '@nozbe/watermelondb/Model'
import { date, text, field, immutableRelation } from '@nozbe/watermelondb/decorators'
import Theme from './Themes'

export default class Card extends Model {
  static table = 'cards'

   static associations: Associations = {
      themes: { type: 'belongs_to', key: 'theme_id' },
    }

    @text('question') question!: string
    @text('answer') answer!: string
    @text('status') status!: string
    @date('created_at') createdAt!: Date
    @date('next_review_at') nextReviewAt!: Date | null
    @field('interval') interval!: number
    @field('ease_factor') easeFactor!: number
    @field('repetitions') repetitions!: number
    @field('is_notification_sended') isNotificationSended!: boolean

    @immutableRelation('themes', 'theme_id') theme!: typeof Theme


    get isReadyForReview() {
     return this.nextReviewAt &&
      this.nextReviewAt.getTime() <= Date.now()
  }
}