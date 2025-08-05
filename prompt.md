# Gemini AI Assistant Guide for Fancy Incrementals

This document provides guidance for the Gemini AI assistant to effectively contribute to the Fancy Incrementals project.

## **1. Project Overview**

Fancy Incrementals is a full-stack serverless application for hosting and playing incremental games. The platform currently features "Cosmic Forge", an incremental game where players generate energy, collect stardust, and progress through various prestige mechanics.

## **2. Current Project Architecture**

### Frontend Structure

```plaintext
/src
  /App.jsx             # 主应用入口
  /main.jsx            # 应用渲染入口
  /games               # 游戏目录
    /testgame          # 测试游戏目录(Cosmic Forge)
      /TestGame.jsx    # 游戏主组件
      /TestGame.css    # 游戏样式
      /gameConfig.js   # 游戏配置文件
  /HomePage            # 主页组件
    /HomePage.jsx      # 主页
    /HomePage.css      # 主页样式
```

### Backend Structure

```plaintext
/worker
  /src
    /index.js          # 主入口，处理API路由
    /utils.js          # 工具函数
    /games             # 游戏后端逻辑
      /testgame        # 测试游戏后端
        /handler.js    # 处理游戏API请求
        /index.js      # 游戏API路由
```

### Tech Stack

* **Frontend:** React (JavaScript/JSX) with CSS for styling
* **Backend:** Cloudflare Workers (JavaScript) for serverless API endpoints
* **Build Tool:** Vite for development and production builds
* **Deployment:** Cloudflare Pages (frontend) and Cloudflare Workers (backend)
* **Storage:** Cloudflare R2 for data storage (game saves)
* **Big Number Handling:** break_infinity.js library for managing large numbers

## **3. Code Standards & Guidelines**

### Styling Standards

* All CSS follows BEM methodology where appropriate
* Component-specific styles are kept in separate CSS files
* Global styles and variables are defined in central style files
* Mobile-responsive design is implemented across all interfaces

### JavaScript Standards

* React functional components with hooks are preferred over class components
* State management is handled via React's useState and useEffect
* Complex calculations are isolated in clearly named helper functions
* All asynchronous operations use async/await and proper error handling
* Game calculations should handle large numbers properly using Decimal objects

### Game Module Guidelines

* Each game should be completely self-contained in its directory
* Game configurations should be externalized in a gameConfig.js file
* Game state management should follow consistent patterns
* Numerical overflow and precision issues must be properly handled

### Performance Guidelines

* For large number calculations, use appropriate libraries and techniques to avoid overflow
* Expensive computations should be optimized and possibly memoized
* Use appropriate React optimization techniques (useMemo, useCallback) for heavy components
* Game loops should be efficient, using requestAnimationFrame properly

## **4. Current Game Implementation (Cosmic Forge)**

### Core Mechanics

* **Resources:** Energy (primary), Stardust (prestige), Quantum Energy, Dark Matter
* **Generators:** Multiple tiers that produce Energy automatically
* **Upgrades:** Boost production or provide various benefits
* **Prestige Mechanics:** Reset progress for permanent multipliers
* **Cloud Save:** Ability to save and load game state using email

### Technical Implementation

* Big number handling using break_infinity.js
* Game loop using requestAnimationFrame
* Multiple calculation strategies for handling extremely large numbers
* Save/load functionality with both local and cloud storage
* Responsive layout with tab-based navigation

## **5. Future Development Roadmap**

### Game Mechanics Improvements

* **Achievements System:** Implement in-game achievements with rewards
* **Offline Progress:** Enhance offline progress calculation and rewards
* **Balancing:** Continue to refine game balance for better progression
* **Mechanics Extension:** Add new mechanics like challenges, mini-games, or events
* **Statistics Dashboard:** Enhanced player statistics and visualizations

### Technical Improvements

* **State Management:** Consider implementing Redux or Context API for complex state
* **Code Splitting:** Implement code splitting for better loading performance
* **Optimization:** Further optimize calculation methods for extremely large numbers
* **Testing:** Implement unit and integration tests for game logic
* **Modularization:** Improve code modularization for better maintenance

### New Features

* **Leaderboards:** Global leaderboards for comparing progress
* **User Accounts:** Proper user account system instead of email-only
* **Multiple Saves:** Allow multiple save slots per user
* **Theme Customization:** Allow players to customize UI themes
* **Additional Games:** Develop new incremental games with different mechanics

### Platform Enhancements

* **Game Hub:** Central hub for accessing multiple games
* **Cross-Game Bonuses:** Rewards for playing multiple games on the platform
* **Social Features:** Sharing, challenges, and other social interactions
* **Progressive Web App:** Implement PWA features for mobile-like experience
* **Analytics:** Add analytics to understand player behavior and improve games

## **6. Development Guidance for AI Assistant**

* **Bug Fixes:** Help identify and fix numerical calculation issues, especially with large numbers
* **Optimization:** Suggest optimizations for game calculations and rendering
* **Feature Implementation:** Assist in implementing planned features from the roadmap
* **Code Quality:** Suggest improvements to maintain code quality and follow best practices
* **Game Balance:** Help with mathematical models for balanced progression

## **7. Conventions**

* **Styling:** All styling must adhere to the rules outlined in `styling_regulations.md`.
* **File Structure:** Follow the existing file structure. New games should be added to the `src/games` (frontend) and `worker/src/games` (backend) directories.
* **Component Naming:** React components should be named in PascalCase (e.g., `MyComponent`).
* **API Endpoints:** API endpoints for games should be prefixed with `/api/games/:gameName`. The Cloudflare Worker handles routes under `/api/*`.
* **Commits:** Follow the conventional commit format (e.g., `feat: add new game`, `fix: resolve issue with game state`).
* **Documentation:** All new features and changes should be documented in the `CHANGELOG.md`. And the overall introductions should be in `README.md`.
