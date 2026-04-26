# Math Space - NUMATIK AI

## Overview
Math Space is a React + Vite-based math tutoring application designed for Indonesian middle school students (SMP). It features interactive learning content, a variety of educational games, and a NUMATIK AI chatbot powered by Google Gemini to provide assistance and enhance the learning experience. The project aims to make math engaging and accessible, covering a wide range of topics from basic arithmetic to advanced geometry and algebra.

## User Preferences
I want to work iteratively. Before making any major changes, please ask for confirmation. I prefer clear and concise communication. Ensure that any explanations are easy to understand for someone with a good grasp of software development but not necessarily an expert in the specific domain of this project. Do not make changes to files within the `server.ts` or `vite.config.ts` files without explicit instruction.

## System Architecture
The application follows a client-server architecture:
- **Frontend**: Built with React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, and react-router-dom. It provides a rich, interactive user interface. UI/UX elements include full-color standalone canvas games, animated SVGs for complex math concepts, LaTeX formulas, color-coded sections, and interactive tools.
- **Backend**: An Express.js API server handles requests, primarily for the AI chatbot.
- **AI Integration**: Google Gemini powers the NUMATIK AI chatbot, accessed server-side via the Express `/api/chat` endpoint to ensure API key security.
- **Development Workflow**: A Vite development server proxies API requests to the Express backend.
- **Content Structure**: Educational content is organized by grade level (Kelas 7, 8, 9) and topic, including "Materi Matematika" (learning materials), "Latihan Mandiri" (independent practice), "Bank Soal" (question bank), "Math Game Arena" (math games), and "Olimpiade" (olympiad-style questions).
- **Game Mechanics**: The "Math Game Arena Umum" includes various full-color canvas games. A "teacher quiz" system is integrated into these games for evaluation, implemented via `useGuruQuiz.ts` and `GuruQuizOverlay.tsx`.
  - **Snake Matematika** (`SnakeMathPage.tsx`): Full-screen play area (24×16 cells, 36px each) with grass-meadow gradient background. Realistic continuous snake (gradient body, dorsal stripe, scale dots, detailed head with iris/pupil eyes, animated forked tongue). Foods are fruit emojis (🍎🍓🍒🍇🍊🍉🍑🥝🍌🍍🍐🥭) with number badges; correct answer has golden halo + orbiting sparkles. HUD (question, score, length, speed bar) rendered as React HTML above the canvas.
  - **Tetris**: Vibrant 3D gem-style blocks with gradient/sheen, plus grand-opening intro screen.
  - All games share the consistent ← Kembali / 🏠 Home pill nav pattern.
- **Content Features**: Content pages extensively use `react-katex` for LaTeX rendering, SVG diagrams for visual explanations, and interactive components like accordions and collapsible sections.
- **Deployment**: The Express server is configured to serve the built frontend in production and binds to `0.0.0.0` for environment compatibility.

## External Dependencies
- **Google Gemini**: Utilized for the NUMATIK AI chatbot through the `GOOGLE_GENERATIVE_AI_API_KEY`.
- **React 18**: Frontend JavaScript library.
- **Vite**: Frontend build tool.
- **TypeScript**: Superset of JavaScript for type-safety.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **shadcn/ui**: UI component library.
- **react-router-dom**: Declarative routing for React.
- **Express.js**: Backend web framework for Node.js.
- **react-katex**: React component for typesetting math with KaTeX.