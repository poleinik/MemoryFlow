import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 4,
  tables: [
    tableSchema({
      name: 'user',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'email', type: 'string', isOptional: true },
        { name: 'avatar_uri', type: 'string', isOptional: true },
        { name: 'notification_hour', type: 'number' },
        { name: 'notification_minute', type: 'number' },
        { name: 'ai_config', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'themes',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'status', type: 'string' },
        { name: 'color', type: 'string' },
        { name: 'icon', type: 'string' },
      ],
    }),
    tableSchema({
      name: 'cards',
      columns: [
        { name: 'theme_id', type: 'string', isIndexed: true },
        { name: 'question', type: 'string' },
        { name: 'answer', type: 'string' },
        { name: 'status', type: 'string' },
        { name: 'interval', type: 'number' },
        { name: 'ease_factor', type: 'number' },
        { name: 'repetitions', type: 'number' },
        { name: 'created_at', type: 'number' },
        {
          name: 'next_review_at',
          type: 'number',
          isIndexed: true,
          isOptional: true,
        },
        { name: 'is_notification_sended', type: 'boolean' },
      ],
    }),
    tableSchema({
      name: 'review_log',
      columns: [
        { name: 'card_id', type: 'string', isIndexed: true },
        { name: 'theme_id', type: 'string', isIndexed: true },
        { name: 'reviewed_at', type: 'number', isIndexed: true },
        { name: 'rating', type: 'string' },
        { name: 'is_correct', type: 'boolean' },
        { name: 'duration_ms', type: 'number' },
      ],
    }),
  ],
});
