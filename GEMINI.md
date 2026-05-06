# Namma Tuition — Project Instructions

This file contains the foundational architecture, conventions, and workflows for the Namma Tuition app.

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** Prisma ORM + PostgreSQL (Supabase)
- **Auth:** NextAuth.js (Email + OTP)
- **WhatsApp:** Twilio WhatsApp Business API
- **Storage:** Cloudinary

## Core Conventions
1. **Mobile-First:** Every component must be designed for 360px wide screens first.
2. **Bilingual Support:** Use a standard approach for English and Tamil. Ensure Tamil student names and text render correctly (Noto Sans font).
3. **Surgical Updates:** When modifying code, keep changes minimal and idiomatic.
4. **Performance:** Parent portal must be ultra-lightweight (<100KB JS). No heavy libraries on public routes.
5. **Safety:** Never log secrets. Always use environment variables for keys.

## Workflows
- **Progress Tracking:** Update `PROGRESS.md` after every major task completion.
- **Testing:** Use Playwright for critical UI flows (attendance, parent portal).
- **Design:** Follow the "Junior Designer" workflow: propose assumptions before implementation.

## UI/UX Guidelines (Inspired by huashu-design & ui-ux-pro-max)
- **Colors:** Primary Blue (`#2563EB`), Accent Green (`#16A34A`), Danger Red (`#DC2626`).
- **Typography:** Noto Sans (Google Fonts).
- **Interactions:** 44px minimum tap targets. Thumb-friendly navigation.
