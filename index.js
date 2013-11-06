
/**
 * Module dependencies.
 */

var debug = require('debug')('koa-session');
var uid = require('uid2');

/**
 * Initialize session middleware with `opts`:
 *
 * - `key` session cookie name ["koa:sess"]
 * - all other options are passed as cookie options
 *
 * @param {Object} [opts]
 * @api public
 */

module.exports = function(opts){
  opts = opts || {};

  var key = opts.key || 'koa:sess';
  debug('session options %j', opts);

  return function(next){
    return function *(){
      var sess = this.cookies.get(key, opts);
      this.sessionOptions = opts;
      this.sessionKey = key;
      var isNew = true;

      if (sess) {
        isNew = false;
        debug('parse %s', sess);
        this.session = new Session(this, JSON.parse(sess));
      } else {
        debug('new session');
        this.session = new Session(this);
      }

      yield next;

      if (!this.session.saved && isNew) {
        debug('auto-saving new session');
        this.session.save();
      }
    }
  }
};

/**
 * Session model.
 *
 * @param {Context} ctx
 * @param {Object} obj
 * @api private
 */

function Session(ctx, obj) {
  obj = obj || {};
  this._ctx = ctx;
  for (var k in obj) this[k] = obj[k];
  this.sid = obj.sid || uid(15);
}

/**
 * JSON representation of the session.
 *
 * @return {Object}
 * @api public
 */

Session.prototype.inspect =
Session.prototype.toJSON = function(){
  var self = this;
  var obj = {};

  Object.keys(this).forEach(function(key){
    if ('_' == key[0]) return;
    obj[key] = self[key];
  });

  return obj;
};

/**
 * Save session changes by
 * performing a Set-Cookie.
 *
 * @api public
 */

Session.prototype.save = function(){
  var ctx = this._ctx;
  var key = ctx.sessionKey;
  var opts = ctx.sessionOptions;
  var json = JSON.stringify(this);

  this.saved = true;
  debug('save %s', json);
  ctx.cookies.set(key, json, opts);
};
