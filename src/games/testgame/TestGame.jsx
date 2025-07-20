import React, { useState, useEffect, useCallback } from 'react';
import './TestGame.css';

// --- Helper Functions ---
const formatNumber = (num) => {
    if (num < 1000) return num.toFixed(2);
    const suffixes = ['', 'k', 'M', 'B', 'T', 'q', 'Q', 's', 'S'];
    const i = Math.floor(Math.log10(num) / 3);
    const shortNum = (num / Math.pow(1000, i)).toFixed(2);
    return `${shortNum}${suffixes[i]}`;
};

// --- Game Components ---
const ResourceDisplay = ({ energy, energyPerSecond, stardust }) => (
    <div className="resource-display-panel">
        <div className="resource">
            <span className="resource-label">Stardust</span>
            <span className="resource-value">{formatNumber(stardust)}</span>
        </div>
        <div className="resource">
            <span className="resource-label">Energy</span>
            <span className="resource-value">{formatNumber(energy)}</span>
            <span className="resource-rate">+{formatNumber(energyPerSecond)}/s</span>
        </div>
    </div>
);

const TabButton = ({ activeTab, tabName, onClick }) => (
    <button
        className={`tab-button ${activeTab === tabName ? 'active' : ''}`}
        onClick={() => onClick(tabName)}
    >
        {tabName}
    </button>
);

const UpgradeButton = ({ item, onBuy, canAfford, isMaxed }) => (
    <div className={`upgrade-item ${!isMaxed && canAfford ? 'affordable' : ''} ${isMaxed ? 'maxed' : ''} ${!canAfford && !isMaxed ? 'unaffordable' : ''}`}>
        <div className="upgrade-info">
            <span className="upgrade-name">{item.name}</span>
            <span className="upgrade-effect">{item.description}</span>
        </div>
        <div className="upgrade-cost">
            <span>Cost:</span>
            <span>{formatNumber(item.cost)} Energy</span>
        </div>
        <div className="upgrade-owned">
            <span>{item.type === 'generator' ? 'Owned:' : 'Level:'}</span>
            <span>{item.owned}</span>
        </div>
        <button onClick={() => onBuy(item.id)} disabled={!canAfford || isMaxed} className="buy-button">
            {isMaxed ? 'Maxed' : 'Purchase'}
        </button>
    </div>
);

const AscensionButton = ({ onAscend, canAscend, stardustToGain }) => (
    <div className="ascend-container">
        <h2>Create Singularity</h2>
        <p>Reset your progress to gain Stardust, which provides a permanent boost to Energy generation.</p>
        <p>You will gain: <span className="text-accent">{formatNumber(stardustToGain)}</span> Stardust.</p>
        <button onClick={onAscend} disabled={!canAscend} className="ascend-button">
            Ascend
        </button>
    </div>
);

const CloudStorage = ({ email, setEmail, onSave, onLoad, loading, error, message }) => (
    <div className="cloud-storage-container">
        <h2>Cloud Storage</h2>
        <p>Save or load your game progress using your email.</p>
        <div className="cloud-form">
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="cloud-email-input"
            />
            <div className="cloud-buttons">
                <button onClick={onSave} disabled={loading || !email}>
                    {loading ? 'Saving...' : 'Save to Cloud'}
                </button>
                <button onClick={onLoad} disabled={loading || !email}>
                    {loading ? 'Loading...' : 'Load from Cloud'}
                </button>
            </div>
        </div>
        {error && <p className="cloud-message error">{error}</p>}
        {message && <p className="cloud-message success">{message}</p>}
    </div>
);


// --- Main Game Component ---
// --- Main Game Component ---

