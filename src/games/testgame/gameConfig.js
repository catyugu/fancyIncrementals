import Decimal from 'break_infinity.js';

// --- Game Configuration ---
export const GAME_CONFIG = {
    // Starting values
    STARTING_ENERGY: new Decimal(25),  // 增加初始能量，让玩家一开始可以购买更多生产者
    STARTING_STARDUST: new Decimal(0),
    STARTING_QUANTUM_ENERGY: new Decimal(0),
    STARTING_DARK_MATTER: new Decimal(0),

    // Ascension
    ASCENSION_REQUIREMENT: new Decimal(5e5),  // 降低突破门槛，加快前期进度
    ASCENSION_EXPONENT: new Decimal(0.35),  // 略微提高收益，使得突破更有价值

    // Prestige
    PRESTIGE_BASE_REQUIREMENT: new Decimal(8),  // 降低首次声望需求
    PRESTIGE_REQUIREMENT_SCALING: new Decimal(8),  // 降低声望需求增长速度
    PRESTIGE_POINTS_PER_LEVEL: new Decimal(12),  // 增加声望点数奖励
    PRESTIGE_MULTIPLIER: new Decimal(1.18),  // 增加声望倍率效果

    // Cost scaling factors
    GENERATOR_COST_SCALING: new Decimal(1.09),  // 降低发生器成本增长倍率，让前期购买更容易
    UPGRADE_COST_SCALING: new Decimal(1.22),  // 略微降低升级成本增长倍率
    STARDUST_UPGRADE_COST_SCALING: new Decimal(1.42),  // 降低星尘升级成本增长倍率

    // Stardust effects
    STARDUST_BASE_MULTIPLIER: new Decimal(1.07),  // 增加星尘基础倍率，让星尘更有价值
    STARDUST_EFFECT_BASE: new Decimal(1.07),  // 提高星尘效果基数

    // Multiplier bases
    STARDUST_BASE_MULTIPLIER: 1.07,  // 与上面保持一致
    STARDUST_BOOST_MULTIPLIER: 1.07,  // 提高星尘加成倍率
    ENERGY_FROM_STARDUST_EXPONENT: 0.55,  // 增加星尘对能量的指数贡献

    // Offline settings
    MAX_OFFLINE_HOURS: 24,
};

// --- Generators Configuration ---
export const GENERATORS_CONFIG = [
    { 
        id: 'h_cloud', 
        name: 'Hydrogen Cloud', 
        baseCost: new Decimal(8),  // 降低初始成本
        baseEnergy: new Decimal(0.15),  // 增加基础产能
        tier: 1 
    },
    { 
        id: 's_nursery', 
        name: 'Stellar Nursery', 
        baseCost: new Decimal(120),  // 降低成本
        baseEnergy: new Decimal(1.5),  // 提高产能
        tier: 2 
    },
    { 
        id: 'g_cluster', 
        name: 'Galaxy Cluster', 
        baseCost: new Decimal(2000),  // 降低成本
        baseEnergy: new Decimal(10),  // 增加产能
        tier: 3 
    },
    { 
        id: 'neutron_star', 
        name: 'Neutron Star', 
        baseCost: new Decimal(35000),  // 降低成本
        baseEnergy: new Decimal(65),  // 增加产能
        tier: 4 
    },
    { 
        id: 'black_hole', 
        name: 'Black Hole', 
        baseCost: new Decimal(650000),  // 降低成本
        baseEnergy: new Decimal(320),  // 增加产能
        tier: 5 
    },
    { 
        id: 'quasar', 
        name: 'Quasar', 
        baseCost: new Decimal(8e7),  // 降低成本
        baseEnergy: new Decimal(1800),  // 增加产能
        tier: 6 
    },
    { 
        id: 'cosmic_web', 
        name: 'Cosmic Web', 
        baseCost: new Decimal(8e11),  // 降低成本
        baseEnergy: new Decimal(12000),  // 增加产能
        tier: 7 
    },
    { 
        id: 'universe', 
        name: 'Universe', 
        baseCost: new Decimal(8e16),  // 降低成本
        baseEnergy: new Decimal(120000),  // 增加产能
        tier: 8 
    },
];

