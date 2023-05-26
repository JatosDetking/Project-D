class Methods {

    static effTR(terrain, installations) {
        let gravityArray = this.gravity(terrain.temp.length);
        let tempE = this.matrixMultiplication(terrain.temp, gravityArray);
        let radE = this.matrixMultiplication(terrain.rad, gravityArray);
        let tempRadE = (tempE + radE) / 2;
        let waterE = this.matrixMultiplication(terrain.water, gravityArray);
        let windE = this.matrixMultiplication(terrain.wind, gravityArray);
        let tRWWAverageArray = this.calculateAverageArray(terrain.temp, terrain.rad, terrain.water, terrain.wind);
        let probabilityArray = this.probability(tRWWAverageArray);


        
        /*
         double e1 = e2-e2*terrain.getProbabilitie(0);
         double e3 = e2+e2*terrain.getProbabilitie(2);
         terrain.setEff(e1,0,0);
         terrain.setEff(e2,0,1);
         terrai*/
    }
    static gravity(count) {
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

    static matrixMultiplication(a, b) {
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

    static knapSack(capital, cost, efficiency, index) {
        let terrainCount = efficiency.length;
        const effic = [...efficiency];
        const efficiencyArr = new Array(efficiency.length);

        for (let f = 0; f < efficiency.length; f++) {
            let prop = effic[f];
            effic[f] = prop * 100000;
            if (effic[f] < 0) {
                effic[f] = 0;
            }
        }

        for (let f = 0; f < efficiency.length; f++) {
            efficiencyArr[f] = Math.floor(effic[f]);
        }

        const n = efficiencyArr.length;

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
                    K[i][w] = Math.max(efficiencyArr[i - 1] + K[i - 1][w - cost[i - 1]], K[i - 1][w]);
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
                res -= efficiencyArr[i - 1];
                w -= cost[i - 1];
            }
        }
    }

    static sumResult(cost, index, efficiency) {
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

    static calculateMean(numbers) {
        const sum = numbers.reduce((total, num) => total + num, 0);
        const mean = sum / numbers.length;
        return mean;
    }

    static calculateVariance(numbers) {
        const mean = this.calculateMean(numbers);
        const squaredDifferences = numbers.map((num) => Math.pow(num - mean, 2));
        const variance = this.calculateMean(squaredDifferences);
        return variance;
    }

    static calculateStandardDeviation(numbers) {
        const variance = this.calculateVariance(numbers);
        const standardDeviation = Math.sqrt(variance);
        return standardDeviation;
    }

    static maxArrValue2d(arr, arrMax, index) {
        for (let i = 0; i < arr.length; i++) {
            let max = arr[i][0];
            let indexV = 0;
            for (let j = 1; j < arr[i].length; j++) {
                if (max <= arr[i][j]) {
                    max = arr[i][j];
                    indexV = j;
                }
            }
            arrMax[i] = max;
            index[i] = indexV;
        }
    }

    static minArrValue2d(arr, arrMin, index) {
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

    static maxArrValue(arr, max, index, indexV) {
        for (let i = 0; i < arr.length; i++) {
            if (i === 0) {
                max[0] = arr[i];
                indexV[0] = i;
            } else if (max[0] <= arr[i]) {
                max[0] = arr[i];
                indexV[0] = i;
            }
        }
    }

    static minArrValue(arr, min, index) {
        for (let i = 0; i < arr.length; i++) {
            if (i === 0) {
                min[0] = arr[i];
                index[0] = i;
            } else if (min[0] >= arr[i]) {
                min[0] = arr[i];
                index[0] = i;
            }
        }
    }

    static maxArrValue2(arr, max, index) {
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

    static maxArrValue3(arr, max, indexV, index) {
        for (let i = 0; i < arr.length; i++) {
            if (i === 0) {
                max[0] = arr[i][index[0]];
                indexV[0] = i;
            } else if (max[0] <= arr[i][index[0]]) {
                max[0] = arr[i][index[0]];
                indexV[0] = i;
            }
        }
    }

    static minArrValue3(arr, min, indexV, index) {
        for (let i = 0; i < arr.length; i++) {
            if (i === 0) {
                min[0] = arr[i][index[0]];
                indexV[0] = i;
            } else if (min[0] >= arr[i][index[0]]) {
                min[0] = arr[i][index[0]];
                indexV[0] = i;
            }
        }
    }

    static probability(arr) {
        let mean = this.calculateMean(arr);
        let standardDeviation = this.calculateStandardDeviation(arr);
        let n1 = 0;
        let n2 = 0;
        let n3 = 0;
        let arrLength = arr.length;
        let lowerBound = mean - standardDeviation;
        let upperBound = mean + standardDeviation;
        for (const element of arr) {
            if (element < lowerBound) {
                n1++;
            } else if (lowerBound <= element && element <= upperBound) {
                n2++;
            } else if (element > upperBound) {
                n3++;
            }
        }
        return [n1 / arrLength, n2 / arrLength, n3 / arrLength];
    }

    static MaximumExpectedEfficiency(arrA, arrP) {
        const arrAxP = this.matrixMultiplication(arrA, arrP);
        const max = [0];
        const indexV = [0];

        this.maxArrValue2(arrAxP, max, indexV);

        console.log(max[0]);
        console.log(indexV[0]);
    }

    static MaximumEfficiencyUnderMostProbableCondition(arrA, arrP) {
        const index = [0];
        const maxP = [0];
        const indexV = [0, 0];
        const max = [0];
        this.maxArrValue2(arrP, maxP, index);

        this.maxArrValue3(arrA, max, indexV, index);

        console.log(max[0]);
        console.log(indexV[0]);
    }

    static MaximumGuaranteedEfficiency(arrA) {
        const arrMin = [0, 0, 0];
        const index = [0, 0, 0];
        const max = [0];
        const indexV = [0];
        this.minArrValue2d(arrA, arrMin, index);
        this.maxArrValue(arrMin, max, index, indexV);

        console.log(max[0]);
        console.log(indexV[0]);
    }

    static MinimumAverageForegoneBenefits(arrB, arrP) {
        const arrAxP = this.matrixMultiplication(arrB, arrP);
        const min = [0];
        const indexV = [0];

        this.minArrValue(arrAxP, min, indexV);

        console.log(min[0]);
        console.log(indexV[0]);
    }

    static MinimumMissedBenefitUnderMostProbableCondition(arrB, arrP) {
        const index = [0];
        const maxP = [0];
        const indexV = [0];
        const min = [0];

        this.maxArrValue2(arrP, maxP, index);
        this.minArrValue3(arrB, min, indexV, index);
        console.log(min[0]);
        console.log(indexV[0]);
    }

    static MinimumGuaranteedBenefitForegone(arrB, arrP) {
        const arrMax = [0, 0, 0];
        const index = [0, 0, 0];
        const min = [0];
        const indexV = [0];
        this.maxArrValue2d2(arrB, arrMax, index);
        this.minArrValue(arrMax, min, indexV);

        console.log(min[0]);
        console.log(indexV[0]);
    }
    static calculateAverageArray(arr1, arr2, arr3, arr4) {
        const length = Math.max(arr1.length, arr2.length, arr3.length, arr4.length);
        const result = [];

        for (let i = 0; i < length; i++) {
            const values = [arr1[i], arr2[i], arr3[i], arr4[i]].filter(value => typeof value === 'number');
            if (values.length > 0) {
                const average = values.reduce((total, value) => total + value, 0) / values.length;
                result.push(average);
            } else {
                result.push(null);
            }
        }

        return result;
    }
}

module.exports = Methods;

