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

        let efficiencyArrey = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

        efficiencyArrey[0][0] = tempRadE - tempRadE * probabilityArray[0]
        efficiencyArrey[0][1] = tempRadE
        efficiencyArrey[0][2] = tempRadE + tempRadE * probabilityArray[2]
        efficiencyArrey[1][0] = waterE - waterE * probabilityArray[0]
        efficiencyArrey[1][1] = waterE
        efficiencyArrey[1][2] = waterE + waterE * probabilityArray[2]
        efficiencyArrey[2][0] = windE - windE * probabilityArray[0]
        efficiencyArrey[2][1] = windE
        efficiencyArrey[2][2] = windE + windE * probabilityArray[2]

        this.intervalCheck(installations[1].intervals, efficiencyArrey[0], installations[1].performanceFactors);
        this.intervalCheck(installations[0].intervals, efficiencyArrey[1], installations[0].performanceFactors);
        this.intervalCheck(installations[2].intervals, efficiencyArrey[2], installations[2].performanceFactors);
 
        terrain.price = [terrain.price + installations[1].price, terrain.price + installations[0].price, terrain.price + installations[2].price]
        terrain['efficiencyArrey'] = efficiencyArrey;
        terrain['probabilityArray'] = probabilityArray;
    }

    static effTRS(terrain, installations) {

        let temp1 = [];
        let rad1 = [];
        let water1 = [];
        let wind1 = [];
        let temp2 = [];
        let rad2 = [];
        let water2 = [];
        let wind2 = [];
        let temp3 = [];
        let rad3 = [];
        let water3 = [];
        let wind3 = [];
        let temp4 = [];
        let rad4 = [];
        let water4 = [];
        let wind4 = [];

        for (let index = 0; index < terrain.temp.length; index += 4) {
            temp1.push(terrain.temp[index])
            temp2.push(terrain.temp[index + 1])
            temp3.push(terrain.temp[index + 2])
            temp4.push(terrain.temp[index + 3])

            rad1.push(terrain.rad[index])
            rad2.push(terrain.rad[index + 1])
            rad3.push(terrain.rad[index + 2])
            rad4.push(terrain.rad[index + 3])

            water1.push(terrain.water[index])
            water2.push(terrain.water[index + 1])
            water3.push(terrain.water[index + 2])
            water4.push(terrain.water[index + 3])

            wind1.push(terrain.wind[index])
            wind2.push(terrain.wind[index + 1])
            wind3.push(terrain.wind[index + 2])
            wind4.push(terrain.wind[index + 3])
        }
       let stingT = JSON.stringify(terrain);
        let terrain1 = JSON.parse(stingT);
        terrain1.temp = temp1;
        terrain1.rad = rad1;
        terrain1.water = water1;
        terrain1.wind = wind1;
        this.effTR(terrain1, installations);

        let terrain2 = JSON.parse(stingT);
        terrain2.temp = temp2;
        terrain2.rad = rad2;
        terrain2.water = water2;
        terrain2.wind = wind2;
        this.effTR(terrain2, installations);

        let terrain3 = JSON.parse(stingT);
        terrain3.temp = temp3;
        terrain3.rad = rad3;
        terrain3.water = water3;
        terrain3.wind = wind3;
        this.effTR(terrain3, installations);

        let terrain4 = JSON.parse(stingT);
        terrain4.temp = temp4;
        terrain4.rad = rad4;
        terrain4.water = water4;
        terrain4.wind = wind4;
        this.effTR(terrain4, installations);

        let averageArrayEff = [];
        for (let i = 0; i < terrain1.efficiencyArrey.length; i++) {
            let row = [];
            for (let j = 0; j < terrain1.efficiencyArrey.length; j++) {
                let sum = terrain1.efficiencyArrey[i][j] + terrain2.efficiencyArrey[i][j] + terrain3.efficiencyArrey[i][j] + terrain4.efficiencyArrey[i][j];
                let average = sum / 4;
                row.push(average);
            }
            averageArrayEff.push(row);
        }

        let averageArrayProb = [];
        for (let i = 0; i < terrain1.probabilityArray.length; i++) {
            let row = [];
            let sum = terrain1.probabilityArray[i] + terrain2.probabilityArray[i] + terrain3.probabilityArray[i] + terrain4.probabilityArray[i];
            let average = sum / 4;
            averageArrayProb.push(average);
        }

        terrain.price = terrain1.price;
        terrain['efficiencyArrey'] = averageArrayEff;
        terrain['probabilityArray'] = averageArrayProb;
    }

    static calculateAverageArray(arr1, arr2, arr3, arr4) {
        const length = Math.max(arr1.length, arr2.length, arr3.length, arr4.length);
        let result = [];
        if (arr3.every(value => value === 0) && arr4.every(value => value === 0) && !arr2.every(value => value === 0)) {
            for (let i = 0; i < arr1.length; i++) {
                const average = (arr1[i] + arr2[i]) / 2;
                result.push(average);
            }
        } else if (arr3.every(value => value === 0) && !arr2.every(value => value === 0) && !arr4.every(value => value === 0)) {
            for (let i = 0; i < arr1.length; i++) {
                const average = (arr1[i] + arr2[i] + arr4[i]) / 3;
                result.push(average);
            }
        } else if (arr4.every(value => value === 0) && !arr2.every(value => value === 0) && !arr3.every(value => value === 0)) {
            for (let i = 0; i < arr1.length; i++) {
                const average = (arr1[i] + arr2[i] + arr3[i]) / 3;
                result.push(average);
            }
        } else if (arr2.every(value => value === 0) && !arr3.every(value => value === 0) && !arr4.every(value => value === 0)) {
            for (let i = 0; i < arr1.length; i++) {
                const average = (arr3[i] + arr4[i]) / 2;
                result.push(average);
            }
        } else if (arr2.every(value => value === 0) && arr3.every(value => value === 0) && !arr4.every(value => value === 0)) {
            result = arr4;
        } else if (arr2.every(value => value === 0) && !arr3.every(value => value === 0) && arr4.every(value => value === 0)) {
            result = arr3;
        } else {
            for (let i = 0; i < length; i++) {
                const values = [arr1[i], arr2[i], arr3[i], arr4[i]].filter(value => typeof value === 'number');
                if (values.length > 0) {
                    const average = values.reduce((total, value) => total + value, 0) / values.length;
                    result.push(average);
                } else {
                    result.push(null);
                }
            }
        }
        return result;
    }
    static intervalCheck(interval, values, intervalEff) {
        for (const key in values) {
            if (values[key] < interval[0]) {
                values[key] = values[key] * intervalEff[0];
            } else if (values[key] >= interval[0] && values[key] <= interval[1]) {
                values[key] = values[key] * intervalEff[1];
            } else if (values[key] >= interval[1]) {
                values[key] = values[key] * intervalEff[2];
            }
        }

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

    static knapSack(capital, cost, efficienc, index) {
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
        const squaredDifferences = numbers.map(num => Math.pow(num - mean, 2));
        const variance = this.calculateMean(squaredDifferences);
        return variance;
    }

    static calculateStandardDeviation(numbers) {
        const variance = this.calculateVariance(numbers);
        const standardDeviation = Math.sqrt(variance);
        return standardDeviation;
    }


    static BenefitArr(arrA) {
        const arrMax = [0, 0, 0];
        const index = [0, 0, 0];
        const benefitArr = [[], [], []];

        this.maxArrValue2d(arrA, arrMax, index);

        for (let i = 0; i < arrA[0].length; i++) {
            for (let j = 0; j < arrA.length; j++) {
                benefitArr[j][i] = arrMax[i] - arrA[j][i];
            }
        }
        return benefitArr;
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

    static maxArrValue2d(arr, arrMax) {
        for (let i = 0; i < arr[0].length; i++) {
            let max = arr[0][i];
            for (let j = 0; j < arr.length; j++) {
                if (max <= arr[j][i]) {
                    max = arr[j][i];
                }
            }
            arrMax[i] = max;
        }
    }

    static maxArrValue2d2(arr, arrMax, index) {
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

    static maxArrValue(arr, max, indexV) {
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
        return [n1 / arrLength, n2 / arrLength, n3 / arrLength]
    }

    static MaximumExpectedEfficiency(terrain) {
        const arrAxP = this.matrixMultiplication(terrain.efficiencyArrey, terrain.probabilityArray);
        const max = [0];
        const indexV = [0];

        this.maxArrValue2(arrAxP, max, indexV);

        terrain['optimalPrice'] = terrain.price[indexV[0]];
        terrain['optimalValue'] = max[0];
        terrain['optimalIndex'] = indexV[0];
    }

    static MaximumEfficiencyUnderMostProbableCondition(terrain) {
        const index = [0];
        const maxP = [0];
        const indexV = [0, 0];
        const max = [0];

        this.maxArrValue2(terrain.probabilityArray, maxP, index);
        this.maxArrValue3(terrain.efficiencyArrey, max, indexV, index);

        terrain['optimalPrice'] = terrain.price[indexV[0]];
        terrain['optimalValue'] = max[0];
        terrain['optimalIndex'] = indexV[0];
    }

    static MaximumGuaranteedEfficiency(terrain) {
        const arrMin = [0, 0, 0];
        const index = [0, 0, 0];
        const max = [0];
        const indexV = [0];

        this.minArrValue2d(terrain.efficiencyArrey, arrMin, index);
        this.maxArrValue(arrMin, max, indexV);

        terrain['optimalPrice'] = terrain.price[indexV[0]];
        terrain['optimalValue'] = max[0];
        terrain['optimalIndex'] = indexV[0];
    }

    static MinimumAverageForegoneBenefits(terrain) {
        let arrB = this.BenefitArr(terrain.efficiencyArrey);
        const arrAxP = this.matrixMultiplication(arrB, terrain.probabilityArray);
        const min = [0];
        const indexV = [0];

        this.minArrValue(arrAxP, min, indexV);

        const maxValues = arrB.map(subArray => Math.max(...subArray));
        const maxValue = Math.max(...maxValues);

        terrain['optimalPrice'] = terrain.price[indexV[0]];
        terrain['optimalValue'] = maxValue - min[0];
        terrain['optimalIndex'] = indexV[0];
    }

    static MinimumMissedBenefitUnderMostProbableCondition(terrain) {
        let arrB = this.BenefitArr(terrain.efficiencyArrey);
        const index = [0];
        const maxP = [0];
        const indexV = [0];
        const min = [0];

        this.maxArrValue2(terrain.probabilityArray, maxP, index);
        this.minArrValue3(arrB, min, indexV, index);

        const maxValues = arrB.map(subArray => Math.max(...subArray));
        const maxValue = Math.max(...maxValues);

        terrain['optimalPrice'] = terrain.price[indexV[0]];
        terrain['optimalValue'] = maxValue - min[0];
        terrain['optimalIndex'] = indexV[0];
    }

    static MinimumGuaranteedBenefitForegone(terrain) {
        let arrB = this.BenefitArr(terrain.efficiencyArrey);
        const arrMax = [0, 0, 0];
        const index = [0, 0, 0];
        const min = [0];

        const indexV = [0];
        this.maxArrValue2d2(arrB, arrMax, index);
        this.minArrValue(arrMax, min, indexV);

        const maxValues = arrB.map(subArray => Math.max(...subArray));
        const maxValue = Math.max(...maxValues);

        terrain['optimalPrice'] = terrain.price[indexV[0]];
        terrain['optimalValue'] = maxValue - min[0];
        terrain['optimalIndex'] = indexV[0];
    }
}

module.exports = Methods;

