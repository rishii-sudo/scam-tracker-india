import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://rrlxidtytgeljsjfetly.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJybHhpZHR5dGdlbGpzamZldGx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDJlNzM4NDkwLCJleHAiOjIwNTc5NTM4NDkwfQ.KruNw4i3rxxLxdsObqECY"

export const supabase = createClient(supabaseUrl, supabaseKey)