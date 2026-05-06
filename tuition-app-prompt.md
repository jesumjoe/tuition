# Vibe-Coding Prompt — Desi Tuition Center Management App

## What you are building

A lightweight, mobile-first web application for small Indian tuition centers (solo tutors or small coaching batches of 10–60 students). The app lets tutors manage attendance, track student progress, collect fees, and send a daily WhatsApp digest to parents with a magic link to a clean parent-facing report portal.

The target user is a small-scale tutor — think aunty teaching Class 10 students from home in Chennai or an anna running a NEET batch in a rented room in Coimbatore. They are not tech-savvy. The UI must be dead simple, Tamil/English bilingual, and must work well on low-end Android phones on a Jio 4G connection.

---

## Tech Stack

### Frontend
- **Next.js 14** (App Router) with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** for component library
- Mobile-first, responsive design. Must work perfectly on 360px wide screens.

### Backend
- **Next.js API Routes** (keep it simple, no separate backend server)
- **Prisma ORM** with **PostgreSQL** (use Supabase for hosted Postgres)
- **NextAuth.js** for tutor authentication (email + OTP login, no passwords)

### WhatsApp Integration
- **Twilio WhatsApp Business API** (or swap with Interakt if preferred)
- Use environment variable `WHATSAPP_PROVIDER` to toggle between providers
- Daily digest messages sent via cron job (use Vercel Cron or a simple `/api/cron/daily-digest` endpoint)

### Parent Portal
- No login required for parents
- Token-based magic links: each student gets a unique `reportToken` (UUID) stored in DB
- Parent link format: `yourdomain.com/parent/[reportToken]`
- The link shows the last 30 days of data for that student only

### Hosting
- **Vercel** for frontend + API routes
- **Supabase** for Postgres DB
- **Cloudinary** for tutor logo/profile image uploads

---

## Database Schema (Prisma)

```prisma
model Tutor {
  id            String    @id @default(uuid())
  name          String
  email         String    @unique
  phone         String?
  centerName    String
  logoUrl       String?
  language      String    @default("en") // "en" or "ta"
  whatsappFrom  String?   // tutor's WhatsApp business number
  createdAt     DateTime  @default(now())
  students      Student[]
  batches       Batch[]
}

model Batch {
  id        String    @id @default(uuid())
  name      String    // e.g. "NEET 2026 Morning Batch"
  tutorId   String
  tutor     Tutor     @relation(fields: [tutorId], references: [id])
  students  Student[]
  subjects  Subject[]
}

model Student {
  id            String       @id @default(uuid())
  name          String
  parentName    String
  parentPhone   String       // WhatsApp number with country code, e.g. +919876543210
  reportToken   String       @unique @default(uuid())
  tutorId       String
  tutor         Tutor        @relation(fields: [tutorId], references: [id])
  batchId       String?
  batch         Batch?       @relation(fields: [batchId], references: [id])
  feeAmount     Float?       // monthly fee in INR
  feePaidUpto   DateTime?
  attendance    Attendance[]
  testScores    TestScore[]
  createdAt     DateTime     @default(now())
}

model Subject {
  id         String      @id @default(uuid())
  name       String      // e.g. "Physics", "Chemistry"
  batchId    String
  batch      Batch       @relation(fields: [batchId], references: [id])
  testScores TestScore[]
}

model Attendance {
  id         String   @id @default(uuid())
  studentId  String
  student    Student  @relation(fields: [studentId], references: [id])
  date       DateTime @db.Date
  present    Boolean
  note       String?
  createdAt  DateTime @default(now())

  @@unique([studentId, date])
}

model TestScore {
  id          String   @id @default(uuid())
  studentId   String
  student     Student  @relation(fields: [studentId], references: [id])
  subjectId   String
  subject     Subject  @relation(fields: [subjectId], references: [id])
  testName    String   // e.g. "Unit Test 3", "Mock Exam"
  score       Float
  maxScore    Float
  date        DateTime @db.Date
  note        String?
  createdAt   DateTime @default(now())
}

model DigestLog {
  id         String   @id @default(uuid())
  studentId  String
  sentAt     DateTime @default(now())
  status     String   // "sent" | "failed"
  message    String?
}
```

---

## App Pages & Features

### 1. Tutor Onboarding (`/onboarding`)
- Simple multi-step form: Name → Center Name → Upload Logo → Phone number → Language preference (English / Tamil)
- Save to `Tutor` table
- After onboarding, redirect to dashboard

