# DigitalMizzle Merged Access Preview

## Preview Scope

- The existing `index.html` homepage design, hero, layout, and content are preserved.
- Public About, Contact, Courses, Blogs, and Tools pages remain accessible.
- Public listing pages expose cards, summaries, categories, levels, and metadata.
- Detail and learning pages require a verified preview session.
- Downloads navigation, page, buttons, and notes CTAs are removed from this preview.
- The admin console appears only for the seeded preview admin identity.

## Current Project Storage Findings

### Database

No SQLite, Supabase, Firebase, MongoDB, PostgreSQL, or MySQL connection exists.

### Backend API

No backend API or server-side authentication is connected. The project is static HTML, CSS, and JavaScript.

### Content Storage

Courses, blogs, tools, downloads, and activity examples are hard-coded in:

- `assets/js/data.js`
- Large course/tool guide content is also embedded in page-specific JavaScript files.

### Authentication Storage

The current production prototype stores these in browser `localStorage`:

- `dmzUsers`
- `dmzSession`
- `dmzProgress`

Passwords are stored as plain text in the existing prototype and are not production-safe.

### Progress Storage

Course difficulty, course progress, and tool progress are stored in `localStorage` by the current page scripts.

## Preview Storage

This preview uses `sessionStorage` only to demonstrate navigation and role-aware UX. It is intentionally labeled as simulation and is not presented as secure production authentication.

Dynamic in the preview:

- Logged-in name and email
- Admin/learner route visibility
- Existing locally saved course/tool completion totals
- Static catalog counts from the current `assets/js/data.js`

Still dummy until a backend is connected:

- Quiz scores
- Blogs-read count unless an event is locally recorded
- Recent activity history
- Enrollments and active-user analytics
- Certificates, XP, badges, recommendations, and streaks

## Recommended Production Setup

Supabase is the recommended next step:

- Supabase Auth with email confirmation
- PostgreSQL tables in `supabase/schema.sql`
- Row Level Security for learner-owned records
- Admin role stored in `profiles.role`
- Admin checks performed by RLS and server/edge functions
- Storage buckets for future protected images or course media

The browser receives only the Supabase anon key. Service-role keys must remain in server or edge-function secrets.

## Admin Flow

1. Create `vakar.khan@gmail.com` through Supabase Auth.
2. The profile trigger assigns `admin` to that email.
3. The signed Supabase session supplies the user identity.
4. The application reads `profiles.role`.
5. Admin routes and APIs verify the role server-side.
6. RLS blocks direct database access by normal users.
7. Direct admin URL access returns Access Denied or redirects home.

## User Auth Flow

1. Registration enforces strong password rules in the UI.
2. Supabase Auth creates an unconfirmed identity.
3. Supabase sends the confirmation email.
4. The confirmation callback activates the account.
5. Login establishes a secure Supabase session.
6. Protected queries rely on `auth.uid()` and RLS.

## Production Files Expected To Change Later

- `login.html`
- `register.html`
- New `verify-email.html`
- New `access-gate.html`
- `dashboard.html`
- `course-detail.html`
- `ethical-hacking-detail.html`
- `course-learning.html`
- `blog-detail.html`
- `tool-detail.html`
- `admin.html`
- `course-editor.html`
- `blog-editor.html`
- `tools-management.html`
- Public navigation on all pages
- `assets/js/app.js`
- Course, blog, and tool page-specific scripts
- New Supabase client/auth/data modules
- New protected-page and authentication styles

The production homepage should only lose Downloads/Admin links according to the access rules; its hero and page design should otherwise remain unchanged.
