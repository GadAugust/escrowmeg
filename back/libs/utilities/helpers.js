exports.helpers = {
    getRandomNumber: () => {
        let minm = 100000;
        let maxm = 999999;
        return Math.floor(Math
        .random() * (maxm - minm + 1)) + minm;
    }
}