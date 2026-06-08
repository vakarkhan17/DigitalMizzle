// Preview integration template only. Never place a service-role key in browser code.
// Load @supabase/supabase-js through the project's chosen package/build system.

const SUPABASE_URL = "https://YOUR_PROJECT.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_PUBLIC_ANON_KEY";

export const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

export async function register({ fullName, email, password }) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${location.origin}/login.html?verified=1`
    }
  });
}

export async function getDashboard() {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) throw new Error("Authentication required");

  const userId = authData.user.id;
  const [profile, courses, lessons, quizzes, activity] = await Promise.all([
    supabase.from("profiles").select("full_name,email,role").eq("id", userId).single(),
    supabase.from("user_course_progress").select("*,courses(title,slug)").eq("user_id", userId),
    supabase.from("user_lesson_progress").select("*").eq("user_id", userId).eq("completed", true),
    supabase.from("quiz_results").select("score,passed,attempted_at").eq("user_id", userId),
    supabase.from("user_activity").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(10)
  ]);

  return {
    profile: profile.data,
    courses: courses.data || [],
    lessons: lessons.data || [],
    quizzes: quizzes.data || [],
    activity: activity.data || []
  };
}

export async function requireAdmin() {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return false;
  const { data } = await supabase.from("profiles").select("role,is_disabled").eq("id", authData.user.id).single();
  return data?.role === "admin" && !data.is_disabled;
}
