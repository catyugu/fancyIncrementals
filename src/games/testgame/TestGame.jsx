import React, { useState, useEffect } from 'react';
import './TestGame.css';

export default function TestGame() {
    const [score, setScore] = useState(0);
    const [clickPower, setClickPower] = useState(1);
    const [autoClickers, setAutoClickers] = useState(0);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const clickPowerCost = Math.floor(10 * Math.pow(1.1, clickPower));
    const autoClickerCost = Math.floor(50 * Math.pow(1.15, autoClickers));

    const handleClick = () => {
        setScore(score + clickPower);
    };

    const buyClickPower = () => {
        if (score >= clickPowerCost) {
            setScore(score - clickPowerCost);
            setClickPower(clickPower + 1);
        }
    };

    const buyAutoClicker = () => {
        if (score >= autoClickerCost) {
            setScore(score - autoClickerCost);
            setAutoClickers(autoClickers + 1);
        }
    };

    useEffect(() => {
        const gameLoop = setInterval(() => {
            setScore(prevScore => prevScore + autoClickers);
        }, 1000);
        return () => clearInterval(gameLoop);
    }, [autoClickers]);

    // Save to local storage per 10 seconds
    useEffect(() => {
        const saveInterval = setInterval(() => {
            localStorage.setItem('testgame', JSON.stringify({ score, clickPower, autoClickers }));
            console.log('Game state saved to local storage.');
        }, 5000);
    }, [email, score, autoClickers]);

    // When loading the page, check for saved game data
    useEffect(() => {
        const savedGame = localStorage.getItem('testgame');
        if (savedGame) {
            const { score, clickPower, autoClickers } = JSON.parse(savedGame);
            setScore(score || 0);
            setClickPower(clickPower || 1);
            setAutoClickers(autoClickers || 0);
        }
    }, []);
    const handleSave = async () => {
        if (!email) {
            setMessage('Please enter an email to save your progress.');
            return;
        }
        try {
            const gameState = { score, clickPower, autoClickers };
            const response = await fetch('/api/testgame/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, ...gameState }),
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
            const response = await fetch(`/api/testgame/load?email=${email}`);
            const data = await response.json();
            if (response.ok) {
                setScore(data.score);
                setClickPower(data.clickPower || 1);
                setAutoClickers(data.autoClickers || 0);
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
                    <p className="score-label">Points per second: {autoClickers}</p>
                </div>

                <button onClick={handleClick} className="click-button">
                    Click Me! (+{clickPower})
                </button>

                <div className="upgrades-container">
                    <div className="upgrade-card">
                        <h3>Upgrade Click</h3>
                        <p>Increases points per click.</p>
                        <p>Current Power: {clickPower}</p>
                        <button onClick={buyClickPower} className="upgrade-button" disabled={score < clickPowerCost}>
                            Cost: {clickPowerCost}
                        </button>
                    </div>
                    <div className="upgrade-card">
                        <h3>Buy Auto-Clicker</h3>
                        <p>Generates points automatically.</p>
                        <p>Owned: {autoClickers}</p>
                        <button onClick={buyAutoClicker} className="upgrade-button" disabled={score < autoClickerCost}>
                            Cost: {autoClickerCost}
                        </button>
                    </div>
                </div>

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