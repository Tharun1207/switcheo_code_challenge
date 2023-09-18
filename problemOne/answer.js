var sum_to_n_a = function(n) {
    // Classic for loop
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i
    }
    return sum;
};

var sum_to_n_b = function(n) {
    // Summation (arithmetic progression formula)
    return (n * (n + 1)) / 2;
};

var sum_to_n_c = function(n) {
    // Recursion
    function recursiveSum(n) {
        if (n == 1) {
            return 1;
        } else {
            return n + recursiveSum(n - 1); 
        }
    }

    return recursiveSum(n);
};
