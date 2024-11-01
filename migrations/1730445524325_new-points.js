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
    await pgm.addColumns('bot_character', {
        update_points: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    })
    await pgm.addColumns('bot_character', {
        img_count: { type: 'integer', notNull: true, default: 0 },
    })
    await pgm.addColumns('bot_character', {
        update_img: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = async (pgm) => {

};
