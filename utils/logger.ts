import bunyan from 'bunyan';
import bunyanFormat from 'bunyan-format';

const bFormat = bunyanFormat({ outputMode: 'short' });
const loggers = new Map<string, bunyan>();

import fs from 'fs';
import path from 'path';
const logDir = path.join(process.cwd(), 'logs');

if(!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

/**
 * @returns {bunyan} 
 */
export default function createLogger(name: string): bunyan {
    if(loggers.has(name)) return loggers.get(name)!;

    const logger = bunyan.createLogger({ 
        name: name,
        streams: process.env['NO_LOG_DIR'] 
            ? [{ level: process.env.NODE_ENV === "production" ? 'error' : 'debug', stream: bFormat }]
            : [
                { level: process.env.NODE_ENV === "production" ? 'error' : 'debug', stream: bFormat },
                /*{ level: 'info', path: './logs/' + name + '.log' },*/
                { level: 'error', path: './logs/' + name + '.log' }
            ]
    });

    loggers.set(name, logger);
    return logger;
}

export const discordLogger = createLogger('discord');