import { pgTable ,boolean,serial, varchar} from "drizzle-orm/pg-core";

export const USER_TABLE=pgTable('users',{
    id:serial().primaryKey(),
    userName:varchar(),
    email:varchar().notNull(),
    isMember:boolean().default(false)
});