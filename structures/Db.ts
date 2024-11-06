import pg from 'pg'
const { Pool } = pg
import { discordLogger } from "../utils/logger";
class Db {
    db: any
    constructor() {
        this.db = new Pool()
    }
    async pool(str: string, arg: Array<any>, isFull: Boolean = false): Promise<any | undefined> {
        const client = await this.db.connect();
        try {
            const result = await client.query(str, arg);
            return isFull ? result.rows : result.rows[0];
        } catch (e){
            discordLogger.error(e)
        } finally {
            client.release();
        }
    }
}
export default new Db()