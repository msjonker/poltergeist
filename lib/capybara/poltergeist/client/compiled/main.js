var Poltergeist, arg, args, system, _i, _len, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Poltergeist = (function() {
  function Poltergeist(port, width, height) {
    var that;
    this.browser = new Poltergeist.Browser(this, width, height);
    this.connection = new Poltergeist.Connection(this, port);
    that = this;
    phantom.onError = function(message, stack) {
      return that.onError(message, stack);
    };
    this.running = false;
  }

  Poltergeist.prototype.runCommand = function(command) {
    var error;
    this.running = true;
    try {
      return this.browser.runCommand(command.name, command.args);
    } catch (_error) {
      error = _error;
      if (error instanceof Poltergeist.Error) {
        return this.sendError(error);
      } else {
        return this.sendError(new Poltergeist.BrowserError(error.toString(), error.stack));
      }
    }
  };

  Poltergeist.prototype.sendResponse = function(response) {
    return this.send({
      response: response
    });
  };

  Poltergeist.prototype.sendError = function(error) {
    return this.send({
      error: {
        name: error.name || 'Generic',
        args: error.args && error.args() || [error.toString()]
      }
    });
  };

  Poltergeist.prototype.send = function(data) {
    if (this.running) {
      this.connection.send(data);
      return this.running = false;
    }
  };

  return Poltergeist;

})();

window.Poltergeist = Poltergeist;

Poltergeist.Error = (function() {
  function Error() {}

  return Error;

})();

Poltergeist.ObsoleteNode = (function(_super) {
  __extends(ObsoleteNode, _super);

  function ObsoleteNode() {
    return ObsoleteNode.__super__.constructor.apply(this, arguments);
  }

  ObsoleteNode.prototype.name = "Poltergeist.ObsoleteNode";

  ObsoleteNode.prototype.args = function() {
    return [];
  };

  ObsoleteNode.prototype.toString = function() {
    return this.name;
  };

  return ObsoleteNode;

})(Poltergeist.Error);

Poltergeist.InvalidSelector = (function(_super) {
  __extends(InvalidSelector, _super);

  function InvalidSelector(_at_method, _at_selector) {
    this.method = _at_method;
    this.selector = _at_selector;
  }

  InvalidSelector.prototype.name = "Poltergeist.InvalidSelector";

  InvalidSelector.prototype.args = function() {
    return [this.method, this.selector];
  };

  return InvalidSelector;

})(Poltergeist.Error);

Poltergeist.FrameNotFound = (function(_super) {
  __extends(FrameNotFound, _super);

  function FrameNotFound(_at_frameName) {
    this.frameName = _at_frameName;
  }

  FrameNotFound.prototype.name = "Poltergeist.FrameNotFound";

  FrameNotFound.prototype.args = function() {
    return [this.frameName];
  };

  return FrameNotFound;

})(Poltergeist.Error);

Poltergeist.MouseEventFailed = (function(_super) {
  __extends(MouseEventFailed, _super);

  function MouseEventFailed(_at_eventName, _at_selector, _at_position) {
    this.eventName = _at_eventName;
    this.selector = _at_selector;
    this.position = _at_position;
  }

  MouseEventFailed.prototype.name = "Poltergeist.MouseEventFailed";

  MouseEventFailed.prototype.args = function() {
    return [this.eventName, this.selector, this.position];
  };

  return MouseEventFailed;

})(Poltergeist.Error);

Poltergeist.JavascriptError = (function(_super) {
  __extends(JavascriptError, _super);

  function JavascriptError(_at_errors) {
    this.errors = _at_errors;
  }

  JavascriptError.prototype.name = "Poltergeist.JavascriptError";

  JavascriptError.prototype.args = function() {
    return [this.errors];
  };

  return JavascriptError;

})(Poltergeist.Error);

Poltergeist.BrowserError = (function(_super) {
  __extends(BrowserError, _super);

  function BrowserError(_at_message, _at_stack) {
    this.message = _at_message;
    this.stack = _at_stack;
  }

  BrowserError.prototype.name = "Poltergeist.BrowserError";

  BrowserError.prototype.args = function() {
    return [this.message, this.stack];
  };

  return BrowserError;

})(Poltergeist.Error);

Poltergeist.StatusFailError = (function(_super) {
  __extends(StatusFailError, _super);

  function StatusFailError() {
    return StatusFailError.__super__.constructor.apply(this, arguments);
  }

  StatusFailError.prototype.name = "Poltergeist.StatusFailError";

  StatusFailError.prototype.args = function() {
    return [];
  };

  return StatusFailError;

})(Poltergeist.Error);

Poltergeist.NoSuchWindowError = (function(_super) {
  __extends(NoSuchWindowError, _super);

  function NoSuchWindowError() {
    return NoSuchWindowError.__super__.constructor.apply(this, arguments);
  }

  NoSuchWindowError.prototype.name = "Poltergeist.NoSuchWindowError";

  NoSuchWindowError.prototype.args = function() {
    return [];
  };

  return NoSuchWindowError;

})(Poltergeist.Error);

phantom.injectJs(phantom.libraryPath + "/web_page.js");

phantom.injectJs(phantom.libraryPath + "/node.js");

phantom.injectJs(phantom.libraryPath + "/connection.js");

phantom.injectJs(phantom.libraryPath + "/browser.js");

system = require('system');

args = [];

_ref = system.args.slice(1);
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  arg = _ref[_i];
  if (/.js$/.test(arg)) {
    phantom.injectJs(arg);
  } else {
    args.push(arg);
  }
}

new Poltergeist(args[0], args[1], args[2]);
