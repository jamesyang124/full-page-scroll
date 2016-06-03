var chai = require("./test_helper.js").chai;
var assert = chai.assert;

describe("Array Test", function() {
  var ary = [1, 2, 3, 4, 5];
  describe("#indexOf", function () {
    it("should return -1 when value is not present", function () {
      var x;
      while(ary.find(function (e, i, a) {
        x = parseInt(Math.random() * 100);
        return e === x;
      }))
      assert.equal(ary.indexOf(x), -1);
    });

    it("should return proper index when value is present", function () {
      ary.forEach(function (e, i, a) {
        assert.equal(ary.indexOf(e), i);
        assert.notEqual(ary.indexOf(e), -1);
      });
    });
  });
});
