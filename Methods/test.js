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
  
    return {efficiency: maxEfficiency, cost: sumCost};
  }
  




