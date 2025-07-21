import React, { useState, useEffect, useCallback } from 'react';
import './TestGame.css';
import Decimal from 'break_infinity.js';

// --- Helper Functions ---
const formatNumber = (num) => {
    if (!(num instanceof Decimal)) {
        num = new Decimal(num);
    }
    if (num.lt(1000)) return num.toFixed(2);
    return num.toExponential(2);
};

// --- Game Components ---

const BuyAmountController = ({ buyAmount, setBuyAmount }) => {
    const amounts = [1, 10, 100, 'max'];
    return (
        <div className="buy-amount-controller">
            <span className="buy-amount-label">Buy Amount:</span>
            <div className="buy-amount-buttons">
                {amounts.map(amt => (
                    <button
                        key={amt}
                        className={`buy-amount-button ${buyAmount === amt ? 'active' : ''}`}
                        onClick={() => setBuyAmount(amt)}
                    >
                        {typeof amt === 'string' ? amt.charAt(0).toUpperCase() + amt.slice(1) : amt}
                    </button>
                ))}
                <input
                    type="number"
                    min="1"
                    value={typeof buyAmount === 'number' ? buyAmount : ''}
                    onChange={(e) => {
                        const val = e.target.value;
                        const num = parseInt(val, 10);
                        if (num > 0) {
                            setBuyAmount(num);
                        } else if (val === '') {
                            setBuyAmount(1);
                        }
                    }}
                    placeholder="Custom"
                    className="buy-custom-input"
                />
            </div>
        </div>
    );
};

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

