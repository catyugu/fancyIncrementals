import React, { useState, useEffect } from 'react';
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

// --- Main Game Component ---
export default function TestGame() {
    // --- State ---
    const [energy, setEnergy] = useState(10);
    const [stardust, setStardust] = useState(0);
    const [activeTab, setActiveTab] = useState('Generators');

    const initialGenerators = [
        { id: 'h_cloud', name: 'Hydrogen Cloud', owned: 0, baseCost: 10, cost: 10, baseEnergy: 0.1, type: 'generator' },
        { id: 's_nursery', name: 'Stellar Nursery', owned: 0, baseCost: 120, cost: 120, baseEnergy: 1, type: 'generator' },
        { id: 'g_cluster', name: 'Galaxy Cluster', owned: 0, baseCost: 2000, cost: 2000, baseEnergy: 8, type: 'generator' },
    ];

    const initialUpgrades = [
        { id: 'energy_boost_1', name: 'Cosmic Rays', owned: 0, cost: 500, description: 'Doubles Energy generation.', multiplier: 2, type: 'global', isMaxed: false },
        { id: 'h_cloud_boost_1', name: 'Focused Solar Winds', owned: 0, cost: 1000, description: 'Hydrogen Clouds generate 3x more Energy.', multiplier: 3, target: 'h_cloud', type: 'upgrade', isMaxed: false },
    ];

    const [generators, setGenerators] = useState(initialGenerators);
    const [upgrades, setUpgrades] = useState(initialUpgrades);

    // --- Calculations ---
    const stardustMultiplier = 1 + stardust * 0.1;

    const totalUpgradeMultiplier = upgrades
        .filter(u => u.owned > 0 && u.type === 'global')
        .reduce((acc, u) => acc * u.multiplier, 1);

    const energyPerSecond = generators.reduce((total, gen) => {
        const genUpgrade = upgrades.find(u => u.target === gen.id && u.owned > 0);
        const genMultiplier = genUpgrade ? genUpgrade.multiplier : 1;
        return total + gen.owned * gen.baseEnergy * genMultiplier;
    }, 0) * totalUpgradeMultiplier * stardustMultiplier;

    const energyPerClick = 1 * totalUpgradeMultiplier * stardustMultiplier;

    const stardustToGain = Math.floor(Math.cbrt(energy / 1e6));
    const canAscend = energy >= 1e6;

    // --- Game Loop ---
    useEffect(() => {
        const gameLoop = setInterval(() => {
            setEnergy(prev => prev + energyPerSecond / 10);
        }, 100);
        return () => clearInterval(gameLoop);
    }, [energyPerSecond]);

    // --- Persistence ---
    useEffect(() => {
        const saveInterval = setInterval(() => {
            const gameState = {
                energy,
                stardust,
                generators,
                upgrades,
                lastActive: Date.now(),
            };
            localStorage.setItem('cosmicForgeSave', JSON.stringify(gameState));
        }, 5000); // Save every 5 seconds
    }, [energy, stardust, generators, upgrades]);

    useEffect(() => {
        const savedGame = localStorage.getItem('cosmicForgeSave');
        if (savedGame) {
            const loadedState = JSON.parse(savedGame);
            
            // Safely load state, merging with initial state to prevent errors
            setEnergy(loadedState.energy || 0);
            setStardust(loadedState.stardust || 0);
            setGenerators(initialGenerators.map(gen => {
                const savedGen = loadedState.generators?.find(g => g.id === gen.id);
                return savedGen ? { ...gen, ...savedGen } : gen;
            }));
            setUpgrades(initialUpgrades.map(upg => {
                const savedUpg = loadedState.upgrades?.find(u => u.id === upg.id);
                return savedUpg ? { ...upg, ...savedUpg } : upg;
            }));

            // Calculate Offline Gain
            const lastActive = loadedState.lastActive || Date.now();
            const offlineTime = (Date.now() - lastActive) / 1000; // in seconds

            if (offlineTime > 0) {
                const loadedStardustMultiplier = 1 + (loadedState.stardust || 0) * 0.1;
                const loadedUpgradeMultiplier = (loadedState.upgrades || [])
                    .filter(u => u.owned > 0 && u.type === 'global')
                    .reduce((acc, u) => acc * u.multiplier, 1);
                
                const offlineEPS = (loadedState.generators || []).reduce((total, gen) => {
                    const genUpgrade = (loadedState.upgrades || []).find(u => u.target === gen.id && u.owned > 0);
                    const genMultiplier = genUpgrade ? genUpgrade.multiplier : 1;
                    return total + gen.owned * gen.baseEnergy * genMultiplier;
                }, 0) * loadedUpgradeMultiplier * loadedStardustMultiplier;

                const offlineGain = offlineEPS * offlineTime;
                setEnergy(prev => prev + offlineGain);
            }
        }
    }, []);


    // --- Actions ---
    const handleEnergyClick = () => setEnergy(prev => prev + energyPerClick);

    const buyItem = (id) => {
        const allItems = [...generators, ...upgrades];
        const item = allItems.find(i => i.id === id);
        if (energy < item.cost) return;

        setEnergy(prev => prev - item.cost);

        if (item.type === 'generator') {
            setGenerators(gens => gens.map(g =>
                g.id === id
                    ? { ...g, owned: g.owned + 1, cost: Math.ceil(g.baseCost * Math.pow(1.15, g.owned + 1)) }
                    : g
            ));
        } else {
            setUpgrades(ups => ups.map(u =>
                u.id === id ? { ...u, owned: 1, isMaxed: true } : u
            ));
        }
    };

    const handleAscend = () => {
        if (canAscend) {
            setStardust(prev => prev + stardustToGain);
            setEnergy(10);
            setGenerators(initialGenerators);
            setUpgrades(initialUpgrades);
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
                            <UpgradeButton key={upg.id} item={upg} onBuy={buyItem} canAfford={energy >= upg.cost} isMaxed={upg.isMaxed} />
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
            </div>
        </div>
    );
}