const initialGenerators = [
    { id: 'h_cloud', name: 'Hydrogen Cloud', owned: 0, baseCost: 10, cost: 10, baseEnergy: 0.1, type: 'generator' },
    { id: 's_nursery', name: 'Stellar Nursery', owned: 0, baseCost: 120, cost: 120, baseEnergy: 1, type: 'generator' },
    { id: 'g_cluster', name: 'Galaxy Cluster', owned: 0, baseCost: 1500, cost: 1500, baseEnergy: 8, type: 'generator' },
    { id: 'neutron_star', name: 'Neutron Star', owned: 0, baseCost: 20000, cost: 20000, baseEnergy: 50, type: 'generator' },
    { id: 'black_hole', name: 'Black Hole', owned: 0, baseCost: 300000, cost: 300000, baseEnergy: 250, type: 'generator' },
];

const initialUpgrades = [
    { id: 'energy_boost_1', name: 'Cosmic Rays', owned: 0, baseCost: 500, cost: 500, description: 'Multiplies Energy generation by 1.2x per level.', baseMultiplier: 1.2, type: 'global' },
    { id: 'h_cloud_boost_1', name: 'Focused Solar Winds', owned: 0, baseCost: 1000, cost: 1000, description: 'Doubles Hydrogen Cloud output per level.', baseMultiplier: 2, target: 'h_cloud', type: 'upgrade' },
    { id: 's_nursery_boost_1', name: 'Gravitational Collapse', owned: 0, baseCost: 6000, cost: 6000, description: 'Doubles Stellar Nursery output per level.', baseMultiplier: 2, target: 's_nursery', type: 'upgrade' },
    { id: 'g_cluster_boost_1', name: 'Galactic Filaments', owned: 0, baseCost: 40000, cost: 40000, description: 'Multiplies Galaxy Cluster output by 1.5x per level.', baseMultiplier: 1.5, target: 'g_cluster', type: 'upgrade' },
    { id: 'energy_boost_2', name: 'Zero-Point Energy', owned: 0, baseCost: 150000, cost: 150000, description: 'Multiplies Energy generation by 1.2x per level.', baseMultiplier: 1.2, type: 'global' },
];

// Create a deep copy to ensure the initial state is always fresh.
const getInitialState = () => ({
    energy: 10,
    stardust: 0,
    generators: initialGenerators.map(g => ({ ...g })),
    upgrades: initialUpgrades.map(u => ({ ...u })),
});

