module.exports = {
    'Non-Square Puzzle': Array(80).fill(0),
    'Empty Puzzle': Array(81).fill(0),
    '1 Solved Cell': [1, ...Array(80).fill(0)],
    'Solved Puzzle': [
        3, 5, 9, 1, 7, 6, 2, 4, 8,
        6, 4, 7, 8, 5, 2, 9, 3, 1,
        2, 8, 1, 4, 9, 3, 5, 6, 7,
        1, 6, 8, 5, 4, 9, 3, 7, 2,
        7, 3, 5, 2, 6, 8, 4, 1, 9,
        9, 2, 4, 7, 3, 1, 8, 5, 6,
        5, 1, 2, 6, 8, 4, 7, 9, 3,
        8, 7, 3, 9, 1, 5, 6, 2, 4,
        4, 9, 6, 3, 2, 7, 1, 8, 5
    ],

    '25x25 Puzzle': Array(25 * 25).fill(0),
    '10x10 Puzzle': Array(100).fill(0),

    'Invalid:Decimal': [0.1, 0, 0, 0],
    'Invalid:String': ['a', 0, 0, 0],
    'Invalid:NumericString': ['1', 0, 0, 0],
    'Invalid:ValueToLarge': [5, 0, 0, 0]
};