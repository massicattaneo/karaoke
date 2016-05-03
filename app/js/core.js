String.prototype.replaceAt = function(start, length, string) {
	return this.substr(0, --start) + string + this.substr(start + length);
};

String.prototype.insertAt = function(index, string) {
	return this.substr(0, index) + string + this.substr(index);
};

String.prototype.removeAt = function(index, length) {
	length = (typeof length === "undefined") ? 1 : length;
	return this.substr(0, --index) + this.substr(index + length);
};

String.prototype.padLeft = function(size, char) {
	if (size === 0) {
        return '';
    }
	return (Array(size+1).join(char) + this).slice(-size);
};

String.prototype.padRight = function(size, char) {
	if (size === 0) {
        return '';
    }
	return (this + Array(size+1).join(char)).slice(0, size);
};

String.prototype.removeHTMLTags = function() {
    return this.replace(/<\/?[^>]+(>|$)/g, '');
};

String.prototype.startsWith = function (start) {
    return this.substr(0, start.length) === start;
};

String.prototype.highlightWord = function(wordToHighlight, tagName, cssClass) {
    tagName = tagName || 'strong';
    var regex = new RegExp('(' + wordToHighlight + ')', 'gi');
    strClass = (cssClass) ? ' class="'+ cssClass + '"' : '';
    return this.replace(regex, '<' + tagName + strClass + '>$1</' + tagName + '>');
};

String.prototype.isTime = function() {
    return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(this);
};

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toString().toLowerCase();
};

String.prototype.toDate = function () {
    if (!isNaN(this)) {
        return new Date(parseInt(this));
    }
    var array = this.split(this.match(/\D/));
    return new Date(parseInt(array[0], 10), parseInt(array[1], 10) - 1, parseInt(array[2], 10));
};

if (!String.prototype.trim) {
    String.prototype.trim = function () {
        var ret = this;
        while (ret.charAt(0) === ' ') {
            ret = ret.replaceAt(1, 1, '');
        }
        while (ret.charAt(ret.length-1) === ' ') {
            ret = ret.replaceAt(ret.length, 1, '');
        }
        return ret;
    };
}

Array.prototype.indexOf = function(obj, index) {
	for (var i = (index || 0); i < this.length; i++) {
		if (this[i] === obj) {
			return i;
		}
	}
	return -1;
};

Array.prototype.each = function (callback, thisArg) {
    for (var i = 0; i < this.length; i ++) {
        callback.call(thisArg, i, this[i]);
    }
    return this;
};

Number.prototype.toFixed = function(precision) {
	var arr = this.toString().split('.'),
		int = arr[0],
		float = arr[1] || '';
	
	float =  float.padRight(precision, '0');
	return (float === '') ? int : int + '.' + float;
};

Object.isEmpty = function (obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop)) {
            return false;
        }
    }
    return true;
};

Object.isArray = function (object) {
    return object instanceof Array;
};


Element.prototype.addClass = function () {
    for (var a= 0; a < arguments.length; a++) {
        var className = arguments[a].trim();
        if (this.className) {
            if (!this.className.match(className)) {
                this.className += ' ' + className;
            }
        } else {
            this.className = className;
        }
    }
};

Element.prototype.removeClass = function () {
    for (var a= 0; a < arguments.length; a++) {
        var className = arguments[a].trim();
        if (this.className.match(className)) {
            this.className = this.className.replace(className, '').replace(/\s\s/g, ' ').trim();
        }
    }
};

Element.prototype.hasClass = function (className) {
    return this.className.match(className);
};

Element.prototype.toggleClass = function (className) {
    if (this.hasClass(className)) {
        this.removeClass(className);
    } else {
        this.addClass(className);
    }
};

if (!Event.prototype.stopPropagation) {
    Event.prototype.stopPropagation = function() {
        this.cancelBubble = true;
    };
}

if (!Event.prototype.preventDefault) {
    Event.prototype.preventDefault = function () {
        this.returnValue = false;
    };
}

Event.prototype.getTarget = function () {
    var event = this || window.event;
    return event.target || event.srcElement;
};

window.size = function() {
    var Size = {
        width: 640,
        height: 480
    };
    if (document.body && document.body.offsetWidth) {
        Size.width = document.body.offsetWidth;
        Size.height = document.body.offsetHeight;
    }
    if (document.compatMode === 'CSS1Compat' &&
        document.documentElement &&
        document.documentElement.offsetWidth) {
        Size.width = document.documentElement.offsetWidth;
        Size.height = document.documentElement.offsetHeight;
    }
    if (window.innerWidth && window.innerHeight) {
        Size.width = window.innerWidth;
        Size.height = window.innerHeight;
    }
    return Size;
};