export default function TestGame() {
    // --- State ---
    const [email, setEmail] = useState('');
    const [cloudLoading, setCloudLoading] = useState(false);
    const [cloudError, setCloudError] = useState('');
    const [cloudMessage, setCloudMessage] = useState('');

    const [gameState, setGameState] = useState(getInitialState());
    const { energy, stardust, generators, upgrades } = gameState;
    const [activeTab, setActiveTab] = useState('Generators');

    const setState = (merger) => {
        setGameState(prev => {
            if (typeof merger === 'function') {
                return merger(prev);
            }
            return { ...prev, ...merger };
        });
    };

    // --- Calculations ---
    const stardustMultiplier = (1.1 ** stardust);

    const totalUpgradeMultiplier = upgrades
        .filter(u => u.type === 'global')
        .reduce((acc, u) => acc * (u.baseMultiplier ** u.owned), 1);

    const energyPerSecond = generators.reduce((total, gen) => {
        const genUpgrade = upgrades.find(u => u.target === gen.id);
        const genMultiplier = genUpgrade ? (genUpgrade.baseMultiplier ** genUpgrade.owned) : 1;
        return total + gen.owned * gen.baseEnergy * genMultiplier;
    }, 0) * totalUpgradeMultiplier * stardustMultiplier;

    const energyPerClick = 1 * totalUpgradeMultiplier * stardustMultiplier;

    const stardustToGain = Math.floor(Math.cbrt(energy / 1e6));
    const canAscend = energy >= 1e6;

    // --- Game Loop ---
    useEffect(() => {
        const gameLoop = setInterval(() => {
            setState(prev => ({ ...prev, energy: prev.energy + energyPerSecond / 10 }));
        }, 100);
        return () => clearInterval(gameLoop);
    }, [energyPerSecond]);

    // --- Persistence ---
    const createLeanSaveState = (state) => ({
        energy: state.energy,
        stardust: state.stardust,
        generators: state.generators.map(g => ({ id: g.id, owned: g.owned })),
        upgrades: state.upgrades.map(u => ({ id: u.id, owned: u.owned })),
        lastActive: Date.now(),
    });

    const saveState = useCallback(() => {
        const leanState = createLeanSaveState(gameState);
        localStorage.setItem('cosmicForgeSave', JSON.stringify(leanState));
        console.log("Game Saved Locally (Lean)");
    }, [gameState]);

    const loadState = useCallback(() => {
        const savedGame = localStorage.getItem('cosmicForgeSave');
        if (savedGame) {
            const loaded = JSON.parse(savedGame);
            const initialState = getInitialState();

            const mergedState = {
                ...initialState,
                energy: loaded.energy || 0,
                stardust: loaded.stardust || 0,
                generators: initialState.generators.map(g => {
                    const savedGen = loaded.generators?.find(sg => sg.id === g.id);
                    if (!savedGen || savedGen.owned === 0) return g;
                    return { 
                        ...g, 
                        owned: savedGen.owned,
                        cost: Math.ceil(g.baseCost * Math.pow(1.15, savedGen.owned))
                    };
                }),
                upgrades: initialState.upgrades.map(u => {
                    const savedUpg = loaded.upgrades?.find(su => su.id === u.id);
                    if (!savedUpg || savedUpg.owned === 0) return u;
                    return { 
                        ...u, 
                        owned: savedUpg.owned,
                        cost: Math.ceil(u.baseCost * Math.pow(1.4, savedUpg.owned))
                    };
                }),
            };

            // Calculate Offline Gain
            const lastActive = loaded.lastActive || Date.now();
            const offlineTime = (Date.now() - lastActive) / 1000; // in seconds

            if (offlineTime > 0) {
                const loadedStardustMultiplier = (1.1 ** (mergedState.stardust || 0));
                
                const loadedGlobalMultiplier = (mergedState.upgrades || [])
                    .filter(u => u.type === 'global')
                    .reduce((acc, u) => acc * (u.baseMultiplier ** u.owned), 1);

                const offlineEPS = (mergedState.generators || []).reduce((total, gen) => {
                    const genUpgrade = (mergedState.upgrades || []).find(u => u.target === gen.id);
                    const genMultiplier = genUpgrade ? (genUpgrade.baseMultiplier ** genUpgrade.owned) : 1;
                    return total + gen.owned * gen.baseEnergy * genMultiplier;
                }, 0) * loadedGlobalMultiplier * loadedStardustMultiplier;

                const offlineGain = offlineEPS * offlineTime;
                mergedState.energy += offlineGain;
            }

            setState(mergedState);
            console.log("Game Loaded");
        }
    }, []);

    // Load state once on component mount
    useEffect(() => {
        loadState();
    }, [loadState]);

    // Set up autosave and save on exit
    useEffect(() => {
        const saveInterval = setInterval(saveState, 5000);
        window.addEventListener('beforeunload', saveState);

        return () => {
            clearInterval(saveInterval);
            window.removeEventListener('beforeunload', saveState);
        };
    }, [saveState]);


    // --- Actions ---
    const handleEnergyClick = () => setState(prev => ({ ...prev, energy: prev.energy + energyPerClick }));

    const buyItem = (id) => {
        const allItems = [...gameState.generators, ...gameState.upgrades];
        const item = allItems.find(i => i.id === id);
        if (!item || gameState.energy < item.cost) return;

        setGameState(prev => {
            const newEnergy = prev.energy - item.cost;
            if (item.type === 'generator') {
                return {
                    ...prev,
                    energy: newEnergy,
                    generators: prev.generators.map(g =>
                        g.id === id
                            ? { ...g, owned: g.owned + 1, cost: Math.ceil(g.baseCost * Math.pow(1.15, g.owned + 1)) }
                            : g
                    )
                };
            } else { // 'upgrade'
                return {
                    ...prev,
                    energy: newEnergy,
                    upgrades: prev.upgrades.map(u =>
                        u.id === id
                            ? { ...u, owned: u.owned + 1, cost: Math.ceil(u.baseCost * Math.pow(1.4, u.owned + 1)) }
                            : u
                    )
                };
            }
        });
    };

    const handleAscend = () => {
        if (canAscend) {
            setState(prev => ({
                ...getInitialState(),
                stardust: prev.stardust + stardustToGain,
            }));
        }
    };

    // --- Cloud Save/Load ---
    const handleCloudSave = async () => {
        setCloudLoading(true);
        setCloudError('');
        setCloudMessage('');
        try {
            const leanState = createLeanSaveState(gameState);
            const response = await fetch('/api/testgame/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, ...leanState }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to save.');
            setCloudMessage('Game saved successfully!');
        } catch (err) {
            setCloudError(err.message);
        } finally {
            setCloudLoading(false);
        }
    };

    const handleCloudLoad = async () => {
        setCloudLoading(true);
        setCloudError('');
        setCloudMessage('');
        try {
            const response = await fetch('/api/testgame/load', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to load.');
            
            const initialState = getInitialState();
            const mergedState = {
                ...initialState,
                ...data,
                generators: initialState.generators.map(g => {
                    const savedGen = data.generators?.find(sg => sg.id === g.id);
                    if (!savedGen || savedGen.owned === 0) return g;
                    return { 
                        ...g, 
                        owned: savedGen.owned,
                        cost: Math.ceil(g.baseCost * Math.pow(1.15, savedGen.owned))
                    };
                }),
                upgrades: initialState.upgrades.map(u => {
                    const savedUpg = data.upgrades?.find(su => su.id === u.id);
                    if (!savedUpg || savedUpg.owned === 0) return u;
                    return { 
                        ...u, 
                        owned: savedUpg.owned,
                        cost: Math.ceil(u.baseCost * Math.pow(1.4, savedUpg.owned))
                    };
                }),
            };

            setState(mergedState);
            setCloudMessage('Game loaded successfully!');
        } catch (err) {
            setCloudError(err.message);
        } finally {
            setCloudLoading(false);
        }
    };


    return (
        <div className="game-container">
            <h1 className="game-title">Cosmic Forge</h1>
            <ResourceDisplay energy={energy} energyPerSecond={energyPerSecond} stardust={stardust} />

            <div className="tab-navigation">
                <TabButton activeTab={activeTab} tabName="Generators" onClick={setActiveTab} />
                <TabButton activeTab={activeTab} tabName="Upgrades" onClick={setActiveTab} />
                <TabButton activeTab={activeTab} tabName="Ascension" onClick={setActiveTab} />
                <TabButton activeTab={activeTab} tabName="Cloud" onClick={setActiveTab} />
            </div>

            <div className="game-content">
                {activeTab === 'Generators' && (
                    <div className="item-list">
                        <div className="manual-clicker" onClick={handleEnergyClick}>
                            <h2>Forge Energy</h2>
                            <p>Click to generate {formatNumber(energyPerClick)} Energy.</p>
                        </div>
                        {generators.map(gen => (
                            <UpgradeButton key={gen.id} item={gen} onBuy={buyItem} canAfford={energy >= gen.cost} isMaxed={false} />
                        ))}
                    </div>
                )}

                {activeTab === 'Upgrades' && (
                    <div className="item-list">
                        {upgrades.map(upg => (
                            <UpgradeButton key={upg.id} item={upg} onBuy={buyItem} canAfford={energy >= upg.cost} isMaxed={false} />
                        ))}
                    </div>
                )}

                {activeTab === 'Ascension' && (
                    <AscensionButton
                        onAscend={handleAscend}
                        canAscend={canAscend}
                        stardustToGain={stardustToGain}
                    />
                )}

                {activeTab === 'Cloud' && (
                    <CloudStorage
                        email={email}
                        setEmail={setEmail}
                        onSave={handleCloudSave}
                        onLoad={handleCloudLoad}
                        loading={cloudLoading}
                        error={cloudError}
                        message={cloudMessage}
                    />
                )}
            </div>
        </div>
    );
}