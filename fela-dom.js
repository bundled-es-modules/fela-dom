function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var objectEach_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = objectEach;
function objectEach(obj, iterator) {
  for (var key in obj) {
    iterator(obj[key], key, obj);
  }
}
});

var objectEach = unwrapExports(objectEach_1);

var arrayReduce_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = arrayReduce;
function arrayReduce(arr, reducer, initialValue) {
  for (var i = 0, len = arr.length; i < len; ++i) {
    initialValue = reducer(initialValue, arr[i], i, len, arr);
  }

  return initialValue;
}
});

var arrayReduce = unwrapExports(arrayReduce_1);

function applyKeysInOrder(order) {
  var initialValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  return arrayReduce(order, function (mediaMap, query) {
    mediaMap[query] = initialValue;
    return mediaMap;
  }, {});
}

var objectReduce = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = objectReducer;
function objectReducer(obj, reducer, initialValue) {
  for (var key in obj) {
    initialValue = reducer(initialValue, obj[key], key, obj);
  }

  return initialValue;
}
});

var objectReduce$1 = unwrapExports(objectReduce);

function generateCSSRule(selector, cssDeclaration) {
  return selector + "{" + cssDeclaration + "}";
}

function sortCache(cache, sort) {
  var sortedKeys = Object.keys(cache).sort(function (left, right) {
    return sort(cache[left], cache[right]);
  });

  return arrayReduce(sortedKeys, function (sortedCache, key) {
    sortedCache[key] = cache[key];
    return sortedCache;
  }, {});
}

function getRuleScore() {
  var ruleOrder = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var pseudo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  if (ruleOrder.length === 0 || pseudo.length === 0) {
    return 0;
  }

  return ruleOrder.indexOf(ruleOrder.find(function (regex) {
    return pseudo.match(regex) !== null;
  })) + 1;
}

var RULE_TYPE = 'RULE';
var KEYFRAME_TYPE = 'KEYFRAME';
var FONT_TYPE = 'FONT';
var STATIC_TYPE = 'STATIC';
var CLEAR_TYPE = 'CLEAR';

var _handlers;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var handlers = (_handlers = {}, _defineProperty(_handlers, RULE_TYPE, function (cluster, _ref) {
  var selector = _ref.selector,
      declaration = _ref.declaration,
      support = _ref.support,
      media = _ref.media;

  var cssRule = generateCSSRule(selector, declaration);

  if (support) {
    if (media) {
      if (!cluster.supportMediaRules[media]) {
        cluster.supportMediaRules[media] = {};
      }

      if (!cluster.supportMediaRules[media][support]) {
        cluster.supportMediaRules[media][support] = '';
      }

      cluster.supportMediaRules[media][support] += cssRule;
    } else {
      if (!cluster.supportRules[support]) {
        cluster.supportRules[support] = '';
      }

      cluster.supportRules[support] += cssRule;
    }
  } else {
    if (media) {
      if (!cluster.mediaRules[media]) {
        cluster.mediaRules[media] = '';
      }

      cluster.mediaRules[media] += cssRule;
    } else {
      cluster.rules += cssRule;
    }
  }
}), _defineProperty(_handlers, FONT_TYPE, function (cluster, _ref2) {
  var fontFace = _ref2.fontFace;

  cluster.fontFaces += fontFace;
}), _defineProperty(_handlers, KEYFRAME_TYPE, function (cluster, _ref3) {
  var keyframe = _ref3.keyframe;

  cluster.keyframes += keyframe;
}), _defineProperty(_handlers, STATIC_TYPE, function (cluster, _ref4) {
  var css = _ref4.css,
      selector = _ref4.selector;

  if (selector) {
    cluster.statics += generateCSSRule(selector, css);
  } else {
    cluster.statics += css;
  }
}), _handlers);

function clusterCache(cache) {
  var mediaQueryOrder = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var supportQueryOrder = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var ruleOrder = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

  var sortedCache = sortCache(cache, function (left, right) {
    var leftScore = getRuleScore(ruleOrder, left.pseudo);
    var rightScore = getRuleScore(ruleOrder, right.pseudo);

    if (leftScore > rightScore) {
      return 1;
    }

    if (rightScore > leftScore) {
      return -1;
    }

    return 0;
  });

  var mediaRules = applyKeysInOrder(mediaQueryOrder);
  var supportRules = applyKeysInOrder(supportQueryOrder);

  var supportMediaRules = arrayReduce(mediaQueryOrder, function (supportRules, media) {
    supportRules[media] = applyKeysInOrder(supportQueryOrder);
    return supportRules;
  }, applyKeysInOrder(mediaQueryOrder, {}));

  return objectReduce$1(sortedCache, function (cluster, entry, key) {
    var handler = handlers[entry.type];

    if (handler) {
      handler(cluster, entry);
    }

    return cluster;
  }, {
    mediaRules: mediaRules,
    supportRules: supportRules,
    supportMediaRules: supportMediaRules,
    fontFaces: '',
    statics: '',
    keyframes: '',
    rules: ''
  });
}

