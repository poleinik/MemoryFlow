import { createTable, schemaMigrations } from '@nozbe/watermelondb/Schema/migrations'

export default schemaMigrations({
  migrations: [
    // {
    //     fromVersion: 1,
    //     toVersion: 2,
    //     steps: [
    //         createTable({
    //             name: 'user',
    //             columns: [
    //                 { name: 'name', type: 'string' },
    //       { name: 'email', type: 'string', isOptional: true },
    //       { name: 'created_at', type: 'number' },
    //             ]
    //         }),
    //         createTable({ 
    //             name: 'themes',
    //     columns: [
    //       { name: 'title', type: 'string' },
    //       { name: 'description', type: 'string', isOptional: true },
    //       { name: 'created_at', type: 'number' },
    //       {name: 'status', type: 'string' },
    //       { name: 'color', type: 'string' },
    //       { name: 'icon', type: 'string'},
    //     ],
    //         }),
    //         createTable({
    //               name: 'cards',
    //     columns: [
    //         { name: 'theme_id', type: 'string', isIndexed: true },
    //         { name: 'question', type: 'string' },
    //         { name: 'answer', type: 'string' },
    //         { name: 'status', type: 'string' },
    //         { name: 'interval', type: 'number' },
    //         { name: 'ease_factor', type: 'number' },
    //         { name: 'repetitions', type: 'number' },
    //         { name: 'created_at', type: 'number' }, 
    //         { name: 'next_review_at', type: 'number', isIndexed: true, isOptional: true },
    //         { name: 'is_notification_sended', type: 'boolean' },
    //     ]
    //         })
    //     ],
    // }
  ],
})