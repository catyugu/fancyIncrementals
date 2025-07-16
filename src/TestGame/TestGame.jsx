import React, { useState, useEffect } from 'react';
import './TestGame.css'; // Import the stylesheet

// Main App Component
export default function TestGame() {
    const [score, setScore] = useState(0);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    // --- Local Storage ---
    // Load score from local storage on initial render
    useEffect(() => {
        const savedScore = localStorage.getItem('clickerGameScore');
        if (savedScore) {
            setScore(parseInt(savedScore, 10));
        }
    }, []);

    // **NEW: Asynchronously save score to local storage every 10 seconds**
    useEffect(() => {
        const interval = setInterval(() => {
            // Since the state in the interval's closure might be stale,
            // we use a functional update to get the latest score.
            setScore(currentScore => {
                localStorage.setItem('clickerGameScore', currentScore);
                // We return the score unchanged because we're not actually setting a new state,
                // just using the callback to access the latest state.
                return currentScore;
            });
        }, 10000); // 10000 milliseconds = 10 seconds

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(interval);
    }, []); // Empty dependency array ensures this effect runs only once

    // --- Game Logic ---
    const handleClick = () => {
        setScore(score + 1);
    };

    // --- Remote Storage ---
    const handleSave = async () => {
        if (!email) {
            setMessage('Please enter an email to save your progress.');
            return;
        }
        try {
            const response = await fetch('/api/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, score }),
            });
            const data = await response.json();
            setMessage(data.message || data.error);
        } catch (error) {
            console.error('Error saving progress:', error);
            setMessage('Failed to save progress.');
        }
    };

    const handleLoad = async () => {
        if (!email) {
            setMessage('Please enter an email to load your progress.');
            return;
        }
        try {
            const response = await fetch(`/api/load?email=${email}`);
            const data = await response.json();
            if (response.ok) {
                setScore(data.score);
                setMessage('Progress loaded successfully!');
            } else {
                setMessage(data.error);
            }
        } catch (error) {
            console.error(error);
            setMessage('Failed to load progress.');
        }
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

                <div className="storage-container">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="email-input"
                    />
                    <div className="storage-buttons">
                        <button onClick={handleSave} className="storage-button">Save</button>
                        <button onClick={handleLoad} className="storage-button">Load</button>
                    </div>
                    {message && <p className="message">{message}</p>}
                </div>
            </div>
        </div>
    );
}