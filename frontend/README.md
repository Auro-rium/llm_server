<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# CORE-ALPHA | TACTICAL TERMINAL

A futuristic, tactical AI interface for self-hosted LLMs. Built with **React**, **Vite**, and **TailwindCSS**.

## 🚀 Features

*   **Real-time Streaming**: Server-Sent Events (SSE) for instant token streaming.
*   **System Telemetry**: Live visualization of Backend CPU and RAM usage.
*   **Tactical UI**: Glassmorphism, scanlines, and retro-futuristic aesthetics.
*   **Generation Control**: Client-side safeguards against runaway generation loops.

## 🛠️ Tech Stack

*   **Framework**: React (Vite)
*   **Styling**: TailwindCSS + Custom CSS
*   **Language**: TypeScript
*   **State Management**: React Hooks

## 🏃‍♂️ Run Locally

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start Development Server**:
    ```bash
    npm run dev
    ```
    Access the terminal at `http://localhost:5173`.

## 🔌 Configuration

The frontend connects to the backend at `http://127.0.0.1:8000` by default.
Modify `services/api.ts` if your backend is running on a different port.