// load: js/prototypes.js

var Class = function() {};

(function(_c) {

    _c.create = function(object) {
        return extendClass(new Class(), object || {});
    };

    _c.extend = function(ParentClass) {
        return {
            create: function(object) {
                return extendClass(new ParentClass(), object || {});
            },
            CollectionOf: function(Class) {
                return {
                    create: function(object) {
                        var Func = extendClass(new ParentClass(), createCollectionProto(Class));
                        return extendClass(new Func(), object || {});
                    }
                };
            }
        };
    };

    var extendClass = function (parentProto, childProto) {
        var _class = ExtendedObject(childProto.constructor, parentProto.constructor, childProto.constructor);
        _class.prototype = parentProto;
        for (var prop in childProto) {
            _class.prototype[prop] = ExtendedObject(childProto[prop], parentProto[prop], childProto[prop]);
        }
        _class.prototype.constructor = _class;
        return _class;
    };

    _c.CollectionOf = function (Class) {
        return {
            create: function(object) {
                return extendClass(createCollectionProto(Class), object || {});
            }
        };
    };

    var sortTogether = function(array1, array2) {
        var merged = [];
        array1.each(function (index) {
            merged.push({a1: array1[index], a2: array2[index]});
        });
        merged.sort(function (o1, o2) {
            return ((o1.a1 < o2.a1) ? -1 : ((o1.a1 === o2.a1) ? 0 : 1));
        });
        merged.each(function (index, item) {
            array1[index] = item.a1;
            array2[index] = item.a2;
        });
    };

    var swapArray = function(array, from, to){
        var removed = array.splice(to, 1, array[from]);
        array[from] = removed[0];
    };

    var createCollectionProto = function (ClassType) {
        var proto = {
            constructor: function(object) {
                this.items = [];
                this.keys = [];
                this.__counterId = 0;
                if (Object.isArray(object)) {
                    object.each(function (index, item) {
                        this.add(new ClassType(item));
                    }, this);
                } else {
                    for (var key in object) {
                        this.add(new ClassType(object[key]), key);
                    }
                }
            },
            size: function() {
                return (this.items) ? this.items.length: 0;
            },
            isEmpty: function() {
                return this.size()===0;
            },
            add: function (item, key) {
                var keyHere = (typeof key === 'undefined') ? this.__counterId++ : key;
                this.keys.push(keyHere);
                this.items.push(item);
                return item;
            },
            sort: function() {
                sortTogether(this.keys, this.items);
            },
            newItem: function (key) {
                var newItem = new ClassType();
                this.add(newItem, key);
                return newItem;
            },
            get: function (key) {
                return this.items[this.keys.indexOf(key)];
            },
            getAt: function (index) {
                return this.items[index];
            },
            getKeyAt: function (index) {
                return this.keys[index];
            },
            set: function (key, newValue) {
                var index = this.keys.indexOf(key);
                this.items[index] = newValue;
                return index;
            },
            setAt: function (index, newValue) {
                this.items[index] = newValue;
                return this.keys[index];
            },
            getLast: function (key) {
                return this.items[this.keys.lastIndexOf(key)];
            },
            swap: function (index1, index2) {
                swapArray(this.items, index1, index2);
                swapArray(this.keys, index1, index2);
            },
            getCollection: function (attribute, value) {
                var coll = new (Class.CollectionOf(ClassType).create())();
                this.each(function(index, key, object) {
                    if (object[attribute] === value) {
                        coll.add(object, key);
                    }
                });
                return coll;
            },
            indexOf: function (item) {
                return this.items.indexOf(item);
            },
            clone: function () {
                var coll = new (Class.CollectionOf(ClassType).create())();
                this.each(function(index, key, object) {
                    coll.add(object, key);
                });
                return coll;
            },
            addCollection: function(collection) {
                var self=this;
                collection.each(function(index,key,object) {
                    self.add(object,key);
                });
            },
            remove: function (key) {
                var removed;
                var index = 0;
                do {
                    index = this.keys.indexOf(key);
                    if (index !== -1) {
                        this.keys.splice(index,1);
                        removed = this.items.splice(index,1);
                    }
                } while (index !== -1);
                return removed[0] || null;
            },
            removeAt: function (index) {
                this.keys.splice(index,1);
                return this.items.splice(index,1)[0];
            },
            removeItem: function (item) {
                var index = this.indexOf(item);
                var key = this.keys[index];
                return this.remove(key);
            },
            filter: function(key) {
                var coll = new (Class.CollectionOf(ClassType).create())();
                this.each(function(i, k, object) {
                    if (k === key) {
                        coll.add(object, key);
                    }
                });
                return coll;
            },
            each: function(callback, thisArg) {
                for (var index = 0; index < this.items.length; index++) {
                    callback.call(thisArg || this, parseInt(index, 10), this.keys[index], this.items[index]);
                }
            },
            clear: function() {
                this.items = [];
                this.keys = [];
            }
        };
        return proto;
    };

    function isNotNative(constructor) {
        return constructor && constructor.toString().indexOf('native code') === -1;
    }

    var ExtendedObject = function (childConstructor, parentConstructor, attributeToEval) {
        if (typeof attributeToEval === 'function') {
            return function () {
                this.parent = parentConstructor;
                return (isNotNative(childConstructor)) ? childConstructor.apply(this, arguments) : parentConstructor.apply(this, arguments);
            };
        } else {
            return attributeToEval;
        }
    };

})(Class);
// load: js/Class.js