const UpgradeButton = ({ item, onBuy, canAfford, isMaxed, currency }) => (
    <div className={`upgrade-item ${!isMaxed && canAfford ? 'affordable' : ''} ${isMaxed ? 'maxed' : ''} ${!canAfford && !isMaxed ? 'unaffordable' : ''}`}>
        <div className="upgrade-info">
            <span className="upgrade-name">{item.name}</span>
            <span className="upgrade-effect">{item.description}</span>
        </div>
        <div className="upgrade-cost">
            <span>Cost:</span>
            <span>{formatNumber(item.cost)} {currency}</span>
        </div>
        <div className="upgrade-owned">
            <span>{item.type === 'generator' ? 'Owned:' : 'Level:'}</span>
            <span>{formatNumber(item.owned)}</span>
        </div>
        <button onClick={() => onBuy(item.id)} disabled={!canAfford || isMaxed} className="buy-button">
            Buy
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
const initialGenerators = [
    { id: 'h_cloud', name: 'Hydrogen Cloud', owned: new Decimal(0), baseCost: new Decimal(10), cost: new Decimal(10), baseEnergy: new Decimal(0.1), type: 'generator' },
    { id: 's_nursery', name: 'Stellar Nursery', owned: new Decimal(0), baseCost: new Decimal(150), cost: new Decimal(150), baseEnergy: new Decimal(1), type: 'generator' },
    { id: 'g_cluster', name: 'Galaxy Cluster', owned: new Decimal(0), baseCost: new Decimal(2500), cost: new Decimal(2500), baseEnergy: new Decimal(8), type: 'generator' },
    { id: 'neutron_star', name: 'Neutron Star', owned: new Decimal(0), baseCost: new Decimal(40000), cost: new Decimal(40000), baseEnergy: new Decimal(50), type: 'generator' },
    { id: 'black_hole', name: 'Black Hole', owned: new Decimal(0), baseCost: new Decimal(750000), cost: new Decimal(750000), baseEnergy: new Decimal(250), type: 'generator' },
];

const initialUpgrades = [
    { id: 'energy_boost_1', name: 'Cosmic Rays', owned: new Decimal(0), baseCost: new Decimal(500), cost: new Decimal(500), description: 'Multiplies Energy generation by 1.2x per level.', baseMultiplier: 1.2, type: 'global' },
    { id: 'h_cloud_boost_1', name: 'Focused Solar Winds', owned: new Decimal(0), baseCost: new Decimal(1000), cost: new Decimal(1000), description: 'Doubles Hydrogen Cloud output per level.', baseMultiplier: 2, target: 'h_cloud', type: 'upgrade' },
    { id: 's_nursery_boost_1', name: 'Gravitational Collapse', owned: new Decimal(0), baseCost: new Decimal(8000), cost: new Decimal(8000), description: 'Doubles Stellar Nursery output per level.', baseMultiplier: 2, target: 's_nursery', type: 'upgrade' },
    { id: 'g_cluster_boost_1', name: 'Galactic Filaments', owned: new Decimal(0), baseCost: new Decimal(50000), cost: new Decimal(50000), description: 'Multiplies Galaxy Cluster output by 1.5x per level.', baseMultiplier: 1.5, target: 'g_cluster', type: 'upgrade' },
    { id: 'energy_boost_2', name: 'Zero-Point Energy', owned: new Decimal(0), baseCost: new Decimal(200000), cost: new Decimal(200000), description: 'Multiplies Energy generation by 1.2x per level.', baseMultiplier: 1.2, type: 'global' },
];

const initialStardustUpgrades = [
    { id: 'stardust_boost_1', name: 'Stardust Amplifier', owned: new Decimal(0), baseCost: new Decimal(1), cost: new Decimal(1), description: 'Stardust is 10% more effective.', baseMultiplier: 1.1, type: 'stardust' },
    { id: 'energy_from_stardust_1', name: 'Stardust Infusion', owned: new Decimal(0), baseCost: new Decimal(5), cost: new Decimal(5), description: 'Gain a multiplier to energy based on stardust.', baseMultiplier: 1.5, type: 'stardust' },
    { id: 'generator_cost_reduction_1', name: 'Cosmic Discount', owned: new Decimal(0), baseCost: new Decimal(20), cost: new Decimal(20), description: 'Reduces the cost scaling of generators.', baseMultiplier: 0.99, type: 'stardust' },
];

const getInitialState = () => ({
    energy: new Decimal(10),
    stardust: new Decimal(0),
    generators: initialGenerators.map(g => ({ ...g, owned: new Decimal(g.owned), cost: new Decimal(g.cost) })),
    upgrades: initialUpgrades.map(u => ({ ...u, owned: new Decimal(u.owned), cost: new Decimal(u.cost) })),
    stardustUpgrades: initialStardustUpgrades.map(u => ({ ...u, owned: new Decimal(u.owned), cost: new Decimal(u.cost) })),
});

export default function TestGame() {
    const [email, setEmail] = useState('');
    const [cloudLoading, setCloudLoading] = useState(false);
    const [cloudError, setCloudError] = useState('');
    const [cloudMessage, setCloudMessage] = useState('');
    const [buyAmount, setBuyAmount] = useState(1);

    const [gameState, setGameState] = useState(getInitialState());
    const { energy, stardust, generators, upgrades, stardustUpgrades } = gameState;
    const [activeTab, setActiveTab] = useState('Generators');

    const setState = (merger) => {
        setGameState(prev => {
            if (typeof merger === 'function') {
                return merger(prev);
            }
            return { ...prev, ...merger };
        });
    };

    const stardustBoost1 = stardustUpgrades.find(u => u.id === 'stardust_boost_1');
    const stardustMultiplier = Decimal.pow(1.1, stardust).times(stardustBoost1 ? Decimal.pow(stardustBoost1.baseMultiplier, stardustBoost1.owned) : 1);

    const energyFromStardust1 = stardustUpgrades.find(u => u.id === 'energy_from_stardust_1');
    const energyFromStardustMultiplier = energyFromStardust1 ? Decimal.pow(energyFromStardust1.baseMultiplier, energyFromStardust1.owned) : 1;

    const totalUpgradeMultiplier = upgrades
        .filter(u => u.type === 'global')
        .reduce((acc, u) => acc.times(Decimal.pow(u.baseMultiplier, u.owned)), new Decimal(1));

    const energyPerSecond = generators.reduce((total, gen) => {
        const genUpgrade = upgrades.find(u => u.target === gen.id);
        const genMultiplier = genUpgrade ? Decimal.pow(genUpgrade.baseMultiplier, genUpgrade.owned) : new Decimal(1);
        return total.plus(gen.owned.times(gen.baseEnergy).times(genMultiplier));
    }, new Decimal(0)).times(totalUpgradeMultiplier).times(stardustMultiplier).times(energyFromStardustMultiplier);

    const energyPerClick = new Decimal(1).times(totalUpgradeMultiplier).times(stardustMultiplier).times(energyFromStardustMultiplier);

    const stardustToGain = Decimal.floor(Decimal.pow(energy.div(1e6), 0.4));
    const canAscend = energy.gte(1e6);

    const lastUpdateTime = React.useRef(Date.now());

    useEffect(() => {
        let animationFrameId;

        const gameLoop = () => {
            const now = Date.now();
            const deltaTime = (now - lastUpdateTime.current) / 1000;
            lastUpdateTime.current = now;

            if (deltaTime > 0) {
                setState(prev => ({
                    ...prev,
                    energy: prev.energy.plus(energyPerSecond.times(deltaTime))
                }));
            }

            animationFrameId = requestAnimationFrame(gameLoop);
        };

        animationFrameId = requestAnimationFrame(gameLoop);

        return () => cancelAnimationFrame(animationFrameId);
    }, [energyPerSecond]);

    const createLeanSaveState = (state) => ({
        energy: state.energy.toJSON(),
        stardust: state.stardust.toJSON(),
        generators: state.generators.map(g => ({ id: g.id, owned: g.owned.toJSON() })),
        upgrades: state.upgrades.map(u => ({ id: u.id, owned: u.owned.toJSON() })),
        stardustUpgrades: state.stardustUpgrades.map(u => ({ id: u.id, owned: u.owned.toJSON() })),
        lastActive: Date.now(),
    });

    const saveState = useCallback(() => {
        const leanState = createLeanSaveState(gameState);
        localStorage.setItem('cosmicForgeSave', JSON.stringify(leanState));
    }, [gameState]);

    const loadState = useCallback(() => {
        const savedGame = localStorage.getItem('cosmicForgeSave');
        if (savedGame) {
            const loaded = JSON.parse(savedGame);
            const initialState = getInitialState();

            const mergedState = {
                ...initialState,
                energy: loaded.energy ? new Decimal(loaded.energy) : new Decimal(0),
                stardust: loaded.stardust ? new Decimal(loaded.stardust) : new Decimal(0),
                generators: initialState.generators.map(g => {
                    const savedGen = loaded.generators?.find(sg => sg.id === g.id);
                    if (!savedGen) return g;
                    const owned = new Decimal(savedGen.owned);
                    return {
                        ...g,
                        owned: owned,
                        cost: g.baseCost.times(Decimal.pow(1.15, owned))
                    };
                }),
                upgrades: initialState.upgrades.map(u => {
                    const savedUpg = loaded.upgrades?.find(su => su.id === u.id);
                    if (!savedUpg) return u;
                    const owned = new Decimal(savedUpg.owned);
                    return {
                        ...u,
                        owned: owned,
                        cost: u.baseCost.times(Decimal.pow(1.4, owned))
                    };
                }),
                stardustUpgrades: initialState.stardustUpgrades.map(u => {
                    const savedUpg = loaded.stardustUpgrades?.find(su => su.id === u.id);
                    if (!savedUpg) return u;
                    const owned = new Decimal(savedUpg.owned);
                    return {
                        ...u,
                        owned: owned,
                        cost: u.baseCost.times(Decimal.pow(2, owned))
                    };
                }),
            };

            const lastActive = loaded.lastActive || Date.now();
            const offlineTime = (Date.now() - lastActive) / 1000;

            if (offlineTime > 0) {
                const loadedStardustMultiplier = Decimal.pow(1.1, mergedState.stardust);
                const loadedGlobalMultiplier = mergedState.upgrades
                    .filter(u => u.type === 'global')
                    .reduce((acc, u) => acc.times(Decimal.pow(u.baseMultiplier, u.owned)), new Decimal(1));

                const offlineEPS = mergedState.generators.reduce((total, gen) => {
                    const genUpgrade = mergedState.upgrades.find(u => u.target === gen.id);
                    const genMultiplier = genUpgrade ? Decimal.pow(genUpgrade.baseMultiplier, genUpgrade.owned) : new Decimal(1);
                    return total.plus(gen.owned.times(gen.baseEnergy).times(genMultiplier));
                }, new Decimal(0)).times(loadedGlobalMultiplier).times(loadedStardustMultiplier);

                const offlineGain = offlineEPS.times(offlineTime);
                mergedState.energy = mergedState.energy.plus(offlineGain);
            }

            setState(mergedState);
        }
    }, []);

    useEffect(() => {
        loadState();
    }, [loadState]);

    useEffect(() => {
        const saveInterval = setInterval(saveState, 5000);
        window.addEventListener('beforeunload', saveState);

        return () => {
            clearInterval(saveInterval);
            window.removeEventListener('beforeunload', saveState);
        };
    }, [saveState]);

    const handleEnergyClick = () => setState(prev => ({ ...prev, energy: prev.energy.plus(energyPerClick) }));

    const getCostScaling = (item) => {
        if (item.type === 'generator') {
            const costReduction = stardustUpgrades.find(u => u.id === 'generator_cost_reduction_1');
            const reductionFactor = costReduction ? Decimal.pow(costReduction.baseMultiplier, costReduction.owned) : 1;
            return new Decimal(1.15).times(reductionFactor);
        }
        if (item.type === 'stardust') {
            return new Decimal(2);
        }
        return new Decimal(1.4);
    };

    const calculateCost = (item, amount) => {
        const costScaling = getCostScaling(item);
        return item.baseCost.times(
            Decimal.pow(costScaling, item.owned)
                .times(Decimal.pow(costScaling, amount).minus(1))
                .div(costScaling.minus(1))
        );
    };

    const buyItem = (id, rawAmount, currency) => {
        const allItems = [...generators, ...upgrades, ...stardustUpgrades];
        const item = allItems.find(i => i.id === id);
        if (!item) return;

        let amount;
        if (rawAmount === 'max') {
            const costScaling = getCostScaling(item);
            const currentCurrency = currency === 'Stardust' ? stardust : energy;
            
            let maxAmount = currentCurrency.div(item.cost).times(costScaling.minus(1)).plus(1).log(costScaling);
            amount = Decimal.floor(maxAmount);
        } else {
            amount = new Decimal(rawAmount);
        }

        if (!amount || amount.lte(0)) return;

        const totalCost = calculateCost(item, amount);
        const currentCurrency = currency === 'Stardust' ? gameState.stardust : gameState.energy;
        if (currentCurrency.lt(totalCost)) return;

        setGameState(prev => {
            const newCurrencyValue = (currency === 'Stardust' ? prev.stardust : prev.energy).minus(totalCost);
            
            const updateItem = (i) => {
                if (i.id === id) {
                    const newOwned = i.owned.plus(amount);
                    const costScaling = getCostScaling(i);
                    return { ...i, owned: newOwned, cost: i.baseCost.times(Decimal.pow(costScaling, newOwned)) };
                }
                return i;
            };

            const newState = { ...prev };
            if (currency === 'Stardust') {
                newState.stardust = newCurrencyValue;
                newState.stardustUpgrades = prev.stardustUpgrades.map(updateItem);
            } else {
                newState.energy = newCurrencyValue;
                if (item.type === 'generator') {
                    newState.generators = prev.generators.map(updateItem);
                } else {
                    newState.upgrades = prev.upgrades.map(updateItem);
                }
            }
            return newState;
        });
    };

    const canAfford = (id, rawAmount, currency) => {
        const allItems = [...generators, ...upgrades, ...stardustUpgrades];
        const item = allItems.find(i => i.id === id);
        if (!item) return false;

        let amount;
        if (rawAmount === 'max') {
            amount = new Decimal(1);
        } else {
            amount = new Decimal(rawAmount);
        }

        if (!amount|| amount.lte(0)) return false;

        const totalCost = calculateCost(item, amount);
        const currentCurrency = currency === 'Stardust' ? gameState.stardust : gameState.energy;
        return currentCurrency.gte(totalCost);
    };

    const handleAscend = () => {
        if (canAscend) {
            const stateToKeep = {
                stardust: gameState.stardust.plus(stardustToGain),
                stardustUpgrades: gameState.stardustUpgrades,
            };
            setState({
                ...getInitialState(),
                ...stateToKeep,
            });
        }
    };

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
                energy: data.energy ? new Decimal(data.energy) : new Decimal(0),
                stardust: data.stardust ? new Decimal(data.stardust) : new Decimal(0),
                generators: initialState.generators.map(g => {
                    const savedGen = data.generators?.find(sg => sg.id === g.id);
                    if (!savedGen) return g;
                    const owned = new Decimal(savedGen.owned);
                    return {
                        ...g,
                        owned: owned,
                        cost: g.baseCost.times(Decimal.pow(1.15, owned))
                    };
                }),
                upgrades: initialState.upgrades.map(u => {
                    const savedUpg = data.upgrades?.find(su => su.id === u.id);
                    if (!savedUpg) return u;
                    const owned = new Decimal(savedUpg.owned);
                    return {
                        ...u,
                        owned: owned,
                        cost: u.baseCost.times(Decimal.pow(1.4, owned))
                    };
                }),
                stardustUpgrades: initialState.stardustUpgrades.map(u => {
                    const savedUpg = data.stardustUpgrades?.find(su => su.id === u.id);
                    if (!savedUpg) return u;
                    const owned = new Decimal(savedUpg.owned);
                    return {
                        ...u,
                        owned: owned,
                        cost: u.baseCost.times(Decimal.pow(2, owned))
                    };
                }),
            };

            setState(mergedState);
            setCloudMessage('Game loaded successfully!');
        } catch (err){
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
                <TabButton activeTab={activeTab} tabName="Stardust" onClick={setActiveTab} />
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
                        <BuyAmountController buyAmount={buyAmount} setBuyAmount={setBuyAmount} />
                        {generators.map(gen => (
                            <UpgradeButton
                                key={gen.id}
                                item={gen}
                                onBuy={() => buyItem(gen.id, buyAmount, 'Energy')}
                                canAfford={canAfford(gen.id, buyAmount, 'Energy')}
                                isMaxed={false}
                                currency="Energy"
                            />
                        ))}
                    </div>
                )}

                {activeTab === 'Upgrades' && (
                    <div className="item-list">
                        <BuyAmountController buyAmount={buyAmount} setBuyAmount={setBuyAmount} />
                        {upgrades.map(upg => (
                            <UpgradeButton
                                key={upg.id}
                                item={upg}
                                onBuy={() => buyItem(upg.id, buyAmount, 'Energy')}
                                canAfford={canAfford(upg.id, buyAmount, 'Energy')}
                                isMaxed={false}
                                currency="Energy"
                            />
                        ))}
                    </div>
                )}

                {activeTab === 'Stardust' && (
                    <div className="item-list">
                        <BuyAmountController buyAmount={buyAmount} setBuyAmount={setBuyAmount} />
                        {stardustUpgrades.map(upg => (
                            <UpgradeButton
                                key={upg.id}
                                item={upg}
                                onBuy={() => buyItem(upg.id, buyAmount, 'Stardust')}
                                canAfford={canAfford(upg.id, buyAmount, 'Stardust')}
                                isMaxed={false}
                                currency="Stardust"
                            />
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
