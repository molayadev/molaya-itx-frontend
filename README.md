Hi! Thanks for checking out this project.

For this assignment, I decided to go beyond a simple "make it work" approach. Drawing from my experience in software engineering, I wanted to treat this test as a proof of concept for a scalable, production-ready application. I applied the best practices I rely on daily to ensure the code is maintainable, testable, and robust.

## My Approach & Architecture

### Hexagonal Architecture & SOLID Principles
Instead of tight coupling, I structured the folder hierarchy based on **Hexagonal Architecture** based on my experience in back end.
* **Why?** I wanted to isolate the business logic (Domain) from the UI (React) and external services (API/Storage). This architecture will allow to extract features to different apps or domains, whithout breaking the UI.
* **SOLID:** I heavily applied these principles, specifically **Dependency Inversion**. My components tries to depend on interfaces (like `ProductRepository` or `ILogger` or `ICache`), not concrete implementations. This respects the **Single Responsibility Principle**, ensuring each part of the app does exactly one thing well.
API Client will be parametrizable to cache GET calls or not.

### Manual Dependency Injection (DI)
I implemented a custom DI system using React Context.
* **The Goal:** To decouple components from infrastructure.
* **The Benefit:** This makes testing a breeze. I can inject a fake repository or a silent logger during tests without changing a single line of the component's code.

### Production-Ready Abstractions
I thought about how this app would live in a real production environment. Hence use SOLID pattern of Interfaces to switch features like in prod, guarantee a contract of implementation in the whole app:
* **Abstract Logger:** Instead of using `console.log` everywhere, I created an `ILogger` interface. Right now, it outputs to the console (with styling), but in a real-world scenario, we could switch easily the implementation to send logs to **Datadog**, **Sentry**, or a file system without touching the rest of the app.
* **Smart Caching:** I built a generic caching mechanism that respects the 1-hour expiration rule but is agnostic to the storage method (currently `localStorage`).

### Strategy for React Contexts
I used React Contexts for two distinct purposes:
* **Dependency Context (`DIProvider`):** This holds the *services* (Singleton instances like Repositories, API Clients, Loggers). These are static tools the app uses.
* **Feature Contexts (e.g., `CartProvider`):** These hold the *state* and specific data for modules. They manage the volatile data that changes as the user interacts with the app.

---

## Technical Stack

* **Build:** Webpack 5 (Configured manually from scratch)
* **Language:** TypeScript (Strict mode enabled)
* **Styling:** Native CSS Modules
* **Testing:** Jest + React Testing Library

## How to Run

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Start development server:**
    ```bash
    npm start
    ```
    Runs on `http://localhost:3000`.

3.  **Run tests:**
    ```bash
    npm test
    ```

4.  **Lint code:**
    ```bash
    npm run lint
    ```

5.  **Build for production:**
    ```bash
    npm run build
    ```

I hope this structure demonstrates not just my coding skills, but my ability to design systems that are built to last. I look forward to your feedback!
