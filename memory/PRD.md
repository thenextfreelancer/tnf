# TheNextFreelancer - Product Requirements Document

## Original Problem Statement
Build a production-ready static website for "TheNextFreelancer" brand. Fast, SEO-optimized, secure website that helps developers learn AI-powered freelancing.

## Architecture
- **Tech Stack**: Pure HTML5, CSS (Tailwind CDN), Vanilla JavaScript
- **Hosting**: Static files deployable to Cloudflare Pages / Netlify / Vercel
- **Directory**: `/app/static-site/`

## What's Been Implemented (May 2026)

### Phase 1 (Apr 7, 2026)
- Created 7 core pages (Homepage, About, Blog, Blog Post Template, Guide, Tools, Newsletter)
- Implemented full SEO (meta tags, Open Graph, Twitter Cards, Schema.org, sitemap, robots.txt)
- Swiss Brutalist dark theme with professional + developer-focused design
- Favicon (SVG format)

### Phase 2 (May 6, 2026)
- Restructured blog system: separate `/blogs/` folder with individual HTML files
- Created 7 individual blog posts with full SEO and Schema.org BlogPosting markup
- Added security headers (CSP, X-Frame-Options, X-Content-Type-Options, referrer policy) to ALL pages
- Added new blog post from survival8.blogspot.com content (AI Observability with OTel + Phoenix)
- Fixed all navigation links to point to correct `/blogs/<slug>.html` paths
- Updated sitemap.xml with all blog post URLs

## Blog Posts Created
1. ai-project-observability-otel-phoenix.html (NEW - May 2, 2026)
2. llama-update.html (Apr 6, 2026)
3. getting-started-ai-freelancing.html (Apr 5, 2026)
4. frontier-ai-models.html (Apr 4, 2026)
5. machine-learning-course.html (Apr 3, 2026)
6. improving-llm-accuracy.html (Apr 2, 2026)
7. python-for-ai.html (Apr 1, 2026)

## User Personas
- Software developers (backend/Java)
- Engineers wanting to start freelancing using AI
- Tech professionals exploring side income

## Core Requirements (Static)
- Lightweight (<250MB) ✅ (380KB)
- SEO-optimized ✅
- Security hardened ✅
- Deployable to Cloudflare/Netlify/Vercel ✅
- No heavy frameworks ✅

## Prioritized Backlog
### P0 (Done)
- ✅ All 7 core pages
- ✅ Blog structure with individual posts
- ✅ SEO implementation
- ✅ Security headers

### P1 (Future)
- Connect newsletter form to email service
- Add Google Analytics
- Add RSS feed
- Custom domain setup
- Submit to Google Search Console

### P2 (Future)
- Add more blog content
- Implement search functionality
- Add dark/light theme toggle
- Add reading progress indicator on blog posts
- Social sharing buttons with actual functionality