var eventBus, EventBus;

(function () {

    var Event = Class.create({
        constructor: function(name, scope, callback, once) {
            this.callback = callback;
            this.scope = scope;
            this.name = name;
            this.once = once;
        },
        triggerEvent: function() {
            this.callback.apply(this.scope, arguments);
        }
    });

    EventBus = Class.CollectionOf(Event).create({
        on: function (eventName, scope, callback) {
            return this.add(new Event(eventName, scope, callback, false));
        },
        once: function (eventName, scope, callback) {
            return this.add(new Event(eventName, scope, callback, true));
        },
        off: function (attribute, value) {
            this.getCollection(attribute, value).each(function(index, key) {
                this.remove(key);
            }, this);
        },
        trigger: function(eventName) {
            var self = this;
            var args = Array.prototype.slice.call(arguments, 1);
            return this.getCollection('name', eventName).each(function(index, key, object) {
                object.triggerEvent.apply(object, args);
                if (object.once) {
                    self.remove(key);
                }
            });
        }
    });

    eventBus = new EventBus();

})();

// load: js/Event.js

var Promise, Promises;

(function () {
    var WAIT = 0, DONE = 1, FAIL = 2;

    var PromiseAbstract = Class.CollectionOf(Function).create({

        constructor: function() {
            this.parent();
            this.id = -1;
            this.status = WAIT;
            this.returnData = [];
        },
        setStatus: function(status) {
            this.status = status;
        },
        isStatus: function(status) {
            return this.status === status;
        },
        setAction: function(status, action) {
            this.add(action, status);
        },
        getActions: function(status) {
            return this.filter(status);
        },
        eachAction: function (status, callback) {
            this.getActions(status).each(function(index, key, action) {
                callback.call(this, index, key, action);
            });
        },
        hasActions: function (status) {
            return !this.filter(status).isEmpty();
        },
        setData: function(status, action) {
            this.returnData[status] = action;
        },
        getData: function(status) {
            return this.returnData[status];
        },
        finalize: function(status, data) {
            var self = this;
            this.setData(status, data);
            this.setStatus(status);
            this.eachAction(status, function(i,k,action) {
                action.call(self, data, self.id);
            });
        },
        callAction: function(status, action) {
            var self = this;
            if (this.isStatus(status)) {
                action.call(self, self.getData(status), self.id);
            } else {
                this.setAction(status, action);
            }
        }

    });

    Promise = Class.extend(PromiseAbstract).create({
        constructor: function() {
            this.parent();
        },
        resolve: function(data) {
            this.finalize(DONE, data);
        },
        unresolvable: function(error) {
            this.finalize(FAIL, error);
        },
        onDone: function (action) {
            this.callAction(DONE, action);
            return this;
        },
        onFail: function(action) {
            this.callAction(FAIL, action);
            return this;
        }
    });

    var PromisesAbstract = Class.CollectionOf(Promise).create({
        constructor: function(object) {
            this.parent(object);
            this.done = null;
            this.fail = function() {};
            this.args = [];
            this.errors = [];
            this.count = 0;
            this.counter = 0;
            this.importsCounter = 0;
            this.status = WAIT;
        },
        setStatus: function (status) {
            this.status = status;
        },
        isStatus: function (status) {
            return this.status === status;
        },
        setData: function(status, data, id) {
            if (status === DONE) {
                this.args[id] = data;
            } else {
                this.errors.push(data);
            }
        },
        getData: function (status) {
            var args = this.errors;
            if (status === DONE) {
                args = this.args.slice(-this.importsCounter);
                args = args.concat(this.args.slice(0, this.importsCounter+1));
            }
            return args;
        },
        finalize: function (status, callback) {
            if (callback) {
                callback.apply(this, this.getData(status));
            }
        },
        setAction: function (status, action) {
            if (status === DONE) {
                this.done = action;
            } else {
                this.fail = action;
            }
        },
        callAction: function(status, callback) {
            if (this.status === status) {
                this.finalize(status, callback);
            } else {
                this.setAction(status, callback);
            }
        }

    });

    Promises = Class.extend(PromisesAbstract).create({
        constructor: function(minimum, object) {
            this.parent(object);
            this.minimum = minimum || 0;
        },
        add: function (promise, key) {
            this.parent(promise, key);
            var self = this;
            promise.id = this.counter++;
            promise.onDone(function(data, id) {
                self.itemOnDone(data,id);
            });
            promise.onFail(function(error) {
                self.itemOnFail(error);
            });
        },
        itemOnDone: function (data, id) {
            this.count+=1;
            this.setData(DONE, data, id);
            if (this.count === Math.max(this.minimum, this.size())) {
                this.setStatus(DONE);
                this.finalize(DONE, this.done);
            }
        },
        itemOnFail: function (error) {
            this.setData(FAIL, error);
            this.setStatus(FAIL);
            this.finalize(FAIL, this.fail);
        },
        onDone: function (action) {
            this.callAction(DONE, action);
            return this;
        },
        onFail: function(action) {
            this.callAction(FAIL, action);
            return this;
        },
        imports: function(namespace, pack) {
            this.importsCounter++;
            this.add(pack.retrievePackage(pack.getFullName(namespace)));
            return this;
        }
    });

})();