### 2. Tutor Dashboard (`/dashboard`)
- Header: center logo + name + "Good morning, [tutor name]"
- Summary cards row:
  - Total students
  - Present today (updates live as attendance is marked)
  - Fees due this month (students whose `feePaidUpto` < current month)
  - Pending test entries
- Quick action buttons:
  - "Mark Today's Attendance" → opens attendance sheet
  - "Add Test Score" → opens score entry modal
  - "Send WhatsApp Update" → manually trigger digest for selected batch
- Student list table with columns: Name, Batch, Attendance %, Last Test Score, Fee Status (Paid/Due), Actions

### 3. Attendance Marking (`/attendance`)
- Date picker at top (defaults to today)
- Batch filter dropdown
- List of students with big toggle buttons: Present (green) / Absent (red)
- "Mark all present" shortcut button
- Notes field per student (optional, e.g. "called in sick")
- Save button → writes to `Attendance` table
- Show today's summary at bottom: X present, Y absent

### 4. Test Score Entry (`/scores`)
- Select batch → select subject → enter test name + date + max marks
- Table of all students in batch with an input field per student for their score
- Scores auto-save on blur
- Color code: green if score ≥ 70%, amber if 40–70%, red if < 40%
- After saving, show option: "Send scores to parents via WhatsApp now?"

### 5. Student Profile (`/students/[studentId]`)
- Student info at top (name, parent contact, batch, fee status)
- Attendance history: calendar heatmap showing last 3 months (green = present, red = absent, gray = holiday/no class)
- Test score history: line chart per subject showing score trend over time
- Fee history: list of fee payment records
- "Edit student" and "Send WhatsApp update" buttons
- "Copy parent link" button → copies the magic link `yourdomain.com/parent/[reportToken]` to clipboard

### 6. Add/Edit Student (`/students/new` and `/students/[studentId]/edit`)
- Form fields: Name, Parent Name, Parent WhatsApp Number, Batch, Monthly Fee Amount
- On save, auto-generate `reportToken` (UUID) for parent portal
- Validate Indian phone numbers (10 digits, prefix +91)

### 7. Batch Management (`/batches`)
- List of batches
- Create batch: Name, Subjects (multi-tag input)
- View batch: list of students, attendance summary for today, upcoming tests

### 8. Fee Tracker (`/fees`)
- Table: Student name, Monthly fee amount, Last paid, Status (Paid/Due/Overdue)
- "Mark as paid" button → updates `feePaidUpto` to end of current month
- Overdue = `feePaidUpto` is more than 30 days ago
- Summary at top: total expected this month, total collected, total pending
- One-tap "Send fee reminder on WhatsApp" per student

### 9. Parent Portal (`/parent/[reportToken]`) — PUBLIC ROUTE, NO LOGIN
This is what parents see when they click the WhatsApp link. No login needed.

Layout:
- Header: Tutor center logo + name + "Report for [Student Name]"
- Today's summary card: Present/Absent, subjects covered today
- Attendance stats: This month's attendance percentage with a simple progress bar
- Recent test scores: Last 5 test scores with subject name, score/max, date, color indicator
- Score trend: Simple sparkline chart per subject (last 10 tests)
- Parent feedback box: Text area + "Send to tutor" button → creates a simple notification in tutor dashboard
- Footer: "Powered by [App Name]" with subtle branding

Important: This page must load fast on slow connections. No heavy libraries. Keep it under 100KB total JS.

### 10. WhatsApp Digest System (`/api/cron/daily-digest`)

Triggered daily at 7:00 PM IST via Vercel Cron.

Logic:
1. Fetch all students who had class today (i.e., attendance record exists for today, present or absent)
2. For each student, compose a WhatsApp message in the tutor's selected language
3. Send via Twilio WhatsApp API
4. Log result to `DigestLog`

English message template:
```
📚 *[Center Name] — Daily Report*
Student: *[Student Name]*
Date: [DD Month YYYY]

✅ Attendance: Present / ❌ Absent

📖 Subjects today: [Physics, Chemistry, Maths]

📝 Recent scores:
• Physics Unit Test: 42/50
• Chemistry Mock: 38/50

👉 Full report: [magic link]

_Reply to this message to send a note to your tutor_
```

