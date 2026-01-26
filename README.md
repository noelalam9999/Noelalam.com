# Noel Alam - Portfolio Website

A modern, responsive portfolio website for an Engineering Manager showcasing experience, projects, and testimonials.

## Features

- **Smooth Loader**: Animated loading screen with progress indicator
- **Intro Video Section**: Hero section with video placeholder (ready for your video)
- **Experience Section**: Showcase of 5 years of engineering management experience
- **Projects Section**: Highlighted technical projects with technologies used
- **Testimonials**: Recommendations from colleagues and leaders
- **Smooth Animations**: Fluid transitions using Framer Motion
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI/UX**: Following best design practices and accessibility standards

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for smooth transitions

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Adding Your Intro Video

1. Place your video file in the `public` folder as `intro-video.mp4`
2. The video will automatically load and display in the intro section
3. Supported formats: MP4 (recommended), WebM, OGG

## Customization

### Update Experience
Edit `components/Experience.tsx` to update your work history.

### Update Projects
Edit `components/Projects.tsx` to showcase your projects.

### Update Testimonials
Edit `components/Testimonials.tsx` to add or modify recommendations.

### Styling
Modify `app/globals.css` and Tailwind classes throughout components to customize the design.

## Build for Production

```bash
npm run build
npm start
```

## License

MIT