function generateCSSSupportRule(support, cssRules) {
  return "@supports " + support + "{" + cssRules + "}";
}

function cssifySupportRules(supportRules) {
  return objectReduce$1(supportRules, function (css, cssRules, support) {
    if (cssRules.length > 0) {
      css += generateCSSSupportRule(support, cssRules);
    }

    return css;
  }, '');
}

function generateCSSSelector(className) {
  var pseudo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  return '.' + className + pseudo;
}

var sheetMap = {
  fontFaces: FONT_TYPE,
  statics: STATIC_TYPE,
  keyframes: KEYFRAME_TYPE,
  rules: RULE_TYPE
};

function getDocumentHead() {
  return document.head || {};
}

function createDOMNode(type, anchorNode) {
  var media = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var support = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  var head = getDocumentHead();

  var node = document.createElement('style');
  node.setAttribute('data-fela-type', type);
  node.type = 'text/css';

  if (support) {
    node.setAttribute('data-fela-support', 'true');
  }

  if (media.length > 0) {
    node.media = media;
  }

  var parentNode = anchorNode ? anchorNode.parentNode : head;

  if (support || media.length > 0) {
    parentNode.appendChild(node);
  } else if (anchorNode) {
    parentNode.insertBefore(node, anchorNode);
  } else {
    parentNode.appendChild(node);
  }

  return node;
}

function getDOMNode(nodes, baseNode, type) {
  var media = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  var support = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

  var key = type + media + (support ? 'support' : '');

  if (!nodes.hasOwnProperty(key)) {
    nodes[key] = createDOMNode(type, baseNode, media, support);
  }

  return nodes[key];
}

function generateRule(selector, declaration) {
  var support = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

  var rule = generateCSSRule(selector, declaration);

  if (support.length > 0) {
    return generateCSSSupportRule(support, rule);
  }

  return rule;
}

var _changeHandlers;

function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var changeHandlers = (_changeHandlers = {}, _defineProperty$1(_changeHandlers, RULE_TYPE, function (node, _ref) {
  var selector = _ref.selector,
      declaration = _ref.declaration,
      support = _ref.support;

  var cssRule = generateRule(selector, declaration, support);

  // only use insertRule in production as browser devtools might have
  // weird behavior if used together with insertRule at runtime
  {
    node.textContent += cssRule;
    return;
  }

  try {
    node.sheet.insertRule(cssRule, node.sheet.cssRules.length);
  } catch (e) {
    // TODO: warning?
  }
}), _defineProperty$1(_changeHandlers, KEYFRAME_TYPE, function (node, _ref2) {
  var keyframe = _ref2.keyframe;

  node.textContent += keyframe;
}), _defineProperty$1(_changeHandlers, FONT_TYPE, function (node, _ref3) {
  var fontFace = _ref3.fontFace;

  node.textContent += fontFace;
}), _defineProperty$1(_changeHandlers, STATIC_TYPE, function (node, _ref4) {
  var selector = _ref4.selector,
      css = _ref4.css;

  if (selector) {
    node.textContent += generateCSSRule(selector, css);
  } else {
    node.textContent += css;
  }
}), _changeHandlers);

function createDOMSubscription(nodes) {
  var baseNode = nodes[RULE_TYPE];

  return function changeSubscription(change) {
    if (change.type === CLEAR_TYPE) {
      return objectEach(nodes, function (node) {
        node.textContent = '';
      });
    }

    var handleChange = changeHandlers[change.type];

    if (handleChange) {
      var node = getDOMNode(nodes, baseNode, change.type, change.media, !!change.support);

      handleChange(node, change);
    }
  };
}

var arrayEach_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = arrayEach;
function arrayEach(arr, iterator) {
  for (var i = 0, len = arr.length; i < len; ++i) {
    iterator(arr[i], i, len, arr);
  }
}
});

var arrayEach = unwrapExports(arrayEach_1);

function initDOMNode(nodes, baseNode, css, type) {
  var media = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';
  var support = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

  var node = getDOMNode(nodes, baseNode, type, media, support);
  // in case that there is a node coming from server already
  // but rules are not matchnig
  if (node.textContent !== css) {
    node.textContent = css;
  }
}

