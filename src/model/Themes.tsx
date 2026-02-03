import { Model } from '@nozbe/watermelondb'
import type { Associations } from '@nozbe/watermelondb/Model'
import { date, text, children } from '@nozbe/watermelondb/decorators'
import Card from './Cards'


export default class Theme extends Model {
  static table = 'themes'

  static associations: Associations = {
    cards: { type: 'has_many', foreignKey: 'theme_id' },
  }

    @text('title') title!: string
    @text('description') description!: string | null
    @date('created_at') createdAt!: Date
    @text('status') status!: string
    @text('color') color!: string
    @text('icon') icon!: string 

    @children('cards') cards!: typeof Card[]

}