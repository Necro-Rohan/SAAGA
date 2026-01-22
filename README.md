# SAAGAA Web

Modern responsive website for SAAGAA Unisex Salon & Spa.

## Overview

Single-page application built with React and Vite, designed to present premium salon services, showcase the venue, and provide essential business information.

**Current status**: Production-ready static site with optional lightweight backend scaffold.

## Features

- Responsive layout across mobile, tablet, and desktop
- Smooth scroll-linked animations and micro-interactions
- Service overview with expandable detail cards
- Ambient photography gallery with lightbox viewer
- Customer testimonial carousel
- Integrated interactive map (Google Maps embed)
- Contact information and call-to-action flows

## Tech Stack

| Layer           | Technology           | Purpose                              |
|-----------------|----------------------|--------------------------------------|
| Framework       | React 18 / 19        | Component model & UI                 |
| Build Tool      | Vite                 | Fast dev server & optimized builds   |
| Styling         | Tailwind CSS 3 / 4   | Utility-first CSS workflow           |
| Animation       | Framer Motion        | Scroll, hover, gesture animations    |
| Icons           | Lucide React         | Consistent, tree-shakeable icons     |
| Backend (opt.)  | Node.js + Express    | API scaffolding (currently minimal)  |
| Linting/Formatting | ESLint + Prettier | Code quality & consistency           |

## Getting Started

### Prerequisites

- Node.js ≥ 18.17
- npm ≥ 9 (or pnpm / yarn)

### Development

```bash
# Clone repository (SSH or HTTPS depending on your access)
git clone git@github.com:Rahulgupta7777/SAAGA.git
# or
# git clone https://github.com/Rahulgupta7777/SAAGA.git

cd SAAGA 
# Frontend
cd frontend
npm ci                    # or pnpm install --frozen-lockfile ```
npm run dev

```
## Backend

```
cd ../backend
npm ci
npm start
```

## Build for production

```
cd frontend
npm run build
```
