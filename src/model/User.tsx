import { Model } from '@nozbe/watermelondb'
import { date, text } from '@nozbe/watermelondb/decorators'


export default class User extends Model {
  static table = 'user'

  @text('name') name!: string
  @text('email') email!: string | null
  @date('created_at') createdAt!: Date
}