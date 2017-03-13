var util = require('../nacl-util');
var test = require('tape');

test('base64', function(t) {
    var testVectors = [
        // https://tools.ietf.org/html/rfc4648
        [[], ""],
        [[102], "Zg=="],
        [[102, 111], "Zm8="],
        [[102, 111, 111], "Zm9v"],
        [[102, 111, 111, 98], "Zm9vYg=="],
        [[102, 111, 111, 98, 97], "Zm9vYmE="],
        [[102, 111, 111, 98, 97, 114], "Zm9vYmFy"],
        // "hello world"
        [[104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100], "aGVsbG8gd29ybGQ="],
        // zeros
        [[0], "AA=="],
        [[0, 0], "AAA="],
        [[0, 0, 0], "AAAA"],
        [[0, 0, 0, 0], "AAAAAA=="],
        [[0, 0, 0, 0, 0], "AAAAAAA="],
        [[0, 0, 0, 0, 0, 0], "AAAAAAAA"],
        // random
        [
            [111, 16, 164, 40, 38, 216, 61, 120, 247, 118, 115, 82, 77, 65, 170, 155],
            "bxCkKCbYPXj3dnNSTUGqmw=="
        ],
        [
            [216, 8, 213, 125, 61, 133, 254, 192, 132, 229, 47, 151, 14, 63, 142, 230, 59, 143, 232, 228],
            "2AjVfT2F/sCE5S+XDj+O5juP6OQ="
        ]
    ];

    var badVectors = [
        "=",
        "==",
        "Zg===",
        "AAA",
        "=Zm8",
        "что"
    ];

    testVectors.forEach(function(vec, i) {
        t.equals(util.encodeBase64(vec[0]), vec[1], "base64 encode: " + i);
        t.deepEquals(util.decodeBase64(vec[1]), vec[0], "base64 decode: " + i);
    });

    badVectors.forEach(function (vec, i) {
        t.throws(function() { util.decodeBase64(vec) }, "base64 bad decode: " + i);
    });

    t.end();
});

test('utf8', function(t) {
    var testVectors = [
        "abcdef",
        "☺☻☹",
        "абвгдеёжз",
        "abcгдеjzy123",
        "こんにちは世界",
        "test 测试 тест",
        "𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡"
    ];
    testVectors.forEach(function (vec, i) {
        var bins = testVectors.map(function (s) { return util.decodeUTF8(s); });
        var strs = bins.map(function (a) { return util.encodeUTF8(a); });
        t.deepEquals(strs, testVectors);
    });
    t.end();
});
