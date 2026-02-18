# Technical Documentation - Joypurhat Ramadan Calendar 2026

## Architecture Overview
This is an enterprise-class Next.js application deployed on bare-metal Debian 13. It leverages a modern stack for high performance and reliability.

### Core Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL 17
- **ORM**: Prisma v6
- **Styling**: Tailwind CSS 4
- **Runtime**: Node.js 22
- **Process Manager**: PM2
- **Web Server**: Nginx (Reverse Proxy + SSL)

## Timezone Handling (Asia/Dhaka)
The application handles the BDT (Bangladesh Standard Time) timezone strictly on the server-side to ensure accuracy.
Utility functions in  handle:
- Conversion of Bangla numerals to English for logic.
- Real-time BDT date generation using .

## Database Schema
The  model stores the Ramadan schedule:
- : Bangla date (e.g., ০১ রমজান)
- : English date (e.g., ১৯ ফেব্রুয়ারি)
- : Specific timings for Joypurhat.
- : রহমত, মাগফিরাত, নাজাত.

## Deployment Details
- **Location**: /root/joypurhat-ramadan
- **Nginx Config**: 
- **SSL**: Let's Encrypt via Certbot.
- **Auto-restart**: PM2 configured to resurrect on reboot via systemd.
