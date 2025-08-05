import React, { useState, useEffect, useCallback } from 'react';
import './TestGame.css';
import Decimal from 'break_infinity.js';
import { 
    GAME_CONFIG, 
    GENERATORS_CONFIG, 
    UPGRADES_CONFIG, 
    STARDUST_UPGRADES_CONFIG
} from './gameConfig.js';

// --- Helper Functions ---
const formatNumber = (num) => {
    if (!(num instanceof Decimal)) {
        num = new Decimal(num);
    }
    
    // 避免使用isNaN和isFinite方法，改用更安全的方式检查
    const numStr = num.toString();
    if (numStr === "NaN" || numStr === "Infinity") {
        return "超出范围";
    }
    
    // 小数值简单显示
    if (num.lt(1000)) return num.toFixed(2);
    
    // 非常大的数使用科学计数法
    if (num.gte(new Decimal('1e21'))) {
        // 获取指数部分并分段显示
        const exp = num.e;
        if (exp >= 308) { // 接近JS Number类型的极限
            // 使用自定义格式避免JS Number溢出
            const mantissa = num.mantissa.toFixed(2);
            return `${mantissa}e${exp}`;
        }
    }
    
    // 一般大数使用标准科学计数法
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



const PrestigePanel = ({ prestige, onPrestige, nextPrestigeGain, canPrestige }) => (
    <div className="prestige-section">
        <h3>Prestige System</h3>
        <div className="prestige-stats">
            <div className="prestige-stat">
                <span className="prestige-label">Prestige Level:</span>
                <span className="prestige-value">{formatNumber(prestige.level)}</span>
            </div>
            <div className="prestige-stat">
                <span className="prestige-label">Prestige Points:</span>
                <span className="prestige-value">{formatNumber(prestige.points)}</span>
            </div>
            <div className="prestige-stat">
                <span className="prestige-label">Prestige Multiplier:</span>
                <span className="prestige-value">x{formatNumber(prestige.multiplier)}</span>
            </div>
        </div>
        <div className="prestige-next">
            <p>Next Prestige will give you: <span className="text-accent">{formatNumber(nextPrestigeGain)}</span> Prestige Points</p>
            <p>Requirement: {formatNumber(new Decimal(10).pow(prestige.level.plus(1).times(10)))} Stardust</p>
            <button 
                className="prestige-button" 
                onClick={onPrestige} 
                disabled={!canPrestige}
            >
                Prestige Reset
            </button>
        </div>
    </div>
);



const ResourceDisplay = ({ energy, energyPerSecond, stardust, quantumEnergy, darkMatter, prestigePoints }) => (
    <div className="resource-display-panel">
        <div className="resource-row">
            <div className="resource">
                <span className="resource-label">Energy</span>
                <span className="resource-value">{formatNumber(energy)}</span>
                <span className="resource-rate">+{formatNumber(energyPerSecond)}/s</span>
            </div>
            <div className="resource">
                <span className="resource-label">Stardust</span>
                <span className="resource-value">{formatNumber(stardust)}</span>
            </div>
        </div>
        {quantumEnergy.gt(0) && (
            <div className="resource-row">
                <div className="resource">
                    <span className="resource-label">Quantum Energy</span>
                    <span className="resource-value">{formatNumber(quantumEnergy)}</span>
                </div>
                {darkMatter.gt(0) && (
                    <div className="resource">
                        <span className="resource-label">Dark Matter</span>
                        <span className="resource-value">{formatNumber(darkMatter)}</span>
                    </div>
                )}
            </div>
        )}
        {prestigePoints.gt(0) && (
            <div className="resource-row">
                <div className="resource">
                    <span className="resource-label">Prestige Points</span>
                    <span className="resource-value">{formatNumber(prestigePoints)}</span>
                </div>
            </div>
        )}
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
const getInitialState = () => ({
    energy: GAME_CONFIG.STARTING_ENERGY,
    stardust: GAME_CONFIG.STARTING_STARDUST,
    quantumEnergy: GAME_CONFIG.STARTING_QUANTUM_ENERGY,
    darkMatter: GAME_CONFIG.STARTING_DARK_MATTER,
    currentEnergyPerSecond: new Decimal(0), // 添加当前每秒能量计数器
    generators: GENERATORS_CONFIG.map(g => ({ 
        ...g, 
        owned: new Decimal(0), 
        cost: new Decimal(g.baseCost),
        type: 'generator' 
    })),
    upgrades: UPGRADES_CONFIG.map(u => ({ 
        ...u, 
        owned: new Decimal(0), 
        cost: new Decimal(u.baseCost) 
    })),
    stardustUpgrades: STARDUST_UPGRADES_CONFIG.map(u => ({ 
        ...u, 
        owned: new Decimal(0), 
        cost: new Decimal(u.baseCost) 
    })),
    prestige: {
        level: new Decimal(0),
        points: new Decimal(0),
        multiplier: new Decimal(1),
    },
    statistics: {
        totalEnergyGenerated: new Decimal(0),
        totalAscensions: new Decimal(0),
        totalTimePlayedSeconds: 0,
        startTime: Date.now(),
        maxEnergyReached: GAME_CONFIG.STARTING_ENERGY,
        maxStardustReached: GAME_CONFIG.STARTING_STARDUST,
    },
});

export default function TestGame() {
    const [email, setEmail] = useState('');
    const [cloudLoading, setCloudLoading] = useState(false);
    const [cloudError, setCloudError] = useState('');
    const [cloudMessage, setCloudMessage] = useState('');
    const [buyAmount, setBuyAmount] = useState(1);

    const [gameState, setGameState] = useState(getInitialState());
    const { energy, stardust, quantumEnergy, darkMatter, generators, upgrades, stardustUpgrades, prestige, statistics } = gameState;
    const [activeTab, setActiveTab] = useState('Generators');



    const setState = (merger) => {
        setGameState(prev => {
            if (typeof merger === 'function') {
                return merger(prev);
            }
            return { ...prev, ...merger };
        });
    };

    // Enhanced calculation functions
    const getStardustMultiplier = () => {
        const stardustBoost1 = stardustUpgrades.find(u => u.id === 'stardust_boost_1');
        
        // 使用对数方法计算大数的幂，避免溢出
        let baseStardustEffect;
        if (stardust.gt(1e50)) {
            // 对于非常大的星尘值，使用对数计算
            const logBase = Math.log(GAME_CONFIG.STARDUST_EFFECT_BASE);
            const logResult = stardust.times(logBase);
            // 限制最大值，防止溢出
            const cappedLog = Decimal.min(logResult, 700); // 限制最大指数约为e700
            baseStardustEffect = Decimal.exp(cappedLog);
        } else {
            // 对于较小的值，使用正常计算
            baseStardustEffect = Decimal.pow(GAME_CONFIG.STARDUST_EFFECT_BASE, stardust);
        }
        
        const amplifierEffect = stardustBoost1 ? Decimal.pow(stardustBoost1.baseMultiplier, stardustBoost1.owned) : new Decimal(1);
        
        // 安全检查结果
        const result = baseStardustEffect.times(amplifierEffect).times(prestige.multiplier);
        
        // 确保结果是一个有效的数值
        if (result.toString() === "NaN" || result.toString() === "Infinity") {
            return new Decimal(1e300); // 返回一个非常大但安全的数值
        }
        
        return result;
    };

    const getEnergyFromStardustMultiplier = () => {
        const energyFromStardust1 = stardustUpgrades.find(u => u.id === 'energy_from_stardust_1');
        if (!energyFromStardust1 || energyFromStardust1.owned.eq(0)) return new Decimal(1);
        
        // 对于非常大的星尘值，使用对数计算，并设置上限
        const logValue = stardust.plus(1).log10().plus(1);
        
        // 限制底数，防止结果过大
        const cappedLogValue = Decimal.min(logValue, new Decimal(500));
        
        const result = Decimal.pow(cappedLogValue, energyFromStardust1.owned.times(0.5));
        
        // 确保结果是有效的
        if (result.toString() === "NaN" || result.toString() === "Infinity") {
            return new Decimal(1e150); // 返回一个大但安全的数值
        }
        
        return result;
    };

    const getTotalUpgradeMultiplier = () => {
        return upgrades
            .filter(u => u.type === 'global')
            .reduce((acc, u) => acc.times(Decimal.pow(u.baseMultiplier, u.owned)), new Decimal(1));
    };

    const getSynergyMultiplier = () => {
        const synergyUpgrade = upgrades.find(u => u.type === 'synergy');
        if (!synergyUpgrade || synergyUpgrade.owned.eq(0)) return new Decimal(1);
        
        let synergyMultiplier = new Decimal(1);
        generators.forEach((gen, index) => {
            if (index > 0) {
                const previousGenCount = generators[index - 1].owned;
                synergyMultiplier = synergyMultiplier.times(
                    Decimal.pow(synergyUpgrade.baseMultiplier, previousGenCount.times(synergyUpgrade.owned))
                );
            }
        });
        return synergyMultiplier;
    };

    const getEfficiencyMultiplier = () => {
        const efficiencyUpgrade = upgrades.find(u => u.type === 'efficiency');
        return efficiencyUpgrade ? Decimal.pow(efficiencyUpgrade.baseMultiplier, efficiencyUpgrade.owned) : new Decimal(1);
    };

    const stardustMultiplier = getStardustMultiplier();
    const energyFromStardustMultiplier = getEnergyFromStardustMultiplier();
    const totalUpgradeMultiplier = getTotalUpgradeMultiplier();
    const synergyMultiplier = getSynergyMultiplier();
    const efficiencyMultiplier = getEfficiencyMultiplier();

    const energyPerSecond = generators.reduce((total, gen) => {
        const genUpgrade = upgrades.find(u => u.target === gen.id);
        const genMultiplier = genUpgrade ? Decimal.pow(genUpgrade.baseMultiplier, genUpgrade.owned) : new Decimal(1);
        return total.plus(gen.owned.times(gen.baseEnergy).times(genMultiplier));
    }, new Decimal(0))
        .times(totalUpgradeMultiplier)
        .times(stardustMultiplier)
        .times(energyFromStardustMultiplier)
        .times(synergyMultiplier)
        .times(efficiencyMultiplier);

    const energyPerClick = new Decimal(1)
        .times(totalUpgradeMultiplier)
        .times(stardustMultiplier)
        .times(energyFromStardustMultiplier);

    const stardustToGain = Decimal.floor(Decimal.pow(energy.div(GAME_CONFIG.ASCENSION_REQUIREMENT), GAME_CONFIG.ASCENSION_EXPONENT));
    const canAscend = energy.gte(GAME_CONFIG.ASCENSION_REQUIREMENT);

    // Prestige calculations
    const prestigeRequirement = GAME_CONFIG.PRESTIGE_BASE_REQUIREMENT.pow(prestige.level.plus(1).times(GAME_CONFIG.PRESTIGE_REQUIREMENT_SCALING));
    const canPrestige = stardust.gte(prestigeRequirement);
    const nextPrestigeGain = prestige.level.plus(1).times(GAME_CONFIG.PRESTIGE_POINTS_PER_LEVEL);

    const lastUpdateTime = React.useRef(Date.now());

    useEffect(() => {
        let animationFrameId;
        let lastUpdateTimestamp = Date.now();
        let frameCount = 0;
        let lastCalculatedEPS = energyPerSecond; // 保存最后一次计算的能量每秒值

        // 每帧更新游戏状态
        const gameLoop = () => {
            const now = Date.now();
            const deltaTime = (now - lastUpdateTime.current) / 1000;
            lastUpdateTime.current = now;
            frameCount++;

            if (deltaTime > 0) {
                setGameState(prev => {
                    // 在游戏循环中使用与主组件相同的计算逻辑
                    const stardustBoost1 = prev.stardustUpgrades.find(u => u.id === 'stardust_boost_1');
                    
                    // 使用安全的计算方法处理大数值
                    let baseStardustEffect;
                    if (prev.stardust.gt(1e50)) {
                        // 对于非常大的星尘值，使用对数计算
                        const logBase = Math.log(GAME_CONFIG.STARDUST_EFFECT_BASE);
                        const logResult = prev.stardust.times(logBase);
                        // 限制最大值，防止溢出
                        const cappedLog = Decimal.min(logResult, 700);
                        baseStardustEffect = Decimal.exp(cappedLog);
                    } else {
                        // 对于较小的值，使用正常计算
                        baseStardustEffect = Decimal.pow(GAME_CONFIG.STARDUST_EFFECT_BASE, prev.stardust);
                    }
                    
                    const amplifierEffect = stardustBoost1 ? Decimal.pow(stardustBoost1.baseMultiplier, stardustBoost1.owned) : new Decimal(1);
                    
                    // 安全检查结果
                    let currentStardustMultiplier = baseStardustEffect.times(amplifierEffect).times(prev.prestige.multiplier);
                    
                    // 确保结果是一个有效的数值
                    if (currentStardustMultiplier.toString() === "NaN" || currentStardustMultiplier.toString() === "Infinity") {
                        currentStardustMultiplier = new Decimal(1e300); // 返回一个非常大但安全的数值
                    }

                    const currentTotalUpgradeMultiplier = prev.upgrades
                        .filter(u => u.type === 'global')
                        .reduce((acc, u) => acc.times(Decimal.pow(u.baseMultiplier, u.owned)), new Decimal(1));

                    const stardustEnergyUpgrade = prev.stardustUpgrades.find(u => u.id === 'energy_from_stardust_1');
                    let currentEnergyFromStardustMultiplier;
                    
                    if (stardustEnergyUpgrade && stardustEnergyUpgrade.owned.gt(0)) {
                        // 对于非常大的星尘值，使用对数计算，并设置上限
                        const logValue = prev.stardust.plus(1).log10().plus(1);
                        // 限制底数，防止结果过大
                        const cappedLogValue = Decimal.min(logValue, new Decimal(500));
                        
                        currentEnergyFromStardustMultiplier = Decimal.pow(cappedLogValue, stardustEnergyUpgrade.owned.times(0.5));
                        
                        // 确保结果是有效的
                        if (currentEnergyFromStardustMultiplier.toString() === "NaN" || 
                            currentEnergyFromStardustMultiplier.toString() === "Infinity") {
                            currentEnergyFromStardustMultiplier = new Decimal(1e150); // 返回一个大但安全的数值
                        }
                    } else {
                        currentEnergyFromStardustMultiplier = new Decimal(1);
                    }

                    const synergyUpgrade = prev.upgrades.find(u => u.type === 'synergy');
                    const currentSynergyMultiplier = (synergyUpgrade && synergyUpgrade.owned.gt(0)) ? 
                        Decimal.pow(synergyUpgrade.baseMultiplier, prev.generators.reduce((sum, gen) => sum.plus(gen.owned), new Decimal(0))) : new Decimal(1);

                    const efficiencyUpgrade = prev.upgrades.find(u => u.type === 'efficiency');
                    const currentEfficiencyMultiplier = efficiencyUpgrade ? 
                        Decimal.pow(efficiencyUpgrade.baseMultiplier, efficiencyUpgrade.owned) : new Decimal(1);

                    // 使用完全相同的计算逻辑
                    const currentEnergyPerSecond = prev.generators.reduce((total, gen) => {
                        const genUpgrade = prev.upgrades.find(u => u.target === gen.id);
                        const genMultiplier = genUpgrade ? Decimal.pow(genUpgrade.baseMultiplier, genUpgrade.owned) : new Decimal(1);
                        return total.plus(gen.owned.times(gen.baseEnergy).times(genMultiplier));
                    }, new Decimal(0))
                        .times(currentTotalUpgradeMultiplier)
                        .times(currentStardustMultiplier)
                        .times(currentEnergyFromStardustMultiplier)
                        .times(currentSynergyMultiplier)
                        .times(currentEfficiencyMultiplier);
                    
                    // 检查计算结果是否有效
                    const epsStr = currentEnergyPerSecond.toString();
                    const validEPS = epsStr !== "NaN" && epsStr !== "Infinity" 
                        ? currentEnergyPerSecond 
                        : new Decimal(0);
                    
                    // 基于实际每秒值计算增量
                    const newEnergyGain = validEPS.times(deltaTime);
                    
                    // 安全地增加能量
                    let newEnergy;
                    try {
                        newEnergy = prev.energy.plus(newEnergyGain);
                        // 检查结果是否有效
                        if (newEnergy.toString() === "NaN" || newEnergy.toString() === "Infinity") {
                            newEnergy = prev.energy; // 保持原值
                        }
                    } catch (e) {
                        // 出错时保持原值
                        newEnergy = prev.energy;
                    }
                    
                    return {
                        ...prev,
                        energy: newEnergy,
                        // 保存当前每秒能量值，用于显示
                        currentEnergyPerSecond: validEPS,
                        statistics: {
                            ...prev.statistics,
                            totalEnergyGenerated: prev.statistics.totalEnergyGenerated.plus(newEnergyGain),
                            totalTimePlayedSeconds: prev.statistics.totalTimePlayedSeconds + deltaTime,
                            maxEnergyReached: Decimal.max(prev.statistics.maxEnergyReached || new Decimal(0), newEnergy),
                            maxStardustReached: Decimal.max(prev.statistics.maxStardustReached || new Decimal(0), prev.stardust),
                        }
                    };
                });
            }

            animationFrameId = requestAnimationFrame(gameLoop);
        };

        animationFrameId = requestAnimationFrame(gameLoop);

        return () => cancelAnimationFrame(animationFrameId);
    }, []);







    const createLeanSaveState = (state) => ({
        energy: state.energy.toJSON(),
        stardust: state.stardust.toJSON(),
        quantumEnergy: state.quantumEnergy.toJSON(),
        darkMatter: state.darkMatter.toJSON(),
        generators: state.generators.map(g => ({ id: g.id, owned: g.owned.toJSON() })),
        upgrades: state.upgrades.map(u => ({ id: u.id, owned: u.owned.toJSON() })),
        stardustUpgrades: state.stardustUpgrades.map(u => ({ id: u.id, owned: u.owned.toJSON() })),
        prestige: {
            level: state.prestige.level.toJSON(),
            points: state.prestige.points.toJSON(),
            multiplier: state.prestige.multiplier.toJSON(),
        },
        statistics: {
            totalEnergyGenerated: state.statistics.totalEnergyGenerated.toJSON(),
            totalAscensions: state.statistics.totalAscensions.toJSON(),
            totalTimePlayedSeconds: state.statistics.totalTimePlayedSeconds,
            startTime: state.statistics.startTime,
        },
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
                energy: loaded.energy ? new Decimal(loaded.energy) : new Decimal(10),
                stardust: loaded.stardust ? new Decimal(loaded.stardust) : new Decimal(0),
                quantumEnergy: loaded.quantumEnergy ? new Decimal(loaded.quantumEnergy) : new Decimal(0),
                darkMatter: loaded.darkMatter ? new Decimal(loaded.darkMatter) : new Decimal(0),
                generators: initialState.generators.map(g => {
                    const savedGen = loaded.generators?.find(sg => sg.id === g.id);
                    if (!savedGen) return g;
                    const owned = new Decimal(savedGen.owned);
                    return {
                        ...g,
                        owned: owned,
                        cost: g.baseCost.times(Decimal.pow(GAME_CONFIG.GENERATOR_COST_SCALING, owned))
                    };
                }),
                upgrades: initialState.upgrades.map(u => {
                    const savedUpg = loaded.upgrades?.find(su => su.id === u.id);
                    if (!savedUpg) return u;
                    const owned = new Decimal(savedUpg.owned);
                    return {
                        ...u,
                        owned: owned,
                        cost: u.baseCost.times(Decimal.pow(GAME_CONFIG.UPGRADE_COST_SCALING, owned))
                    };
                }),
                stardustUpgrades: initialState.stardustUpgrades.map(u => {
                    const savedUpg = loaded.stardustUpgrades?.find(su => su.id === u.id);
                    if (!savedUpg) return u;
                    const owned = new Decimal(savedUpg.owned);
                    return {
                        ...u,
                        owned: owned,
                        cost: u.baseCost.times(Decimal.pow(GAME_CONFIG.STARDUST_UPGRADE_COST_SCALING, owned))
                    };
                }),
                prestige: {
                    level: loaded.prestige?.level ? new Decimal(loaded.prestige.level) : new Decimal(0),
                    points: loaded.prestige?.points ? new Decimal(loaded.prestige.points) : new Decimal(0),
                    multiplier: loaded.prestige?.multiplier ? new Decimal(loaded.prestige.multiplier) : new Decimal(1),
                },
                statistics: {
                    totalEnergyGenerated: loaded.statistics?.totalEnergyGenerated ? new Decimal(loaded.statistics.totalEnergyGenerated) : new Decimal(0),
                    totalAscensions: loaded.statistics?.totalAscensions ? new Decimal(loaded.statistics.totalAscensions) : new Decimal(0),
                    totalTimePlayedSeconds: loaded.statistics?.totalTimePlayedSeconds || 0,
                    startTime: loaded.statistics?.startTime || Date.now(),
                    maxEnergyReached: loaded.statistics?.maxEnergyReached ? new Decimal(loaded.statistics.maxEnergyReached) : new Decimal(0),
                    maxStardustReached: loaded.statistics?.maxStardustReached ? new Decimal(loaded.statistics.maxStardustReached) : new Decimal(0),
                },
            };

            const lastActive = loaded.lastActive || Date.now();
            const offlineTime = (Date.now() - lastActive) / 1000;

            if (offlineTime > 0 && offlineTime < 86400) { // Max 24 hours offline time
                const offlineBoost = mergedState.stardustUpgrades.find(u => u.id === 'offline_boost_1');
                const offlineMultiplier = offlineBoost ? Decimal.pow(offlineBoost.baseMultiplier, offlineBoost.owned) : new Decimal(1);
                
                const loadedStardustMultiplier = Decimal.pow(GAME_CONFIG.STARDUST_BASE_MULTIPLIER, mergedState.stardust);
                const loadedGlobalMultiplier = mergedState.upgrades
                    .filter(u => u.type === 'global')
                    .reduce((acc, u) => acc.times(Decimal.pow(u.baseMultiplier, u.owned)), new Decimal(1));

                const offlineEPS = mergedState.generators.reduce((total, gen) => {
                    const genUpgrade = mergedState.upgrades.find(u => u.target === gen.id);
                    const genMultiplier = genUpgrade ? Decimal.pow(genUpgrade.baseMultiplier, genUpgrade.owned) : new Decimal(1);
                    return total.plus(gen.owned.times(gen.baseEnergy).times(genMultiplier));
                }, new Decimal(0)).times(loadedGlobalMultiplier).times(loadedStardustMultiplier).times(offlineMultiplier);

                const offlineGain = offlineEPS.times(offlineTime);
                mergedState.energy = mergedState.energy.plus(offlineGain);
                mergedState.statistics.totalEnergyGenerated = mergedState.statistics.totalEnergyGenerated.plus(offlineGain);
            }

            setGameState(mergedState);
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

    const handleEnergyClick = () => setGameState(prev => ({ ...prev, energy: prev.energy.plus(energyPerClick) }));

    const getCostScaling = (item) => {
        if (item.type === 'generator') {
            const costReduction = stardustUpgrades.find(u => u.id === 'generator_cost_reduction_1');
            const reductionFactor = costReduction ? Decimal.pow(costReduction.baseMultiplier, costReduction.owned) : new Decimal(1);
            return GAME_CONFIG.GENERATOR_COST_SCALING.times(reductionFactor);
        }
        if (item.type === 'stardust') {
            return GAME_CONFIG.STARDUST_UPGRADE_COST_SCALING;
        }
        return GAME_CONFIG.UPGRADE_COST_SCALING;
    };

    const calculateCost = (item, amount) => {
        const costScaling = getCostScaling(item);
        if (amount.eq(1)) {
            return item.cost;
        }
        // 用于批量购买的正确几何级数成本计算
        return item.cost.times(
            Decimal.pow(costScaling, amount).minus(1)
                .div(costScaling.minus(1))
        );
    };

    const buyItem = (id, rawAmount, currency) => {
        const allItems = [...generators, ...upgrades, ...stardustUpgrades];
        const item = allItems.find(i => i.id === id);
        if (!item) return;

        // Check max level
        if (item.maxLevel && item.owned.gte(new Decimal(item.maxLevel))) return;

        let amount;
        if (rawAmount === 'max') {
            const costScaling = getCostScaling(item);
            const currentCurrency = currency === 'Stardust' ? stardust : energy;
            
            // 计算能够负担的最大数量
            let maxAffordable = new Decimal(0);
            if (costScaling.eq(1)) {
                maxAffordable = currentCurrency.div(item.cost);
            } else {
                const numerator = currentCurrency.div(item.cost).times(costScaling.minus(1)).plus(1);
                if (numerator.gt(0)) {
                    maxAffordable = numerator.log(costScaling);
                }
            }
            
            amount = Decimal.floor(maxAffordable);
            
            // 遵守最大等级限制
            if (item.maxLevel) {
                amount = Decimal.min(amount, new Decimal(item.maxLevel).minus(item.owned));
            }
        } else {
            amount = new Decimal(rawAmount);
            // Respect max level
            if (item.maxLevel) {
                amount = Decimal.min(amount, new Decimal(item.maxLevel).minus(item.owned));
            }
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
                if (item.type === 'stardust') {
                    newState.stardustUpgrades = prev.stardustUpgrades.map(updateItem);
                }
            } else {
                newState.energy = newCurrencyValue;
                if (item.type === 'generator') {
                    newState.generators = prev.generators.map(updateItem);
                } else if (item.type === 'upgrade' || item.type === 'global' || item.type === 'synergy' || item.type === 'efficiency') {
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

        // Check max level
        if (item.maxLevel && item.owned.gte(new Decimal(item.maxLevel))) return false;

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



    const handlePrestige = () => {
        if (canPrestige) {
            setGameState(prev => {
                const newPrestigeLevel = prev.prestige.level.plus(1);
                const newPrestigePoints = prev.prestige.points.plus(nextPrestigeGain);
                const newPrestigeMultiplier = Decimal.pow(GAME_CONFIG.PRESTIGE_MULTIPLIER, newPrestigePoints);
                
                return {
                    ...getInitialState(),
                    prestige: {
                        level: newPrestigeLevel,
                        points: newPrestigePoints,
                        multiplier: newPrestigeMultiplier,
                    },
                    statistics: {
                        ...prev.statistics,
                        totalAscensions: prev.statistics.totalAscensions.plus(1),
                        totalEnergyGenerated: prev.statistics.totalEnergyGenerated,
                        totalTimePlayedSeconds: prev.statistics.totalTimePlayedSeconds,
                        startTime: prev.statistics.startTime,
                        maxEnergyReached: prev.statistics.maxEnergyReached,
                        maxStardustReached: prev.statistics.maxStardustReached,
                    }
                };
            });
        }
    };

    const handleAscend = () => {
        if (canAscend) {
            const stateToKeep = {
                stardust: gameState.stardust.plus(stardustToGain),
                stardustUpgrades: gameState.stardustUpgrades,
                prestige: gameState.prestige,
                statistics: {
                    ...gameState.statistics,
                    totalAscensions: gameState.statistics.totalAscensions.plus(1),
                },
            };
            setGameState({
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
                        cost: g.baseCost.times(Decimal.pow(GAME_CONFIG.GENERATOR_COST_SCALING, owned))
                    };
                }),
                upgrades: initialState.upgrades.map(u => {
                    const savedUpg = data.upgrades?.find(su => su.id === u.id);
                    if (!savedUpg) return u;
                    const owned = new Decimal(savedUpg.owned);
                    return {
                        ...u,
                        owned: owned,
                        cost: u.baseCost.times(Decimal.pow(GAME_CONFIG.UPGRADE_COST_SCALING, owned))
                    };
                }),
                stardustUpgrades: initialState.stardustUpgrades.map(u => {
                    const savedUpg = data.stardustUpgrades?.find(su => su.id === u.id);
                    if (!savedUpg) return u;
                    const owned = new Decimal(savedUpg.owned);
                    return {
                        ...u,
                        owned: owned,
                        cost: u.baseCost.times(Decimal.pow(GAME_CONFIG.STARDUST_UPGRADE_COST_SCALING, owned))
                    };
                }),
            };

            setGameState(mergedState);
            setCloudMessage('Game loaded successfully!');
        } catch (err){
            setCloudError(err.message);
        } finally {
            setCloudLoading(false);
        }
    };

    return (
        <>
            <div className="cosmic-bg"></div>
            <div className="particles">
                {[...Array(9)].map((_, i) => (
                    <div 
                        key={i} 
                        className="particle" 
                        style={{
                            width: `${Math.random() * 4 + 2}px`,
                            height: `${Math.random() * 4 + 2}px`,
                            animationDelay: `${Math.random() * 6}s`,
                            animationDuration: `${Math.random() * 4 + 6}s`
                        }}
                    ></div>
                ))}
            </div>
            <div className="game-container">
                <h1 className="game-title">Cosmic Forge</h1>
                <ResourceDisplay 
                    energy={energy} 
                    energyPerSecond={gameState.currentEnergyPerSecond || energyPerSecond} 
                    stardust={stardust} 
                    quantumEnergy={quantumEnergy}
                    darkMatter={darkMatter}
                    prestigePoints={prestige.points}
                />

                <div className="tab-navigation">
                    <TabButton activeTab={activeTab} tabName="Generators" onClick={setActiveTab} />
                    <TabButton activeTab={activeTab} tabName="Upgrades" onClick={setActiveTab} />
                    <TabButton activeTab={activeTab} tabName="Stardust" onClick={setActiveTab} />
                    <TabButton activeTab={activeTab} tabName="Ascension" onClick={setActiveTab} />
                    <TabButton activeTab={activeTab} tabName="Prestige" onClick={setActiveTab} />
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
                                    item={{
                                        ...gen,
                                        description: `Generates ${formatNumber(gen.baseEnergy.times(synergyMultiplier).times(efficiencyMultiplier))} Energy/s each. Tier ${gen.tier} generator.`
                                    }}
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
                                    item={{
                                        ...upg,
                                        description: `${upg.description} ${upg.maxLevel ? `(Max: ${upg.maxLevel})` : ''}`
                                    }}
                                    onBuy={() => buyItem(upg.id, buyAmount, 'Energy')}
                                    canAfford={canAfford(upg.id, buyAmount, 'Energy')}
                                    isMaxed={upg.maxLevel && upg.owned.gte(new Decimal(upg.maxLevel))}
                                    currency="Energy"
                                />
                            ))}
                        </div>
                    )}

                    {activeTab === 'Stardust' && (
                        <div className="item-list">
                            <div className="stardust-info">
                                <h3>Stardust Power</h3>
                                <p>Current Stardust Multiplier: <span className="text-accent">x{formatNumber(stardustMultiplier)}</span></p>
                                <p>Energy from Stardust: <span className="text-accent">x{formatNumber(energyFromStardustMultiplier)}</span></p>
                            </div>
                            <BuyAmountController buyAmount={buyAmount} setBuyAmount={setBuyAmount} />
                            {stardustUpgrades.map(upg => (
                                <UpgradeButton
                                    key={upg.id}
                                    item={{
                                        ...upg,
                                        description: `${upg.description} ${upg.maxLevel ? `(Max: ${upg.maxLevel})` : ''}`
                                    }}
                                    onBuy={() => buyItem(upg.id, buyAmount, 'Stardust')}
                                    canAfford={canAfford(upg.id, buyAmount, 'Stardust')}
                                    isMaxed={upg.maxLevel && upg.owned.gte(new Decimal(upg.maxLevel))}
                                    currency="Stardust"
                                />
                            ))}
                        </div>
                    )}



                    {activeTab === 'Prestige' && (
                        <PrestigePanel
                            prestige={prestige}
                            onPrestige={handlePrestige}
                            nextPrestigeGain={nextPrestigeGain}
                            canPrestige={canPrestige}
                        />
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
        </>
    );
}
