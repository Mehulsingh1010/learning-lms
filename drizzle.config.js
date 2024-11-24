
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './configs/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url:'postgresql://lmsdb_owner:TumFdO94fvSR@ep-damp-moon-a51g5fjv.us-east-2.aws.neon.tech/lmsdb?sslmode=require',
  },
});
