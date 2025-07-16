import React, { useState, useEffect } from 'react';
import './TestGame.css'; // Import the stylesheet

// Main App Component
export default function TestGame() {
    const [score, setScore] = useState(0);

    // --- Local Storage ---
    // Load score from local storage on initial render
    useEffect(() => {
        const savedScore = localStorage.getItem('clickerGameScore');
        if (savedScore) {
            setScore(parseInt(savedScore, 10));
        }
    }, []);

    // Save score to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('clickerGameScore', score);
    }, [score]);

    // --- Game Logic ---
    const handleClick = () => {
        setScore(score + 1);
    };

    return (
        <div className="app-container">
            <div className="game-card">
                <h1 className="game-title">Clicker Game</h1>
                <p className="game-subtitle">Click the button to increase your score!</p>

                <div className="score-container">
                    <p className="score-label">Your Score:</p>
                    <p className="score-value">{score}</p>
                </div>

                <button
                    onClick={handleClick}
                    className="click-button"
                >
                    Click Me!
                </button>
            </div>
        </div>
    );
}