function findDOMNodes() {
  return arrayReduce(document.querySelectorAll('[data-fela-type]'), function (nodes, node) {
    var type = node.getAttribute('data-fela-type') || '';
    var media = node.getAttribute('media') || '';
    var support = node.getAttribute('support') ? 'support' : '';

    nodes[type + media + support] = node;
    return nodes;
  }, {});
}

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function connectDOMNodes(renderer) {
  renderer.nodes = findDOMNodes();

  var cacheCluster = clusterCache(renderer.cache, renderer.mediaQueryOrder, renderer.supportQueryOrder);

  var baseNode = renderer.nodes[RULE_TYPE];

  objectEach(sheetMap, function (type, key) {
    if (cacheCluster[key].length > 0) {
      initDOMNode(renderer.nodes, baseNode, cacheCluster[key], type);
    }
  });

  var support = cssifySupportRules(cacheCluster.supportRules);

  if (support) {
    initDOMNode(renderer.nodes, baseNode, support, RULE_TYPE, '', true);
  }

  var mediaKeys = Object.keys(_extends({}, cacheCluster.supportMediaRules, cacheCluster.mediaRules));

  arrayEach(mediaKeys, function (media) {
    if (cacheCluster.mediaRules[media] && cacheCluster.mediaRules[media].length > 0) {
      initDOMNode(renderer.nodes, baseNode, cacheCluster.mediaRules[media], RULE_TYPE, media);
    }

    if (cacheCluster.supportMediaRules[media]) {
      var mediaSupport = cssifySupportRules(cacheCluster.supportMediaRules[media]);

      if (mediaSupport.length > 0) {
        initDOMNode(renderer.nodes, baseNode, mediaSupport, RULE_TYPE, media, true);
      }
    }
  });
}

function render(renderer) {
  if (!renderer.updateSubscription) {
    connectDOMNodes(renderer);

    renderer.updateSubscription = createDOMSubscription(renderer.nodes);
    renderer.subscribe(renderer.updateSubscription);
  }
}

function extractSupportQuery(ruleSet) {
  return ruleSet.split('{')[0].slice(9).trim();
}

function generateCacheEntry(type, className, property, value) {
  var pseudo = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';
  var media = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '';
  var support = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : '';

  return {
    type: type,
    className: className,
    selector: generateCSSSelector(className, pseudo),
    declaration: property + ':' + value,
    pseudo: pseudo,
    media: media,
    support: support
  };
}

var camelCaseProperty_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = camelCaseProperty;
var dashRegex = /-([a-z])/g;
var msRegex = /^Ms/g;

function camelCaseProperty(property) {
  return property.replace(dashRegex, function (match) {
    return match[1].toUpperCase();
  }).replace(msRegex, 'ms');
}
module.exports = exports['default'];
});

var camelCaseProperty = unwrapExports(camelCaseProperty_1);

function generateDeclarationReference(property, value) {
  var pseudo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var media = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  var support = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';

  return support + media + pseudo + camelCaseProperty(property) + value;
}

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var DECL_REGEX = /[.]([0-9a-z_-]+)([^{]+)?{([^:]+):([^}]+)}/gi;

function rehydrateRules(css) {
  var media = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var support = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var cache = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var decl = void 0;

  // This excellent parsing implementation was originally taken from Styletron and modified to fit Fela
  // https://github.com/rtsao/styletron/blob/master/packages/styletron-client/src/index.js#L47
  /* eslint-disable no-unused-vars,no-cond-assign */
  while (decl = DECL_REGEX.exec(css)) {
    // $FlowFixMe
    var _decl = decl,
        _decl2 = _slicedToArray(_decl, 5),
        ruleSet = _decl2[0],
        className = _decl2[1],
        pseudo = _decl2[2],
        property = _decl2[3],
        value = _decl2[4];
    /* eslint-enable */

    var declarationReference = generateDeclarationReference(property, value, pseudo, media, support);

    cache[declarationReference] = generateCacheEntry(RULE_TYPE, className, property, value, pseudo, media, support);
  }

  return cache;
}

var _slicedToArray$1 = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var SUPPORT_REGEX = /@supports[^{]+\{([\s\S]+?})\s*}/gi;

function rehydrateSupportRules(css) {
  var media = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var cache = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var decl = void 0;

  while (decl = SUPPORT_REGEX.exec(css)) {
    var _decl = decl,
        _decl2 = _slicedToArray$1(_decl, 2),
        ruleSet = _decl2[0],
        cssRules = _decl2[1];

    var supportQuery = extractSupportQuery(ruleSet);
    rehydrateRules(cssRules, media, supportQuery, cache);
  }

  return cache;
}