// load: js/Promise.js
var HtmlNode;
var componentBus = new EventBus();

(function () {
    var Listener = Class.create({
        constructor: function(callback, action, scope) {
            this.callback = callback;
            this.action = action;
            this.wrapper = function (event) {callback.call(scope, event);};
        }
    });

    var Listeners = Class.CollectionOf(Listener).create();

    /* ADD AND REMOVE EVENT LISTENERS */
    var addEventListener = function(node, action, callback, scope) {
        node.__listeners = node.__listeners || new Listeners();
        var listener = new Listener(callback, action, scope);
        node.__listeners.add(listener);
        if (node.addEventListener) {
            node.addEventListener(action, listener.wrapper);
        } else {
            node.attachEvent('on' + action, listener.wrapper);
        }
    }

    var removeEventListener = function (node, action, callback) {
        node.__listeners = node.__listeners || new Listeners();
        var listeners = node.__listeners.getCollection('action', action).getCollection('callback', callback);
        if (node.removeEventListener) {
            node.removeEventListener(action, listeners.getAt(0).wrapper);
        } else {
            node.detachEvent('on' + action, listeners.getAt(0).wrapper);
        }
        node.__listeners.remove(listeners.getKeyAt(0));
    }

    var removeAllEventListener = function (node) {
        if (node && node.__listeners) {
            node.__listeners.clone().each(function (i, k, listener) {
                removeEventListener(node, listener.action, listener.callback);
            });
        }
    }

    /* BREAKPOINTS */
    window.breakPoints = window.breakPoints || [480];
    var calculateActualBreakPoint = function () {
        var size = window.size();
        for (var i = 0; i < window.breakPoints.length; i++) {
            if (size.width <= window.breakPoints[i]) {
                return window.breakPoints[i];
            }
        }
        return 0;
    };
    var activeBreakPoint = window.activeBreakPoint = calculateActualBreakPoint();
    addEventListener(window, 'resize', function () {
        if (activeBreakPoint !== calculateActualBreakPoint()) {
            activeBreakPoint = window.activeBreakPoint = calculateActualBreakPoint();
            componentBus.trigger('__window:breakPointChange');
        }
    });


    /* GET PROPERTY VALUE */
    function getPropertyValue(node, property) {
        if (window.getComputedStyle) {
            return window.getComputedStyle(node, null).getPropertyValue(property);
        } else {
            switch (property) {
                case 'height':
                    return node.scrollHeight.toString();
                case 'width':
                    return node.scrollWidth.toString();
                default:
                    return node.currentStyle[property];
            }
        }
    }

    /* HTML NODE */
    HtmlNode = Class.create({
        constructor: function(htmlNode) {
            this.htmlNode = htmlNode;
        },
        detach: function () {
            componentBus.off('scope', this);
            removeAllEventListener(this.htmlNode);
        },
        addClass: function() {
            this.htmlNode.addClass.apply(this.htmlNode, arguments);
        },
        removeClass: function() {
            this.htmlNode.removeClass.apply(this.htmlNode, arguments);
        },
        toggleClass: function(className) {
            this.htmlNode.toggleClass(className);
        },
        hasClass: function(className) {
            return this.htmlNode.hasClass(className);
        },
        focus: function() {
            this.htmlNode.focus();
        },
        attribute: function (atrribute, value) {
            if (typeof value !== "undefined") {
                this.htmlNode.setAttribute(atrribute, value);
            }
            return this.htmlNode.getAttribute(atrribute);
        },
        /* TODO: refactoring and add: SELECT, RADIO */
        value: function(newValue) {
            var attr = (this.htmlNode.tagName === 'INPUT' || this.htmlNode.tagName === 'TEXTAREA') ? 'value': 'textContent';
            if (typeof newValue !== 'undefined') {
                if (attr === 'value') {
                    switch (this.attribute('type')) {
                        case 'checkbox':
                            if (newValue) {
                                this.attribute('checked', 'checked');
                                return true;
                            } else {
                                this.htmlNode.removeAttribute('checked');
                                return false;
                            }
                            break;
                        default:
                            this.htmlNode[attr] = newValue;

                    }
                } else {
                    this.htmlNode.textContent = newValue;
                    this.htmlNode.innerText = newValue;
                }
            }
            return this.htmlNode[attr];
        },
        /* TODO: add all css possibility */
        css: function(property, value) {
            if (typeof value !== "undefined") {
                this.htmlNode.style[property] = "" + value + "px";
            } else {
                var digit = getPropertyValue(this.htmlNode, property).match(/\d+/);
                if (digit) {
                    return parseInt(digit[0]);
                }
                return 0;
            }
        },
        on: function(eventName,callback) {
            if (eventName.indexOf(':') === -1 && this.componentName) {
                eventName = this.componentName + ':' + eventName;
            }
            componentBus.on(eventName,this,callback);
        },
        trigger: function() {
            var temp = Array.prototype.slice.call(arguments, 1);
            var args = (arguments[0].indexOf(':') === -1) ? [this.componentName + ':' + arguments[0]] : [arguments[0]];
            componentBus.trigger.apply(componentBus, args.concat(temp));
        },
        addListener: function(htmlNode, actionList, callback) {
            var actions = actionList.split(',');
            for (var i = 0; i < actions.length; i ++)
            {
                addEventListener(htmlNode, actions[i], callback, this);
            }
        },
        removeListener: function (htmlNode, actionsList, callback) {
            var actions = actionsList.split(',');
            for (var i = 0; i < actions.length; i ++)
            {
                removeEventListener(htmlNode, actions[i], callback);
            }
        }
    });
})();

