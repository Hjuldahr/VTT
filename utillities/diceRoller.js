import { evaluate } from 'mathjs'; 

const diceBase = "(\\d*)d(\\d+)";

const standardRegexp = new RegExp(diceBase, "g"); 
const explodingRegexp = new RegExp(`ex\\(${diceBase}\\)`, "g"); 

const keepHighestRegexp = new RegExp(`kh\\(${diceBase}\\)`, "g"); 
const keepLowestRegexp = new RegExp(`kl\\(${diceBase}\\)`, "g"); 

const minRegexp = new RegExp(`min\\(${diceBase}\\)`, "g"); 
const maxRegexp = new RegExp(`max\\(${diceBase}\\)`, "g"); 
const avgRegexp = new RegExp(`avg\\(${diceBase}\\)`, "g"); 

const dice = (sides = 20) => {
    return Math.floor(Math.random() * sides + 1);
};

const standardRoll = (count = 1, sides = 20) => {
    const rolls = Array.from({ length: count }, () => dice(sides));
    return { result: rolls.reduce((b, a) => a + b, 0), rolls };
};

const explodingRoll = (count = 1, sides = 6, limit=100) => {
    const results = [];
    let totalForThisRoll = 0;

    for (let n = 0; n < count; n++) {
        const rolls = [];
        let totalForThisDie = 0;
        let currentRoll = 0;

        do {
            currentRoll = dice(sides);
            rolls.push(currentRoll);
            totalForThisDie += currentRoll;
        } while(currentRoll === sides && rolls.length < limit);

        results.push({result: totalForThisDie, rolls});
        totalForThisRoll += totalForThisDie;
    }

    return { result: totalForThisRoll, rolls: results };
};

const keepHighestRoll = (count = 2, sides = 20) => {
    const rolls = Array.from({ length: count }, () => dice(sides));
    return { result: Math.max(...rolls), rolls };
};

const keepLowestRoll = (count = 2, sides = 20) => {
    const rolls = Array.from({ length: count }, () => dice(sides));
    return { result: Math.min(...rolls), rolls };
};

const maximizedRoll = (count = 1, sides = 20) => {
    return count * sides;
};

const minimizedRoll = (count = 1, sides = 20) => {
    return count;
};

const averagedRoll = (count = 1, sides = 20) => {
    return Math.floor((count + count * sides) / 2);
};

const rollFormula = (formula) => {
    if (!formula?.trim()) return 0;
    
    const rollLogs = [];
        let processed = formula.toLowerCase();

        processed = processed.replace(keepHighestRegexp, (_, p1, p2) => {
        const nDice = parseInt(p1) || 2;
        const nSides = parseInt(p2);
        const { result, rolls } = keepHighestRoll(nDice, nSides);
        rollLogs.push({ type: 'kh', result, rolls });
        return result.toString();
    });

    processed = processed.replace(keepLowestRegexp, (_, p1, p2) => {
        const nDice = parseInt(p1) || 2;
        const nSides = parseInt(p2);
        const { result, rolls } = keepLowestRoll(nDice, nSides);
        rollLogs.push({ type: 'kl', result, rolls });
        return result.toString();
    });   

    processed = processed.replace(minRegexp, (_, p1, p2) => {
        const nDice = parseInt(p1) || 1;
        const nSides = parseInt(p2);
        const result = minimizedRoll(nDice, nSides);
        rollLogs.push({ type: 'min', result });
        return result.toString();
    });

    processed = processed.replace(maxRegexp, (_, p1, p2) => {
        const nDice = parseInt(p1) || 1;
        const nSides = parseInt(p2);
        const result = maximizedRoll(nDice, nSides);
        rollLogs.push({ type: 'max', result });
        return result.toString();
    });

    processed = processed.replace(avgRegexp, (_, p1, p2) => {
        const nDice = parseInt(p1) || 1;
        const nSides = parseInt(p2);
        const result = averagedRoll(nDice, nSides);
        rollLogs.push({ type: 'avg', result });
        return result.toString();
    });


    processed = processed.replace(explodingRegexp, (_, p1, p2) => {
        const nDice = parseInt(p1) || 1;
        const nSides = parseInt(p2);
        const { result, rolls } = explodingRoll(nDice, nSides);
        rollLogs.push({ type: 'ex', result, rolls });
        return result.toString();
    });

    processed = processed.replace(standardRegexp, (_, p1, p2) => {
        const nDice = parseInt(p1) || 1;
        const nSides = parseInt(p2);
        const { result, rolls } = standardRoll(nDice, nSides);
        rollLogs.push({ type: 'st', result, rolls });
        return result.toString();
    });

    return {
        result: evaluate(processed),
        rolls: rollLogs
    };
};

export default {
    rollFormula,
    standardRoll,
    explodingRoll
};