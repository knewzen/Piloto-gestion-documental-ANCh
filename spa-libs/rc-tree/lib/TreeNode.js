'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _rcAnimate = require('rc-animate');

var _rcAnimate2 = _interopRequireDefault(_rcAnimate);

var _toArray = require('rc-util/lib/Children/toArray');

var _toArray2 = _interopRequireDefault(_toArray);

var _Tree = require('./Tree');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var defaultTitle = '---';

var TreeNode = function (_React$Component) {
  (0, _inherits3['default'])(TreeNode, _React$Component);

  function TreeNode(props) {
    (0, _classCallCheck3['default'])(this, TreeNode);

    var _this = (0, _possibleConstructorReturn3['default'])(this, (TreeNode.__proto__ || Object.getPrototypeOf(TreeNode)).call(this, props));

    _this.onCheck = function () {
      _this.props.root.onCheck(_this);
    };

    _this.onMouseEnter = function (e) {
      e.preventDefault();
      _this.props.root.onMouseEnter(e, _this);
    };

    _this.onMouseLeave = function (e) {
      e.preventDefault();
      _this.props.root.onMouseLeave(e, _this);
    };

    _this.onContextMenu = function (e) {
      _this.props.root.onContextMenu(e, _this);
    };

    _this.onDragStart = function (e) {
      e.stopPropagation();
      _this.setState({
        dragNodeHighlight: true
      });
      _this.props.root.onDragStart(e, _this);
      try {
        // ie throw error
        // firefox-need-it
        e.dataTransfer.setData('text/plain', '');
      } catch (error) {
        // empty
      }
    };

    _this.onDragEnter = function (e) {
      e.preventDefault();
      e.stopPropagation();
      _this.props.root.onDragEnter(e, _this);
    };

    _this.onDragOver = function (e) {
      e.preventDefault();
      e.stopPropagation();
      _this.props.root.onDragOver(e, _this);
    };

    _this.onDragLeave = function (e) {
      e.stopPropagation();
      _this.props.root.onDragLeave(e, _this);
    };

    _this.onDrop = function (e) {
      e.preventDefault();
      e.stopPropagation();
      _this.setState({
        dragNodeHighlight: false
      });
      _this.props.root.onDrop(e, _this);
    };

    _this.onDragEnd = function (e) {
      e.stopPropagation();
      _this.setState({
        dragNodeHighlight: false
      });
      _this.props.root.onDragEnd(e, _this);
    };

    _this.onExpand = function () {
      var callbackPromise = _this.props.root.onExpand(_this);
      if (callbackPromise && (typeof callbackPromise === 'undefined' ? 'undefined' : (0, _typeof3['default'])(callbackPromise)) === 'object') {
        var setLoading = function setLoading(dataLoading) {
          _this.setState({ dataLoading: dataLoading });
        };
        setLoading(true);
        callbackPromise.then(function () {
          setLoading(false);
        }, function () {
          setLoading(false);
        });
      }
    };

    _this.saveSelectHandle = function (node) {
      _this.selectHandle = node;
    };

    _this.state = {
      dataLoading: false,
      dragNodeHighlight: false
    };
    return _this;
  }

  (0, _createClass3['default'])(TreeNode, [{
    key: 'onSelect',
    value: function onSelect() {
      this.props.root.onSelect(this);
    }
  }, {
    key: 'onKeyDown',


    // keyboard event support
    value: function onKeyDown(e) {
      e.preventDefault();
    }
  }, {
    key: 'isSelectable',
    value: function isSelectable() {
      var props = this.props,
          context = this.context;

      return 'selectable' in props ? props.selectable : context.rcTree.selectable;
    }
  }, {
    key: 'renderSwitcher',
    value: function renderSwitcher(props, expandedState) {
      var prefixCls = props.prefixCls;
      var switcherCls = (0, _classnames2['default'])(prefixCls + '-switcher', prefixCls + '-switcher_' + expandedState, (0, _defineProperty3['default'])({}, prefixCls + '-switcher-disabled', props.disabled));
      return _react2['default'].createElement('span', { className: switcherCls, onClick: props.disabled ? null : this.onExpand });
    }
  }, {
    key: 'renderCheckbox',
    value: function renderCheckbox(props) {
      var prefixCls = props.prefixCls;
      var checkboxCls = (0, _defineProperty3['default'])({}, prefixCls + '-checkbox', true);
      if (props.checked) {
        checkboxCls[prefixCls + '-checkbox-checked'] = true;
      } else if (props.halfChecked) {
        checkboxCls[prefixCls + '-checkbox-indeterminate'] = true;
      }
      var customEle = null;
      if (typeof props.checkable !== 'boolean') {
        customEle = props.checkable;
      }
      if (props.disabled || props.disableCheckbox) {
        checkboxCls[prefixCls + '-checkbox-disabled'] = true;
        return _react2['default'].createElement(
          'span',
          { className: (0, _classnames2['default'])(checkboxCls) },
          customEle
        );
      }
      return _react2['default'].createElement(
        'span',
        {
          className: (0, _classnames2['default'])(checkboxCls),
          onClick: this.onCheck
        },
        customEle
      );
    }
  }, {
    key: 'renderChildren',
    value: function renderChildren(props) {
      var renderFirst = this.renderFirst;
      this.renderFirst = 1;
      var transitionAppear = true;
      if (!renderFirst && props.expanded) {
        transitionAppear = false;
      }
      var children = null;
      if (props.children) {
        children = (0, _toArray2['default'])(props.children).filter(function (item) {
          return !!item;
        });
      }
      var newChildren = children;
      if (children && (Array.isArray(children) && children.length && children.every(function (item) {
        return item.type && item.type.isTreeNode;
      }) || children.type && children.type.isTreeNode)) {
        var animProps = {};
        if (props.openTransitionName) {
          animProps.transitionName = props.openTransitionName;
        } else if ((0, _typeof3['default'])(props.openAnimation) === 'object') {
          animProps.animation = (0, _extends3['default'])({}, props.openAnimation);
          if (!transitionAppear) {
            delete animProps.animation.appear;
          }
        }
        var cls = (0, _classnames2['default'])(props.prefixCls + '-child-tree', (0, _defineProperty3['default'])({}, props.prefixCls + '-child-tree-open', props.expanded));
        newChildren = _react2['default'].createElement(
          _rcAnimate2['default'],
          (0, _extends3['default'])({}, animProps, {
            showProp: 'data-expanded',
            transitionAppear: transitionAppear,
            component: ''
          }),
          !props.expanded ? null : _react2['default'].createElement(
            'ul',
            { className: cls, 'data-expanded': props.expanded },
            _react2['default'].Children.map(children, function (item, index) {
              return props.root.renderTreeNode(item, index, props.pos);
            }, props.root)
          )
        );
      }
      return newChildren;
    }
  }, {
    key: 'render',
    value: function render() {
      var _iconEleCls,
          _this2 = this;

      var props = this.props;

      var prefixCls = props.prefixCls;
      var expandedState = props.expanded ? 'open' : 'close';
      var iconState = expandedState;

      var canRenderSwitcher = true;
      var content = props.title;
      var newChildren = this.renderChildren(props);
      if (!newChildren || newChildren === props.children) {
        // content = newChildren;
        newChildren = null;
        if (!props.loadData || props.isLeaf) {
          canRenderSwitcher = false;
          iconState = 'docu';
        }
      }
      // For performance, does't render children into dom when `!props.expanded` (move to Animate)
      // if (!props.expanded) {
      //   newChildren = null;
      // }

      var iconEleCls = (_iconEleCls = {}, (0, _defineProperty3['default'])(_iconEleCls, prefixCls + '-iconEle', true), (0, _defineProperty3['default'])(_iconEleCls, prefixCls + '-icon_loading', this.state.dataLoading), (0, _defineProperty3['default'])(_iconEleCls, prefixCls + '-icon__' + iconState, true), _iconEleCls);

      var selectHandle = function selectHandle() {
        var icon = props.showIcon || props.loadData && _this2.state.dataLoading ? _react2['default'].createElement('span', { className: (0, _classnames2['default'])(iconEleCls) }) : null;
        var title = _react2['default'].createElement(
          'span',
          { className: prefixCls + '-title' },
          content
        );
        var wrap = prefixCls + '-node-content-wrapper';
        var domProps = {
          className: wrap + ' ' + wrap + '-' + (iconState === expandedState ? iconState : 'normal'),
          onMouseEnter: _this2.onMouseEnter,
          onMouseLeave: _this2.onMouseLeave,
          onContextMenu: _this2.onContextMenu
        };
        if (!props.disabled) {
          if (props.selected || _this2.state.dragNodeHighlight) {
            domProps.className += ' ' + prefixCls + '-node-selected';
          }
          domProps.onClick = function (e) {
            e.preventDefault();
            if (_this2.isSelectable()) {
              _this2.onSelect();
            } else if (props.checkable && !props.disableCheckbox) {
              // && !props.disabled is checked on line 259
              _this2.onCheck();
            }
          };
          if (props.draggable) {
            domProps.className += ' draggable';
            domProps.draggable = true;
            domProps['aria-grabbed'] = true;
            domProps.onDragStart = _this2.onDragStart;
          }
        }
        return _react2['default'].createElement(
          'span',
          (0, _extends3['default'])({
            ref: _this2.saveSelectHandle,
            title: typeof content === 'string' ? content : ''
          }, domProps),
          icon,
          title
        );
      };

      var liProps = {};
      if (props.draggable) {
        liProps.onDragEnter = this.onDragEnter;
        liProps.onDragOver = this.onDragOver;
        liProps.onDragLeave = this.onDragLeave;
        liProps.onDrop = this.onDrop;
        liProps.onDragEnd = this.onDragEnd;
      }

      var disabledCls = '';
      var dragOverCls = '';
      if (props.disabled) {
        disabledCls = prefixCls + '-treenode-disabled';
      } else if (props.dragOver) {
        dragOverCls = 'drag-over';
      } else if (props.dragOverGapTop) {
        dragOverCls = 'drag-over-gap-top';
      } else if (props.dragOverGapBottom) {
        dragOverCls = 'drag-over-gap-bottom';
      }

      var filterCls = props.filterTreeNode(this) ? 'filter-node' : '';

      var renderNoopSwitcher = function renderNoopSwitcher() {
        return _react2['default'].createElement('span', { className: prefixCls + '-switcher ' + prefixCls + '-switcher-noop' });
      };

      return _react2['default'].createElement(
        'li',
        (0, _extends3['default'])({}, liProps, {
          className: (0, _classnames2['default'])(props.className, disabledCls, dragOverCls, filterCls)
        }),
        canRenderSwitcher ? this.renderSwitcher(props, expandedState) : renderNoopSwitcher(),
        props.checkable ? this.renderCheckbox(props) : null,
        selectHandle(),
        newChildren
      );
    }
  }]);
  return TreeNode;
}(_react2['default'].Component);

TreeNode.propTypes = {
  prefixCls: _propTypes2['default'].string,
  disabled: _propTypes2['default'].bool,
  disableCheckbox: _propTypes2['default'].bool,
  expanded: _propTypes2['default'].bool,
  isLeaf: _propTypes2['default'].bool,
  root: _propTypes2['default'].object,
  onSelect: _propTypes2['default'].func
};
TreeNode.contextTypes = _Tree.contextTypes;
TreeNode.defaultProps = {
  title: defaultTitle
};


TreeNode.isTreeNode = 1;

exports['default'] = TreeNode;
module.exports = exports['default'];