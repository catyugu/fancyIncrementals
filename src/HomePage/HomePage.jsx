import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import "./HomePage.css"; // Import the CSS file for styling
export default function HomePage() {
    return (
        <div className="home-card">
            <h1 className="home-title">Game Lobby</h1>
            <p className="home-subtitle">Select a game to play</p>
            <div className="game-list">
                {/* Use the Link component for navigation */}
                <Link to="/clicker" className="game-select-button">
                    Button Clicker
                </Link>
                <button className="game-select-button disabled" disabled>
                    More Games Coming Soon...
                </button>
            </div>
        </div>
    );
}