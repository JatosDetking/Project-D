function gravity(count) {
    let sum = 0;
    const gravityArray = new Array(count);
    for (let i = 1; i <= count; i++) {
        sum += i;
    }
    for (let i = 1; i <= count; i++) {
        gravityArray[i - 1] = i / sum;
    }
    return gravityArray;
}

function matrixMultiplication(a, b) {
    let result = 0;
    if (Array.isArray(a[0])) {
        result = new Array(a.length).fill(0);

        for (let i = 0; i < a.length; i++) {
            for (let j = 0; j < a[0].length; j++) {
                result[i] += a[i][j] * b[j];
            }
        }
    } else {
        for (let i = 0; i < a.length; i++) {
            result += a[i] * b[i];
        }
    }
    return result;
}

function knapSack(capital, cost, efficienc, index) {
    let terrainCount = efficienc.length;
    const effic = [...efficienc];
    const efficiency = new Array(efficienc.length);

    for (let f = 0; f < efficienc.length; f++) {
        let prop = effic[f];
        effic[f] = prop * 100000;
        if (effic[f] < 0) {
            effic[f] = 0;
        }
    }

    for (let f = 0; f < efficienc.length; f++) {
        efficiency[f] = Math.floor(effic[f]);
    }

    const n = efficiency.length;

    for (let p = 0; p < terrainCount; p++) {
        index[p] = 0;
    }

    const K = new Array(n + 1);
    for (let i = 0; i <= n; i++) {
        K[i] = new Array(capital + 1).fill(0);
    }

    for (let i = 0; i <= n; i++) {
        for (let w = 0; w <= capital; w++) {
            if (i === 0 || w === 0) {
                K[i][w] = 0;
            } else if (cost[i - 1] <= w) {
                K[i][w] = Math.max(efficiency[i - 1] + K[i - 1][w - cost[i - 1]], K[i - 1][w]);
            } else {
                K[i][w] = K[i - 1][w];
            }
        }
    }

    let res = K[n][capital];
    let w = capital;

    for (let i = n; i > 0 && res > 0; i--) {
        if (res === K[i - 1][w]) {
            continue;
        } else {
            index[i - 1] = 1;
            res -= efficiency[i - 1];
            w -= cost[i - 1];
        }
    }
}

function sumResult(cost, index, efficiency) {
    let maxEfficiency = 0;
    let sumCost = 0;

    for (let i = 0; i < cost.length; i++) {
        if (index[i] === 1) {
            let p = i + 1;
            let d = cost[i];
            let f = efficiency[i];
            sumCost += cost[i];
            maxEfficiency += efficiency[i];
        }
    }

    return { efficiency: maxEfficiency, cost: sumCost };
}

function calculateMean(numbers) {
    const sum = numbers.reduce((total, num) => total + num, 0);
    const mean = sum / numbers.length;
    return mean;
}

function calculateVariance(numbers) {
    const mean = calculateMean(numbers);
    const squaredDifferences = numbers.map(num => Math.pow(num - mean, 2));
    const variance = calculateMean(squaredDifferences);
    console.log(variance);
    return variance;
}

function calculateStandardDeviation(numbers) {
    const variance = calculateVariance(numbers);
    const standardDeviation = Math.sqrt(variance);
    return standardDeviation;
}

///////////////////////////
function MaximumExpectedEfficiency(arrA, arrP) {
    const arrAxP = matrixMultiplication(arrA, arrP);

    const max = [0];
    const indexV = [0];

    maxArrValue2(arrAxP, max, indexV);

    console.log(max);
    console.log(indexV);
}


function MaximumProfitInTheMostProbableCondition(terrain) {
    const index = [0];
    const maxP = [0];
    const indexV = [0, 0];
    const max = [0];
    maxArrValue2(terrain.getProbabilities(), maxP, index);
    maxArrValue3(terrain.getEfficiency(), max, indexV, index);

    terrain.setOptimalEff(max[0]);
    terrain.setOptimalCost(terrain.getCost(indexV[0]));
    terrain.setIndex(indexV[0]);
}

function MaximumGuaranteedProfit(terrain) {
    const arrMin = [0, 0, 0];
    const index = [0, 0, 0];
    const max = [0];
    const indexV = [0, 0];
    minArrValue2d(terrain.getEfficiency(), arrMin, index);
    maxArrValue(arrMin, max, index, indexV);
    terrain.setOptimalEff(max[0]);
    terrain.setOptimalCost(terrain.getCost(indexV[0]));
    terrain.setIndex(indexV[0]);
}

function minArrValue2d(arr, arrMin, index) {
    for (let i = 0; i < arr.length; i++) {
        let min = arr[i][0];
        let indexV = 0;
        for (let j = 1; j < arr[i].length; j++) {
            if (min >= arr[i][j]) {
                min = arr[i][j];
                indexV = j;
            }
        }
        arrMin[i] = min;
        index[i] = indexV;
    }
}

function maxArrValue(arr, max, index, indexV) {
    for (let i = 0; i < arr.length; i++) {
        if (i === 0) {
            max[0] = arr[i];
            indexV[0] = i;
            indexV[1] = index[i];
        } else if (max[0] <= arr[i]) {
            max[0] = arr[i];
            indexV[0] = i;
            indexV[1] = index[i];
        }
    }
}

function maxArrValue2(arr, max, index) {
    for (let i = 0; i < arr.length; i++) {
        if (i === 0) {
            max[0] = arr[i];
            index[0] = i;
        } else if (max[0] <= arr[i]) {
            max[0] = arr[i];
            index[0] = i;
        }
    }
}

function maxArrValue3(arr, max, indexV, index) {
    for (let i = 0; i < arr.length; i++) {
        if (i === 0) {
            max[0] = arr[i][index[0]];
            indexV[0] = i;
            indexV[1] = index[0];
        } else if (max[0] <= arr[i][index[0]]) {
            max[0] = arr[i][index[0]];
            indexV[0] = i;
        }
    }
}


const testA = [
    [3, 3, 3, 3],
    [-2, -4, 30, 20],
    [2, 6, -8, -4]
];
const testP = [0.3, 0.4, 0.1, 0.2];
 MaximumExpectedEfficiency(testA, testP);




