/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = async (pgm) => {
    await pgm.createTable('bot_core', {
        id: 'id',
        discord_id: { type: 'varchar(64)', notNull: true },
        blacklist: { type: 'boolean', default: false },
        createdAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });
    pgm.createIndex('bot_core', 'discord_id');
    await pgm.createTable('bot_character', {
        id: 'id',
        discord_id: { type: 'varchar(64)', notNull: true },
        name: { type: 'varchar(64)', notNull: true },
        password: { type: 'varchar(64)', notNull: true },
        createdAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });
    pgm.createIndex('bot_character', 'discord_id');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {};
