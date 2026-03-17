import {
  addColumns,
  createTable,
  schemaMigrations,
} from '@nozbe/watermelondb/Schema/migrations';

export default schemaMigrations({
  migrations: [
    {
      toVersion: 4,
      steps: [
        addColumns({
          table: 'user',
          columns: [
            { name: 'avatar_uri', type: 'string', isOptional: true },
          ],
        }),
      ],
    },
    {
      toVersion: 3,
      steps: [
        addColumns({
          table: 'user',
          columns: [
            { name: 'notification_hour', type: 'number' },
            { name: 'notification_minute', type: 'number' },
            { name: 'ai_config', type: 'string', isOptional: true },
          ],
        }),
      ],
    },
    {
      toVersion: 2,
      steps: [
        createTable({
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
    },
  ],
});