Tamil message template (when tutor's language = "ta"):
```
📚 *[மையம் பெயர்] — தினசரி அறிக்கை*
மாணவர்: *[மாணவர் பெயர்]*
தேதி: [DD மாதம் YYYY]

✅ வருகை: வந்தார் / ❌ வரவில்லை

📖 இன்று படித்தவை: [Physics, Chemistry, Maths]

📝 சமீபத்திய மதிப்பெண்கள்:
• Physics Unit Test: 42/50

👉 முழு அறிக்கை: [magic link]
```

Also create a "Send now" button in the tutor dashboard to manually trigger the digest for a specific student or entire batch.

---

## UI/UX Requirements

### General
- Font: Use Google Fonts — "Noto Sans" as base (supports Tamil script perfectly)
- Tamil text must render correctly everywhere — test with Tamil student names
- Color palette: primary = `#2563EB` (blue), accent = `#16A34A` (green), danger = `#DC2626` (red)
- All data-heavy tables must be horizontally scrollable on mobile
- Loading states on every async action (skeleton loaders, not spinners)
- Toast notifications for all success/error states (use sonner library)
- Every destructive action (delete student, delete batch) must have a confirm dialog

### Mobile UX
- Bottom navigation bar on mobile with 4 tabs: Home, Attendance, Students, More
- The attendance marking page must be thumb-friendly — big tap targets (minimum 44px)
- Swipe to mark present/absent on the attendance list (like Tinder swipe gesture)
- All forms must work with the Android keyboard open (no content hidden behind keyboard)

### Performance
- Parent portal page: aim for < 2 second load on 3G
- Tutor dashboard: lazy-load charts, show data first
- Images: use Next.js `<Image>` component with optimization

---

## Environment Variables Required

```env
DATABASE_URL=                    # Supabase PostgreSQL connection string
NEXTAUTH_SECRET=                 # Random secret for NextAuth
NEXTAUTH_URL=                    # Your deployment URL
EMAIL_SERVER=                    # SMTP for OTP emails (use Resend.com)
EMAIL_FROM=                      # Sender email

TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_FROM=            # e.g. whatsapp:+14155238886

NEXT_PUBLIC_APP_URL=             # Your public domain
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## Folder Structure

```
/app
  /dashboard          → tutor main dashboard
  /attendance         → attendance marking
  /scores             → test score entry
  /students
    /new              → add student form
    /[studentId]      → student profile
    /[studentId]/edit → edit student
  /batches            → batch management
  /fees               → fee tracker
  /parent/[reportToken] → public parent portal (no auth)
  /onboarding         → tutor setup flow
  /api
    /auth/[...nextauth]
    /students
    /attendance
    /scores
    /fees
    /whatsapp/send
    /cron/daily-digest  → protected cron endpoint
/components
  /ui                 → shadcn components
  /dashboard          → dashboard-specific components
  /attendance         → attendance components
  /parent             → parent portal components
/lib
  /prisma.ts          → Prisma client singleton
  /whatsapp.ts        → WhatsApp message sender
  /auth.ts            → NextAuth config
  /utils.ts           → helpers (date formatting, phone validation, etc.)
/prisma
  /schema.prisma
```

---

## Key Business Rules to Implement

1. A student can only have one attendance record per day per batch.
2. The `reportToken` is permanent — never regenerate it. Changing it breaks the parent's bookmarked link.
3. Parent portal must show only the last 30 days of data to keep it fast.
4. Fee status logic: if `feePaidUpto` is null → "Not set". If `feePaidUpto` ≥ last day of current month → "Paid". If `feePaidUpto` < current date → "Overdue". Else → "Due".
5. WhatsApp digest is sent only if attendance was marked that day (don't send on holidays).
6. The cron endpoint `/api/cron/daily-digest` must be protected with a secret header: `Authorization: Bearer [CRON_SECRET]` to prevent public triggering.
7. Tutor can only see their own students, batches, and data — strict row-level isolation by `tutorId`.

---

## What to Build First (Prioritized Order)

1. DB schema + Prisma setup + Supabase connection
2. NextAuth tutor login (email OTP)
3. Student CRUD (add, list, view, edit)
4. Attendance marking page
5. Test score entry
6. Parent portal (public, magic link)
7. WhatsApp digest (manual send first, then cron)
8. Fee tracker
9. Dashboard with summary cards
10. Batch management
11. Tamil language support
12. Polish: animations, empty states, error boundaries

---

## Nice-to-Haves (build after v1 is stable)

- Push notifications via Web Push API (so parents get alerts even without WhatsApp)
- Export attendance sheet as PDF or Excel
- Bulk import students from CSV
- Monthly progress report PDF generation (parent can download)
- In-app parent feedback thread (threaded messages between tutor and parent)
- Multi-tutor support (one center with multiple teachers)
- Stripe/Razorpay integration for online fee collection
- Analytics dashboard: batch-wise performance comparison, subject-wise weak areas