// rehydration (WIP)
// TODO: static, keyframe, font
function rehydrate(renderer) {
  arrayEach(document.querySelectorAll('[data-fela-type]'), function (node) {
    var rehydrationAttribute = node.getAttribute('data-fela-rehydration') || -1;
    var rehydrationIndex = renderer.uniqueRuleIdentifier || parseInt(rehydrationAttribute, 10);

    // skip rehydration if no rehydration index is set
    // this index is set to -1 if something blocks rehydration
    if (rehydrationIndex !== -1) {
      var type = node.getAttribute('data-fela-type') || '';
      var media = node.getAttribute('media') || '';
      var support = node.getAttribute('data-fela-support');
      var css = node.textContent;

      renderer.uniqueRuleIdentifier = rehydrationIndex;

      if (type === RULE_TYPE) {
        if (support) {
          rehydrateSupportRules(css, media, renderer.cache);
        } else {
          rehydrateRules(css, media, '', renderer.cache);
        }
      }
    }
  });

  renderer._emitChange({ type: 'REHYDRATATION_FINISHED' });
}

function createStyleMarkup(css, type) {
  var media = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var rehydrationIndex = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : -1;
  var support = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

  var mediaAttribute = media.length > 0 ? ' media="' + media + '"' : '';
  var supportAttribute = support ? ' data-fela-support="true"' : '';

  return '<style type="text/css" data-fela-rehydration="' + rehydrationIndex + '" data-fela-type="' + type + '"' + supportAttribute + mediaAttribute + '>' + css + '</style>';
}

var SELECTOR_PREFIX_REGEXP = /^[a-z0-9_-]*$/gi;


function getRehydrationIndex(renderer) {
  if (renderer.selectorPrefix.length === 0 || renderer.selectorPrefix.match(SELECTOR_PREFIX_REGEXP) !== null) {
    return renderer.uniqueRuleIdentifier;
  }

  return -1;
}

var _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function renderToMarkup(renderer) {
  var cacheCluster = clusterCache(renderer.cache, renderer.mediaQueryOrder, renderer.supportQueryOrder);

  var rehydrationIndex = getRehydrationIndex(renderer);

  var styleMarkup = objectReduce$1(sheetMap, function (markup, type, key) {
    if (cacheCluster[key].length > 0) {
      markup += createStyleMarkup(cacheCluster[key], type, '', rehydrationIndex);
    }

    return markup;
  }, '');

  var support = cssifySupportRules(cacheCluster.supportRules);

  if (support) {
    styleMarkup += createStyleMarkup(support, RULE_TYPE, '', rehydrationIndex, true);
  }

  var mediaKeys = Object.keys(_extends$1({}, cacheCluster.supportMediaRules, cacheCluster.mediaRules));

  return arrayReduce(mediaKeys, function (markup, media) {
    // basic media query rules
    if (cacheCluster.mediaRules[media] && cacheCluster.mediaRules[media].length > 0) {
      markup += createStyleMarkup(cacheCluster.mediaRules[media], RULE_TYPE, media, rehydrationIndex);
    }

    // support media rules
    if (cacheCluster.supportMediaRules[media]) {
      var mediaSupport = cssifySupportRules(cacheCluster.supportMediaRules[media]);

      if (mediaSupport.length > 0) {
        markup += createStyleMarkup(mediaSupport, RULE_TYPE, media, rehydrationIndex, true);
      }
    }

    return markup;
  }, styleMarkup);
}

var _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function renderToSheetList(renderer) {
  var cacheCluster = clusterCache(renderer.cache, renderer.mediaQueryOrder, renderer.supportQueryOrder);

  var rehydrationIndex = getRehydrationIndex(renderer);

  var sheetList = objectReduce$1(sheetMap, function (list, type, key) {
    if (cacheCluster[key].length > 0) {
      list.push({
        css: cacheCluster[key],
        rehydration: rehydrationIndex,
        type: type
      });
    }

    return list;
  }, []);

  var support = cssifySupportRules(cacheCluster.supportRules);

  if (support) {
    sheetList.push({
      css: support,
      type: RULE_TYPE,
      rehydration: rehydrationIndex,
      support: true
    });
  }

  var mediaKeys = Object.keys(_extends$2({}, cacheCluster.supportMediaRules, cacheCluster.mediaRules));

  return arrayReduce(mediaKeys, function (list, media) {
    // basic media query rules
    if (cacheCluster.mediaRules[media] && cacheCluster.mediaRules[media].length > 0) {
      list.push({
        css: cacheCluster.mediaRules[media],
        type: RULE_TYPE,
        rehydration: rehydrationIndex,
        media: media
      });
    }

    // support media rules
    if (cacheCluster.supportMediaRules[media]) {
      var mediaSupport = cssifySupportRules(cacheCluster.supportMediaRules[media]);

      if (mediaSupport.length > 0) {
        list.push({
          css: mediaSupport,
          type: RULE_TYPE,
          rehydration: rehydrationIndex,
          support: true,
          media: media
        });
      }
    }

    return list;
  }, sheetList);
}

export { render, rehydrate, renderToMarkup, renderToSheetList };
