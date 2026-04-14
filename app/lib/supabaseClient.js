import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://lggbgqqnguoacuilbugm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnZ2JncXFuZ3VvYWN1aWxidWdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MzU3OTMsImV4cCI6MjA5MTQxMTc5M30.ma9mvlD4hZhXJheFbxEG5c9jvJahZ2_PAh2rWZnCa8k'
)