import "server-only";

export const serverEnv = {
  sessionSecret: process.env.SESSION_SECRET ?? "dev-only-secret-change-me",
  mockAdapters: process.env.MOCK_EXTERNAL_ADAPTERS !== "false",
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
};
