export interface Money {
    Money: string | number;
}

export const MoneyTool = {
    /**
     * 將數字轉換為台灣口語數字單位 (如:一億兩千萬)
     * @param money 金額或金額物件
     * @returns 轉換後的字串
     */
    toTaiwanBigMoney(money: Money | string | number): string {
        // 處理不同的輸入類型
        let numValue: number;
        if (typeof money === 'string') {
            numValue = parseFloat(money);
        } else if (typeof money === 'number') {
            numValue = money;
        } else if (typeof money === 'object' && money !== null) {
            numValue = typeof money.Money === 'string' ? parseFloat(money.Money) : (money.Money as number);
        } else {
            return '無效金額';
        }

        if (isNaN(numValue)) return '無效金額';
        if (numValue === 0) return '零元 新台幣';

        // 單位
        const units: string[] = ['', '萬', '億', '兆'];
        // 數字
        const digitNames: string[] = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
        // 位數
        const positions: string[] = ['', '十', '百', '千'];

        // 將數字分成四位一組
        const numString: string = Math.floor(numValue).toString();
        const groups: string[] = [];
        for (let i = numString.length; i > 0; i -= 4) {
            groups.unshift(numString.substring(Math.max(0, i - 4), i));
        }

        let result = '';
        for (let i = 0; i < groups.length; i++) {
            const group = groups[i];
            const unitIndex = groups.length - 1 - i;

            // 處理這一組的數字
            let groupResult = '';
            let hasValue = false;

            for (let j = 0; j < group.length; j++) {
                const digit = parseInt(group[j], 10);
                if (digit !== 0) {
                    // 特殊情況：一十 -> 十
                    if (digit === 1 && j === 0 && group.length > 1) {
                        groupResult += positions[group.length - 1 - j];
                    } else {
                        groupResult += digitNames[digit] + positions[group.length - 1 - j];
                    }
                    hasValue = true;
                }
            }

            // 只有當這組不全是0時才加上單位
            if (hasValue) {
                result += groupResult + units[unitIndex];
            }
        }

        return result + '元 新台幣';
    },

    /**
     * 將數字轉換為台灣正式大寫金額 (如:壹佰萬元整)
     * @param money 金額或金額物件
     * @returns 轉換後的字串
     */
    toTaiwanMoney(money: Money | string | number): string {
        // 處理不同的輸入類型
        let numValue: number;
        if (typeof money === 'string') {
            numValue = parseFloat(money);
        } else if (typeof money === 'number') {
            numValue = money;
        } else if (typeof money === 'object' && money !== null) {
            numValue = typeof money.Money === 'string' ? parseFloat(money.Money) : (money.Money as number);
        } else {
            return '無效金額';
        }

        if (isNaN(numValue)) return '無效金額';
        if (numValue === 0) return '零圓整';

        // 大寫數字
        const digitNames: string[] = ['零', '壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖'];
        // 位數
        const positions: string[] = ['', '拾', '佰', '仟'];
        // 單位
        const units: string[] = ['', '萬', '億', '兆'];

        // 將數字分成四位一組
        const numString: string = Math.floor(numValue).toString();
        const groups: string[] = [];
        for (let i = numString.length; i > 0; i -= 4) {
            groups.unshift(numString.substring(Math.max(0, i - 4), i));
        }

        let result = '';
        let prevGroupAllZero = false;

        for (let i = 0; i < groups.length; i++) {
            const group = groups[i];
            const unitIndex = groups.length - 1 - i;

            // 處理這一組的數字
            let groupResult = '';
            let hasNonZero = false;
            let prevZero = false;

            for (let j = 0; j < group.length; j++) {
                const digit = parseInt(group[j], 10);

                if (digit === 0) {
                    // 處理連續的零
                    prevZero = true;
                } else {
                    // 如果之前有零且不在第一位，需要加一個零
                    if (prevZero && (j > 0 || (i > 0 && !prevGroupAllZero))) {
                        groupResult += '零';
                    }
                    groupResult += digitNames[digit] + positions[group.length - 1 - j];
                    hasNonZero = true;
                    prevZero = false;
                }
            }

            // 只有當這組有非零數字時才加上單位
            if (hasNonZero) {
                result += groupResult + units[unitIndex];
            }

            prevGroupAllZero = !hasNonZero;
        }

        return result + '圓整';
    }
};

// 測試案例
// 可以直接傳入數字
// console.log(MoneyTool.toTaiwanBigMoney(1000000)); // 一百萬元 新台幣
// console.log(MoneyTool.toTaiwanMoney(1000000));    // 壹佰萬圓整

// 可以傳入Money對象
// const test2: Money = { Money: 102894320 };
// console.log(MoneyTool.toTaiwanBigMoney(test2)); // 一億兩百八十九萬四千三百二十元 新台幣
// console.log(MoneyTool.toTaiwanMoney(test2));    // 壹億零