// load: js/prototypes.js

(function (namespace) {
    var JSONtoXML = function (json, nodeName) {

        function createNode(name, value) {
            var child = document.createElement(name);
            child.innerText = value;
            return child;
        }

        function scanArray(array, nodeName, node) {
            for (var prop = 0; prop < array.length; prop++) {
                if (typeof array[prop] !== 'object') {
                    node.appendChild(createNode(nodeName, array[prop]));
                } else {
                    node.appendChild(scanNodes(array[prop], nodeName));
                }
            }
        }

        function scanNodes(object, nodeName) {
            var node = document.createElement(nodeName);
            for (var prop in object) {
                if (object[prop] instanceof Array){
                    scanArray(object[prop], prop, node);
                } else {
                    if (typeof object[prop] !== 'object') {
                        node.appendChild(createNode(prop, object[prop]));
                    } else {
                        node.appendChild(scanNodes(object[prop], prop));
                    }
                }

            }
            return node;
        }

        return scanNodes(json, nodeName);
    };

    namespace.toXML = JSONtoXML;

})(JSON);


// load: js/HtmlNode.js

var Model, ModelCollection;
(function () {
    /* Model */
    Model = Class.CollectionOf(Object).create({
        constructor: function(data) {
            this.parent();
            this.parseData(data);
        },
        parseData: function (data) {
            for (var a in data) {
                var itemData = data[a];
                if (itemData instanceof Array && !(itemData instanceof Date)) {
                    this.add(new ModelCollection(itemData), a);
                }
                else if (itemData instanceof Object && !(itemData instanceof Date)) {
                    this.add(new Model(itemData), a);
                }
                else {
                    this.add(itemData, a);
                }
            }
        },
        set: function (key, newValue) {
            this.parent(key, newValue);
            componentBus.trigger('model:' + key + ':change', key, this);
        },
        setAt: function(index, newValue) {
            var key = this.parent(index, newValue);
            componentBus.trigger('model:' + key + ':change', key, this);
        },
        triggerChange: function () {
            this.each(function (index, key, item) {
                if (item instanceof ModelCollection) {
                    item.each(function (i, k, it) {
                        it.triggerChange();
                    });
                } else if (item instanceof Model) {
                    item.triggerChange();
                } else {
                    componentBus.trigger('model:' + key + ':change', key, this);
                }
            });
        }
    });

    ModelCollection = Class.CollectionOf(Model).create({
        constructor: function(data) {
            this.parent(data);
        },
        newItem: function (itemData) {
            var newModel = new Model(itemData);
            this.add(newModel);
            return newModel;
        }
    });

})();
// load: js/utils/JSONtoXML.js

