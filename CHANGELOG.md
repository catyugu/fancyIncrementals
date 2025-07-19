# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2025-07-20

### Added
-   **Cosmic Forge Game:**
    -   New "Cosmic" theme with `Energy` and `Stardust` resources.
    -   Multiplicative and exponential upgrades.
    -   Ascension mechanic ("Create Singularity") for permanent boosts.
    -   Local storage persistence (auto-save every 5 seconds).
    -   Offline progress calculation on load.
-   **Styling:**
    -   Overhauled game UI to align with `styling_regulations.md`.

### Changed
-   Reworked the initial `TestGame` into the more feature-rich "Cosmic Forge".
-   Updated `README.md` to reflect the new game and its features.

## [0.1.0] - 2025-07-20

### Added

-   Initial project setup with React, Vite, and Cloudflare Workers.
-   `HomePage` and `TestGame` components.
-   Backend handler for `TestGame`.
-   R2 bucket binding for game saves.
-   ESLint configuration for code quality.
-   `styling_regulations.md` to document styling guidelines.
-   `LICENSE` file (MIT).

### Changed

-   Updated `README.md` with more detailed information about the project structure, features, and contribution guidelines.

## [Unreleased]

### Added

-   Created `CHANGELOG.md` to track development progress.

### Changed

-   Updated `README.md` to accurately reflect the project's purpose and structure. Removed generic template content and added specific details about the "fancy-incrementals" game platform.
