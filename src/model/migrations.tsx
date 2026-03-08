import {
  createTable,
  schemaMigrations,
} from '@nozbe/watermelondb/Schema/migrations';

export default schemaMigrations({
  migrations: [
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
