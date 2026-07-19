# Ngeles 🎭

> **The Ultimate Excuse Generator**

Ever been cornered by your boss for a missing report while you were actually taking a nap? Or asked by your professor why you skipped the final exam to push your rank in Valorant? Don't panic. Don't cry. Welcome to **Ngeles**, your ultimate digital savior!

Ngeles is an open-source, multilingual, data-driven excuse generator engineered to save your career, your GPA, and your social life from imminent destruction. Whether you need a "Safe" and plausible alibi, a "Ridiculous" scapegoat, or a "Reality-Bending" tale involving time-traveling pigeons who stole your Wi-Fi router—we've got you covered. 

*Disclaimer: We are absolutely not responsible if you get fired, expelled, or abducted by aliens for using this app.*

## ✨ Features

- **Blazing Fast**: Powered by **Svelte 5** and **Vite**, with an incredibly small footprint.
- **Data-Driven Architecture**: Easily add new scenarios, topics, and languages without touching the source code.
- **Dark Mode**: Sleek dark mode support built with **Tailwind CSS v4**.
- **Global Stats**: A persistent global counter that tracks all excuses generated worldwide, backed by **SQLite**.
- **Interactive UI**: Micro-animations, dynamic colors based on absurdity levels, and quick "Send via WhatsApp" functionality.

## 🚀 Getting Started

### Prerequisites
Make sure you have [Bun](https://bun.sh/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/SupianIDz/Ngeles.git
   cd ngeles
   ```
2. Install dependencies:
   ```bash
   bun install
   ```

### Development
To run the frontend and backend simultaneously in development mode:

1. Start the Vite development server (Frontend):
   ```bash
   bun run dev
   ```
2. Start the Fastify API server (Backend):
   ```bash
   bun run server:dev
   ```

### Production Build
1. Build the Svelte application:
   ```bash
   bun run build
   ```
2. Start the production server:
   ```bash
   bun run server
   ```
The app will be served at `http://127.0.0.1:3000`.

## 🤝 Contributing

We love open-source! Because Ngeles uses a **data-driven architecture**, anyone can easily contribute new excuses, topics, or even entire new languages **without knowing how to code**.

Please read our [Contributing Guide](CONTRIBUTING.md) to learn how you can add your own hilarious excuses to the database, our coding style requirements (`oxfmt`), and our commit conventions.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