var XML = {};

(function (namespace) {

    function getNodeValue(node) {
        var text = node.textContent || node.innerText;
        var value = isNaN(text) ? text : parseFloat(text);
        return value;
    }

    function parseNode(children) {
        var json = {};
        for (var n = 0; n < children.length; n++) {
            var node = children[n];
            var tagName = node.tagName.toLowerCase();

            if (json[tagName] && !Object.isArray(json[tagName])) {
                json[tagName] = [json[tagName]];
            }

            var value = parseNode(node.children) || getNodeValue(node);

            if (Object.isArray(json[tagName])) {
                json[tagName].push(value);
            } else {
                json[tagName] = value;
            }
        }
        return (Object.isEmpty(json)) ? null : json;
    }

    namespace.toJSON = function (container) {
        return parseNode(container.children);
    };

})(XML);
// load: js/Promise.js

var Package = Class.extend(Promise).create({
    constructor: function(name) {
        this.parent();
        this.data = {};
        this.name = name;
        this.promises = new Promises();
    },
    setCallback: function(callback) {
        var self = this;
        this.promises.onDone(function() {
            var args = Array.prototype.slice.call(arguments, 1);
            var ret = callback.apply(self.data, args);
            if (ret) {
                self.data = ret;
            }
            self.resolve(self.data);
        });
    },
    addPromise: function(promise) {
        this.promises.add(promise);
    }
});

var packStorage = new (Class.CollectionOf(Package).create())();

var Packages = Class.create({
    constructor: function (type) {
        this.parent();
        this.imported = [];
        this.type = type;
    },
    create: function(packageName, callback) {
        var newPackage = this.retrievePackage(this.getFullName(packageName)),
            promise = new Promise();

        newPackage.addPromise(promise);
        for (var i = 0; i <this.imported.length; i++) {
            newPackage.addPromise(this.retrievePackage(this.imported[i]));
        }
        newPackage.setCallback(callback);
        promise.resolve();
        this.imported.length = 0;
    },
    imports: function(packageName) {
        this.imported.push(this.getFullName(packageName));
        return this;
    },
    from: function (packageType) {
        var lastImportIndex = this.imported.length - 1;
        var lastImport = this.imported[lastImportIndex];
        this.imported[lastImportIndex] = packageType + lastImport.substr(lastImport.indexOf(':'));
        return this;
    },
    getPackage: function(packageName) {
        if (packStorage.get(this.getFullName(packageName))) {
            return packStorage.get(this.getFullName(packageName)).data;
        }
        return null;
    },
    getFullName: function (packageName) {
        return this.type + ':' + packageName;
    },
    each: function (callback) {
        var i = 0, self = this, typeLength = this.type.length;
        packStorage.each(function (index, fullName, pkg) {
            if (fullName.startsWith(self.type)) {
                callback.call(self, i, fullName.substr(typeLength+1), pkg);
                i++;
            }
        });
    },
    retrievePackage: function(packageName) {
        if (packStorage.get(packageName)) {
            return packStorage.get(packageName);
        }
        var newPack = new Package(packageName);
        packStorage.add(newPack, packageName);
        return newPack;
    }
});

var packages =  new Packages('packages');
var HttpRequest;

