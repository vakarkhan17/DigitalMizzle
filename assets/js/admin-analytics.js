import { supabase } from "./supabase-client.js";

const metrics = [
  ["profiles", "#analyticsUsers"],
  ["user_course_progress", "#analyticsCourses"],
  ["quiz_results", "#analyticsQuizzes"],
  ["user_activity", "#analyticsEvents"]
];

const results = await Promise.all(
  metrics.map(async ([table, selector]) => {
    const { count, error } = await supabase
      .from(table)
      .select("*", { count: "exact", head: true });

    const element = document.querySelector(selector);
    if (element) element.textContent = error ? "--" : String(count ?? 0);
    return { table, error };
  })
);

const failed = results.filter((result) => result.error);
const status = document.querySelector("#analyticsStatus");
const message = document.querySelector("#analyticsMessage");

if (status) {
  status.textContent = failed.length ? "Some database tables are unavailable" : "Supabase metrics connected";
}

if (message) {
  message.textContent = failed.length
    ? "Run the DigitalMizzle Supabase schema and confirm the admin RLS policies to enable every metric."
    : "Protected aggregate platform metrics are loading from Supabase.";
}