// --- Upgrades Configuration ---
export const UPGRADES_CONFIG = [
    { 
        id: 'energy_boost_1', 
        name: 'Cosmic Rays', 
        baseCost: new Decimal(400),  // 降低成本
        description: 'Multiplies Energy generation by 1.25x per level.', 
        baseMultiplier: 1.25,  // 提高倍率
        type: 'global', 
        maxLevel: 25 
    },
    { 
        id: 'h_cloud_boost_1', 
        name: 'Focused Solar Winds', 
        baseCost: new Decimal(800),  // 降低成本
        description: 'Doubles Hydrogen Cloud output per level.', 
        baseMultiplier: 2.2,  // 提高倍率
        target: 'h_cloud', 
        type: 'upgrade', 
        maxLevel: 12  // 增加最大等级
    },
    { 
        id: 's_nursery_boost_1', 
        name: 'Gravitational Collapse', 
        baseCost: new Decimal(6500),  // 降低成本
        description: 'Doubles Stellar Nursery output per level.', 
        baseMultiplier: 2.2,  // 提高倍率
        target: 's_nursery', 
        type: 'upgrade', 
        maxLevel: 12  // 增加最大等级
    },
    { 
        id: 'g_cluster_boost_1', 
        name: 'Galactic Filaments', 
        baseCost: new Decimal(45000),  // 降低成本
        description: 'Multiplies Galaxy Cluster output by 1.6x per level.', 
        baseMultiplier: 1.6,  // 提高倍率
        target: 'g_cluster', 
        type: 'upgrade', 
        maxLevel: 15 
    },
    { 
        id: 'energy_boost_2', 
        name: 'Zero-Point Energy', 
        baseCost: new Decimal(180000),  // 降低成本
        description: 'Multiplies Energy generation by 1.25x per level.', 
        baseMultiplier: 1.25,  // 提高倍率
        type: 'global', 
        maxLevel: 25 
    },
    { 
        id: 'synergy_boost_1', 
        name: 'Cosmic Harmony', 
        baseCost: new Decimal(8e5),  // 降低成本
        description: 'Each generator tier boosts the previous tier by 6% per level.', 
        baseMultiplier: 1.06,  // 提高倍率
        type: 'synergy', 
        maxLevel: 50 
    },
    { 
        id: 'efficiency_boost_1', 
        name: 'Quantum Efficiency', 
        baseCost: new Decimal(8e8),  // 降低成本
        description: 'All generators become 25% more efficient per level.', 
        baseMultiplier: 1.25,  // 提高倍率
        type: 'efficiency', 
        maxLevel: 100 
    },
];

// --- Stardust Upgrades Configuration ---
export const STARDUST_UPGRADES_CONFIG = [
    { 
        id: 'stardust_boost_1', 
        name: 'Stardust Amplifier', 
        baseCost: new Decimal(1), 
        description: 'Stardust is 12% more effective per level.', 
        baseMultiplier: 1.12,  // 提高倍率
        type: 'stardust', 
        maxLevel: 100 
    },
    { 
        id: 'energy_from_stardust_1', 
        name: 'Stardust Infusion', 
        baseCost: new Decimal(4),  // 降低成本
        description: 'Gain a multiplier to energy based on stardust amount.', 
        baseMultiplier: 1.6,  // 提高倍率
        type: 'stardust', 
        maxLevel: 50 
    },
    { 
        id: 'generator_cost_reduction_1', 
        name: 'Cosmic Discount', 
        baseCost: new Decimal(15),  // 降低成本
        description: 'Reduces the cost scaling of generators by 1.5% per level.', 
        baseMultiplier: 0.985,  // 提高效果
        type: 'stardust', 
        maxLevel: 50 
    },
    { 
        id: 'offline_boost_1', 
        name: 'Temporal Storage', 
        baseCost: new Decimal(80),  // 降低成本
        description: 'Offline progress is 30% more effective per level.', 
        baseMultiplier: 1.3,  // 提高倍率
        type: 'stardust', 
        maxLevel: 20 
    },
    { 
        id: 'quantum_unlock', 
        name: 'Quantum Breakthrough', 
        baseCost: new Decimal(800),  // 降低成本
        description: 'Unlocks Quantum Energy generation. One-time purchase.', 
        baseMultiplier: 1, 
        type: 'stardust', 
        maxLevel: 1 
    },
];