(function () {
    HttpRequest = Class.extend(Promise).create({
        constructor: function(url) {
            this.parent();
            var self = this;
            var x = new(XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
            x.open('GET', url, 1);
            x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            x.onreadystatechange = function () {
                if (x.readyState === 4) {
                    self.resolve(x.responseText);
                } else if (x.status = 404) {
                    self.unresolvable(x.responseText);
                }
            };
            x.send();
        }
    });
})();
// load: js/Model.js

var components = new Packages('components'), Component;
var interfaces = new Packages('interfaces');

(function () {

    var helpers = {
        day: function(date) {
            return date.toDate().getDate();
        },
        dayNumber: function (date) {
            return date.toDate().getDay();
        },
        dayName: function (date) {
            var dayNames = ['Domenica', 'Lunedì' , 'Martedì',
                'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
            return dayNames[helpers.dayNumber(date)];
        },
        month: function(date) {
            return date.toDate().getMonth() + 1;
        },
        monthName: function(date) {
            var monthNames = ['Gennaio', 'Febbraio' , 'Marzo', 'Aprile', 'Maggio', 'Giuigno',
                'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
            return monthNames[(helpers.month(date) -1 )];
        }
    };

    var HtmlNodeInterface = Class.extend(HtmlNode).create({
        constructor: function(htmlNode, component) {
            this.parent(htmlNode);
            this.component  = component;
        }
    });

    /* Component */
    Component = Class.extend(HtmlNode).CollectionOf(Object).create({
        constructor: function(htmlNode, model, content) {
            this.parent();
            if (htmlNode) {
                this.content = content;
                this.nodeId = htmlNode.id || null;
                this.componentName = this.componentName || htmlNode.getAttribute('data-component');
                this.componentName = (this.componentName === 'undefined') ? null : this.componentName;
                this.__saveStaticData(htmlNode, model);
                this.__setTemplate(htmlNode);
                this.htmlNode = htmlNode;
                this.changeView();
            }
        },
        init: function () {
            //for extended objects
        },
        changeView: function (viewName) {
            viewName = viewName || this.componentName;
            var newView = views[viewName + ':' + window.activeBreakPoint] || views[viewName] || this.template;
            this.componentName = viewName;
            this.template = newView;
            this.detach();
            this.bindings = new Bindings();
            this.htmlNode = this.__replaceTemplate(this.htmlNode);
            this.__parseEditorialContent();
            this.__parseNodes();
            this.__fillData();
            this.model.triggerChange();
            this.__render();
            this.on('__window:breakPointChange', this.changeView);
            this.init();
        },
        modelChange: function(itemName, model) {
            if (model === this.model) {
                this.bindings.getCollection('itemName', itemName).each(function (i, k, item) {
                    if (item.type === 'value') {
                        item.value(model.get(item.itemName));
                    } else {
                        item.attribute(item.type, model.get(item.itemName));
                    }
                });
            }
        },
        addBinding: function (node, attributeType, attributeValue, helper) {
            this.bindings.add(new ItemBinding(node, attributeType, attributeValue, helper));
        },
        __setTemplate: function(htmlNode) {
            var newNode = htmlNode.cloneNode(true);
            newNode.removeAttribute('data-component');
            newNode.removeAttribute('id');
            this.template = views[this.componentName + ':' + window.activeBreakPoint] || views[this.componentName] || newNode.outerHTML;
        },
        __saveStaticData: function(htmlNode, model) {
            this.model = model || new Model({});
            if (!model && views[this.componentName]) {
                this.model = new Model(XML.toJSON(htmlNode) || {});
            }
        },
        __replaceTemplate: function (htmlNode) {
            var node = document.createElement('div');
            node.innerHTML = this.template;
            var newNode = node.children[0];
            if (this.nodeId) {
                newNode.setAttribute('id', this.nodeId);
            }
            var parentNode = htmlNode.parentNode;
            parentNode.insertBefore(newNode, htmlNode.nextSibling);
            parentNode.removeChild(htmlNode);
            return newNode;
        },
        __parseEditorialContent: function () {
            parseContent(this.htmlNode, this);
        },
        __parseNodes: function () {
            parseNodes(this.htmlNode, this);
        },
        __fillData: function () {
            var self = this;
            this.model.each(function (index, key, item) {
                if (self.get(key)) {
                    if (item instanceof ModelCollection) {
                        item.each(function (j, k, it) {
                            self.get(key).newItem(it);
                        });
                    }
                }
            });
        },
        __render: function() {
            this.htmlNode.setAttribute('ready','');
            if (this.componentName) {
                var viewWidth = (window.activeBreakPoint) ? ('s' + window.activeBreakPoint.toString()) : 'default';
                this.htmlNode.addClass('components', this.componentName, viewWidth);
            }
        },
        detach: function () {
            this.parent();
            this.each(function (i,k,item) {
                item.detach();
            }, this);
            this.clear();
        },
        addInterface: function(htmlNode, interfaceName) {
            interfaces.getPackage(interfaceName).call(new HtmlNodeInterface(htmlNode, this));
        }
    });

    var Item = Class.extend(HtmlNode).create({
        constructor: function(htmlNode) {
            this.parent(htmlNode);
        }
    });

    var ItemBinding = Class.extend(HtmlNode).create({
        constructor: function(htmlNode, type, itemName, helper) {
            this.parent(htmlNode);
            this.type = type;
            this.itemName = itemName;
            this.helper = helper;
        },
        value: function(newValue) {
            if (newValue && this.helper) {
                newValue = helpers[this.helper](newValue);
            }
            return this.parent(newValue);
        }
    });
    var Bindings = Class.CollectionOf(ItemBinding).create();

    var Collection = Class.CollectionOf(Component).create({
        constructor: function(container, htmlNode, componentName, content) {
            this.parent();
            this.container = container;
            this.htmlNode = htmlNode;
            this.componentName = componentName;
            this.container.removeChild(htmlNode);
            this.content = content;
        },
        newItem: function (itemData) {
            var newNode = this.htmlNode.cloneNode(true);
            this.container.appendChild(newNode);
            newNode.setAttribute('data-component', this.componentName);
            var Comp = components.getPackage(this.componentName) || Component;
            var newItem = new Comp(newNode, itemData, this.content);
            this.add(newItem);
            return newItem;
        },
        detach: function () {
            this.each(function (i,k,item) {
                item.detach();
            }, this);
            this.clear();
        },
        changeView: function(viewName) {
            this.each(function (i, k, item) {
                item.changeView(viewName);
            })
        }
    });

    var parseContent = function (mainNode, component) {
        var parseNode = function (node) {
            var ret = true;
            var attributeValue = node.getAttribute('data-content');
            if (attributeValue) {
                var content = component.content[attributeValue];
                var matches = content.match(/\$\{[^${.*}]*\}/g);
                for (var i = 0; i < matches.length; i++) {
                    var match = matches[i];
                    var itemName = match.replace('${', '').replace('}', '');
                    content = content.replace(match, '<var data-bind="value:'+itemName+'"></var>');
                }
                node.innerHTML = content;
                node.removeAttribute('data-content');
                ret = false;
            }
            return ret;
        };
        eachChildren(this, mainNode, parseNode);
    };

    var parseNodes = function (mainNode, component) {
        var parseNode = function (node) {
            var ret = true;
            var attributeValue = node.getAttribute('data-item');
            if (attributeValue) {
                addItem(node, attributeValue, component);
                node.removeAttribute('data-item');
            }
            attributeValue = node.getAttribute('data-bind');
            if (attributeValue) {
                attributeValue.split(',').each(function (index, item) {
                    addBind(node, item, component);
                });
                node.removeAttribute('data-bind');
            }
            attributeValue = node.getAttribute('data-listener');
            if (attributeValue) {
                addListener(node, attributeValue, component);
                node.removeAttribute('data-listener');
            }
            attributeValue = node.getAttribute('data-implements');
            if (attributeValue) {
                addInterface(node, attributeValue, component);
                node.removeAttribute('data-implements');
            }
            attributeValue = node.getAttribute('data-component');
            if (attributeValue) {
                addComponent(node, attributeValue, component);
                node.removeAttribute('data-component');
                ret = false;
            }
            attributeValue = node.getAttribute('data-collection');
            if (attributeValue) {
                addCollection(node, attributeValue, component);
                node.removeAttribute('data-collection');
                ret = false;
            }
            return ret;
        };
        parseNode(mainNode);
        eachChildren(this, mainNode, parseNode);
    };

    var addItem = function (node, attributeValue, component) {
        node.setAttribute('ready','');
        component.add(new Item(node), attributeValue);
    };

    var addBind = function (node, attributeValue, component) {
        var helper = attributeValue.split('|');
        var attributeType = helper[0].split(':')[0];
        var itemName = helper[0].split(':')[1];
        helper = helper[1] || null;
        component.addBinding(node, attributeType, itemName, helper);
        if (!componentBus.get('model:' + itemName + ':change')) {
            component.on('model:' + itemName + ':change', component.modelChange);
        }
    };

    var addListener = function (node, attributeValue, component) {
        var actionList = attributeValue.split(':')[1];
        var callback = component[attributeValue.split(':')[0]];
        component.addListener(node, actionList, callback);
    };

    var addInterface = function (node, attributeValue, component) {
        component.addInterface(node, attributeValue);
    };

    var addComponent = function (node, attributeValue, component) {
        var ComponentClass = components.getPackage(attributeValue) || Component;
        var newComponent = new ComponentClass(node, component.model.get(attributeValue), component.content);
        component.add(newComponent, attributeValue);
        return false;
    };

    var addCollection = function (node, attributeValue, component) {
        var templateName;
        if (attributeValue.indexOf(':') !== -1) {
            templateName = attributeValue.split(':')[0];
            attributeValue = attributeValue.split(':')[1];
        }
        component.add(new Collection(node.parentNode, node, templateName, component.content), attributeValue);
    };

    var eachChildren = function (scope, container, callback) {
        for (var i = 0; i < container.children.length; i++) {
            var child = container.children[i];
            var scanChildren = callback.call(scope, child);
            if (scanChildren && child.children.length > 0) {
                eachChildren(scope, child, callback);
            }
        }
    };

})();