/*jslint indent: 2, onevar: false, eqeqeq: false, plusplus: false*/
/*globals TestCase,
          sinon,
          fail,
          assert,
          assertArray,
          assertEquals,
          assertSame,
          assertNotSame,
          assertFunction,
          assertObject,
          assertException,
          assertNoException*/
(function () {
  var testCase = TestCase; // Avoid JsLint warning

  testCase("CollectionCreateTest", {
    "test should create fake collection": function () {
      var collection = sinon.collection.create();

      assertFunction(collection.verify);
      assertFunction(collection.restore);
      assertFunction(collection.verifyAndRestore);
      assertFunction(collection.stub);
      assertFunction(collection.mock);
      assertArray(collection.fakes);
    }
  });

  testCase("CollectionStubTest", {
    setUp: function () {
      this.stub = sinon.stub;
      this.collection = sinon.collection.create();
    },

    tearDown: function () {
      sinon.stub = this.stub;
    },

    "test should call stub": function () {
      var object = { id: 42 };
      var args;

      sinon.stub = function () {
        args = Array.prototype.slice.call(arguments);
      };

      this.collection.stub(object, "method");

      assertEquals([object, "method"], args);
    },

    "test should add stub to fake array": function () {
      var object = { id: 42 };

      sinon.stub = function () {
        return object;
      };

      this.collection.stub(object, "method");

      assertEquals([object], this.collection.fakes);
    },

    "test should append stubs to fake array": function () {
      var objects = [{ id: 42 }, { id: 17 }];
      var i = 0;

      sinon.stub = function () {
        return objects[i++];
      };

      this.collection.stub({}, "method");
      this.collection.stub({}, "method");

      assertEquals(objects, this.collection.fakes);
    }
  });

  testCase("CollectionMockTest", {
    setUp: function () {
      this.mock = sinon.mock;
      this.collection = sinon.collection.create();
    },

    tearDown: function () {
      sinon.mock = this.mock;
    },

    "test should call mock": function () {
      var object = { id: 42 };
      var args;

      sinon.mock = function () {
        args = Array.prototype.slice.call(arguments);
      };

      this.collection.mock(object, "method");

      assertEquals([object, "method"], args);
    },

    "test should add mock to fake array": function () {
      var object = { id: 42 };

      sinon.mock = function () {
        return object;
      };

      this.collection.mock(object, "method");

      assertEquals([object], this.collection.fakes);
    },

    "test should append mocks to fake array": function () {
      var objects = [{ id: 42 }, { id: 17 }];
      var i = 0;

      sinon.mock = function () {
        return objects[i++];
      };

      this.collection.mock({}, "method");
      this.collection.mock({}, "method");

      assertEquals(objects, this.collection.fakes);
    }
  });

  testCase("CollectionStubAndMockTest", {
    setUp: function () {
      this.mock = sinon.mock;
      this.stub = sinon.stub;
      this.collection = sinon.collection.create();
    },

    tearDown: function () {
      sinon.mock = this.mock;
      sinon.stub = this.stub;
    },

    "test should append mocks and stubs to fake array": function () {
      var objects = [{ id: 42 }, { id: 17 }];
      var i = 0;

      sinon.stub = sinon.mock = function () {
        return objects[i++];
      };

      this.collection.mock({}, "method");
      this.collection.stub({}, "method");

      assertEquals(objects, this.collection.fakes);
    }
  });

  testCase("CollectionVerifyTest", {
    setUp: function () {
      this.collection = sinon.collection.create();
    },

    "test should call verify on all fakes": function () {
      this.collection.fakes = [{
        verify: sinon.spy.create()
      }, {
        verify: sinon.spy.create()
      }];

      this.collection.verify();

      assert(this.collection.fakes[0].verify.called);
      assert(this.collection.fakes[1].verify.called);
    }
  });

  testCase("CollectionRestoreTest", {
    setUp: function () {
      this.collection = sinon.collection.create();
    },

    "test should call restore on all fakes": function () {
      this.collection.fakes = [{
        restore: sinon.spy.create()
      }, {
        restore: sinon.spy.create()
      }];

      this.collection.restore();

      assert(this.collection.fakes[0].restore.called);
      assert(this.collection.fakes[1].restore.called);
    }
  });

  testCase("CollectionVerifyAndRestoreTest", {
    setUp: function () {
      this.collection = sinon.collection.create();
    },

    "test should call verify and restore": function () {
      this.collection.verify = sinon.spy.create();
      this.collection.restore = sinon.spy.create();

      this.collection.verifyAndRestore();

      assert(this.collection.verify.called);
      assert(this.collection.restore.called);
    },

    "test should throw when restore throws": function () {
      this.collection.verify = sinon.spy.create();
      this.collection.restore = sinon.stub.create().throwsException();

      assertException(function () {
        this.collection.verifyAndRestore();
      });
    },

    "test should call restore when restore throws": function () {
      this.collection.verify = sinon.spy.create();
      this.collection.restore = sinon.stub.create().throwsException();

      try {
        this.collection.verifyAndRestore();
      } catch (e) {}

      assert(this.collection.restore.called);
    }
  });
}());