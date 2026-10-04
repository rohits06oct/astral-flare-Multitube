/**
 * Level Configurations for Car Crush (WeCrash)
 * Exactly ONE vehicle test per level.
 * When the vehicle passes or is crushed, no new car comes automatically.
 */

const GAME_LEVELS = [
    {
        id: 1,
        title: 'Level 1: Wedge Supercar',
        subtitle: 'Low profile pass (1.12m)',
        chainHeight: 1.75, // meters
        description: 'The ultra-low Alpine Wedge slides smoothly under the 1.75m chain barrier!',
        carQueue: ['white-wedge'],
        tip: 'Alpine Wedge is 1.12m tall. It clears with +63cm to spare!'
    },
    {
        id: 2,
        title: 'Level 2: Workforce Cargo Van',
        subtitle: 'Tall utility van (2.12m)',
        chainHeight: 1.75,
        description: 'The iconic blue cargo van strikes the chain and gets crushed flat by the hydraulic rams!',
        carQueue: ['blue-van'],
        tip: 'Van is 2.12m tall. Exceeds the 1.75m chain by 37cm!'
    },
    {
        id: 3,
        title: 'Level 3: Shadow Targa GT',
        subtitle: 'Razor-tight squeeze (1.25m)',
        chainHeight: 1.30,
        description: 'The barrier is lowered to 1.30m. The 1.25m Shadow Targa tests precision clearance!',
        carQueue: ['black-targa'],
        tip: 'Targa clears with just 5cm of safety margin!'
    },
    {
        id: 4,
        title: 'Level 4: Colossus Monster 4x4',
        subtitle: 'Giant lifted truck (2.75m)',
        chainHeight: 1.60,
        description: 'A 2.75m monster truck hits the 1.60m barrier, triggering catastrophic hydraulic destruction!',
        carQueue: ['monster-truck'],
        tip: 'Massive truck crushed into flat scrap metal!'
    },
    {
        id: 5,
        title: 'Level 5: Metro City Bus',
        subtitle: 'Towering transit bus (3.15m)',
        chainHeight: 1.80,
        description: 'The 3.15m long transit bus strikes the heavy iron barrier!',
        carQueue: ['city-bus'],
        tip: 'Maximum vehicle height vs 200-ton hydraulic crushers!'
    }
];

window.GAME_LEVELS = GAME_LEVELS;
