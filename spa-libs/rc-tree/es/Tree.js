import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _typeof from 'babel-runtime/helpers/typeof';
import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import warning from 'warning';
import { traverseTreeNodes, updateCheckState, getOffset, getCheck, getStrictlyValue, isInclude } from './util';

function noop() {}

export var contextTypes = {
  rcTree: PropTypes.shape({
    selectable: PropTypes.bool
  })
};

var Tree = function (_React$Component) {
  _inherits(Tree, _React$Component);

  function Tree(props) {
    _classCallCheck(this, Tree);

    var _this = _possibleConstructorReturn(this, (Tree.__proto__ || Object.getPrototypeOf(Tree)).call(this, props));

    _initialiseProps.call(_this);

    var checkedKeys = _this.calcCheckedKeys(props);
    _this.state = {
      expandedKeys: _this.calcExpandedKeys(props),
      checkedKeys: checkedKeys.checkedKeys,
      halfCheckedKeys: checkedKeys.halfCheckedKeys,
      selectedKeys: _this.calcSelectedKeys(props),
      dragNodesKeys: '',
      dragOverNodeKey: '',
      dropNodeKey: ''
    };
    return _this;
  }

  _createClass(Tree, [{
    key: 'getChildContext',
    value: function getChildContext() {
      var selectable = this.props.selectable;

      return {
        rcTree: {
          selectable: selectable
        }
      };
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var props = this.props;

      var newState = {};
      var expandedKeys = nextProps.expandedKeys !== props.expandedKeys ? this.calcExpandedKeys(nextProps, true) : undefined;
      if (expandedKeys) {
        newState.expandedKeys = expandedKeys;
      }

      var checkedKeys = nextProps.checkedKeys !== props.checkedKeys || props.loadData ? this.calcCheckedKeys(nextProps, true) : undefined;
      if (checkedKeys) {
        newState.checkedKeys = checkedKeys.checkedKeys;
        newState.halfCheckedKeys = checkedKeys.halfCheckedKeys;
      }

      var selectedKeys = nextProps.selectedKeys !== props.selectedKeys ? this.calcSelectedKeys(nextProps, true) : undefined;
      if (selectedKeys) {
        newState.selectedKeys = selectedKeys;
      }
      this.setState(newState);
    }
  }, {
    key: 'onDragStart',
    value: function onDragStart(e, treeNode) {
      this.dragNode = treeNode;
      var newState = {
        dragNodesKeys: this.getDragNodesKeys(treeNode)
      };
      var expandedKeys = this.getExpandedKeys(treeNode, false);
      if (expandedKeys) {
        newState.expandedKeys = expandedKeys;
      }
      this.setState(newState);
      this.props.onDragStart({
        event: e,
        node: treeNode
      });
    }
  }, {
    key: 'onDragEnter',
    value: function onDragEnter(e, treeNode) {
      var _this2 = this;

      var dropPosition = this.calcDropPosition(e, treeNode);
      if (this.dragNode.props.eventKey === treeNode.props.eventKey && dropPosition === 0) {
        this.setState({
          dragOverNodeKey: '',
          dropPosition: null
        });
        return;
      }
      this.setState({
        dragOverNodeKey: treeNode.props.eventKey,
        dropPosition: dropPosition
      });

      if (!this.delayedDragEnterLogic) {
        this.delayedDragEnterLogic = {};
      }
      Object.keys(this.delayedDragEnterLogic).forEach(function (key) {
        clearTimeout(_this2.delayedDragEnterLogic[key]);
      });
      this.delayedDragEnterLogic[treeNode.props.pos] = setTimeout(function () {
        var expandedKeys = _this2.getExpandedKeys(treeNode, true);
        if (expandedKeys) {
          _this2.setState({ expandedKeys: expandedKeys });
        }
        _this2.props.onDragEnter({
          event: e,
          node: treeNode,
          expandedKeys: expandedKeys && [].concat(_toConsumableArray(expandedKeys)) || [].concat(_toConsumableArray(_this2.state.expandedKeys))
        });
      }, 400);
    }
  }, {
    key: 'onDragOver',
    value: function onDragOver(e, treeNode) {
      this.props.onDragOver({ event: e, node: treeNode });
    }
  }, {
    key: 'onDragLeave',
    value: function onDragLeave(e, treeNode) {
      this.props.onDragLeave({ event: e, node: treeNode });
    }
  }, {
    key: 'onDrop',
    value: function onDrop(e, treeNode) {
      var state = this.state;

      var eventKey = treeNode.props.eventKey;
      this.setState({
        dragOverNodeKey: '',
        dropNodeKey: eventKey
      });
      if (state.dragNodesKeys.indexOf(eventKey) > -1) {
        warning(false, 'Can not drop to dragNode(include it\'s children node)');
        return;
      }

      var posArr = treeNode.props.pos.split('-');
      var res = {
        event: e,
        node: treeNode,
        dragNode: this.dragNode,
        dragNodesKeys: [].concat(_toConsumableArray(state.dragNodesKeys)),
        dropPosition: state.dropPosition + Number(posArr[posArr.length - 1])
      };
      if (state.dropPosition !== 0) {
        res.dropToGap = true;
      }
      this.props.onDrop(res);
    }
  }, {
    key: 'onDragEnd',
    value: function onDragEnd(e, treeNode) {
      this.setState({
        dragOverNodeKey: ''
      });
      this.props.onDragEnd({ event: e, node: treeNode });
    }
  }, {
    key: 'onExpand',
    value: function onExpand(treeNode) {
      var _this3 = this;

      var props = this.props,
          state = this.state;

      var expanded = !treeNode.props.expanded;
      var expandedKeys = [].concat(_toConsumableArray(state.expandedKeys));
      var eventKey = treeNode.props.eventKey;

      var index = expandedKeys.indexOf(eventKey);
      if (expanded && index === -1) {
        expandedKeys.push(eventKey);
      } else if (!expanded && index > -1) {
        expandedKeys.splice(index, 1);
      }

      var controlled = 'expandedKeys' in props;
      if (!controlled) {
        this.setState({ expandedKeys: expandedKeys });
      }
      props.onExpand(expandedKeys, { node: treeNode, expanded: expanded });

      // After data loaded, need set new expandedKeys
      if (expanded && props.loadData) {
        return props.loadData(treeNode).then(function () {
          if (!controlled) {
            _this3.setState({ expandedKeys: expandedKeys });
          }
        });
      }
    }
  }, {
    key: 'onSelect',
    value: function onSelect(treeNode) {
      var props = this.props,
          state = this.state;

      var eventKey = treeNode.props.eventKey;
      var selected = !treeNode.props.selected;

      var selectedKeys = [].concat(_toConsumableArray(state.selectedKeys));
      if (!selected) {
        var index = selectedKeys.indexOf(eventKey);
        selectedKeys.splice(index, 1);
      } else if (!props.multiple) {
        selectedKeys = [eventKey];
      } else {
        selectedKeys.push(eventKey);
      }

      // TODO: can be optimized if we remove selectedNodes in API
      var selectedNodes = [];
      if (selectedKeys.length) {
        traverseTreeNodes(props.children, function (item) {
          if (selectedKeys.indexOf(item.key) !== -1) {
            selectedNodes.push(item);
          }
        });
      }

      if (!('selectedKeys' in props)) {
        this.setState({
          selectedKeys: selectedKeys
        });
      }

      var eventObj = {
        event: 'select',
        selected: selected,
        node: treeNode,
        selectedNodes: selectedNodes
      };
      props.onSelect(selectedKeys, eventObj);
    }
  }, {
    key: 'onMouseEnter',
    value: function onMouseEnter(e, treeNode) {
      this.props.onMouseEnter({ event: e, node: treeNode });
    }
  }, {
    key: 'onMouseLeave',
    value: function onMouseLeave(e, treeNode) {
      this.props.onMouseLeave({ event: e, node: treeNode });
    }
  }, {
    key: 'onContextMenu',
    value: function onContextMenu(e, treeNode) {
      if (this.props.onRightClick) {
        e.preventDefault();
        this.props.onRightClick({ event: e, node: treeNode });
      }
    }

    // all keyboard events callbacks run from here at first

  }, {
    key: 'getOpenTransitionName',
    value: function getOpenTransitionName() {
      var props = this.props;
      var transitionName = props.openTransitionName;
      var animationName = props.openAnimation;
      if (!transitionName && typeof animationName === 'string') {
        return props.prefixCls + '-open-' + animationName;
      }
      return transitionName;
    }
  }, {
    key: 'getDragNodesKeys',
    value: function getDragNodesKeys(treeNode) {
      var dragNodesKeys = [];
      var treeNodePosArr = treeNode.props.pos.split('-');
      traverseTreeNodes(treeNode.props.children, function (item, index, pos, key) {
        var childPosArr = pos.split('-');
        if (treeNode.props.pos === pos || treeNodePosArr.length < childPosArr.length && isInclude(treeNodePosArr, childPosArr)) {
          dragNodesKeys.push(key);
        }
      });
      dragNodesKeys.push(treeNode.props.eventKey || treeNode.props.pos);
      return dragNodesKeys;
    }
  }, {
    key: 'getExpandedKeys',
    value: function getExpandedKeys(treeNode, expand) {
      var eventKey = treeNode.props.eventKey;
      var expandedKeys = this.state.expandedKeys;
      var expandedIndex = expandedKeys.indexOf(eventKey);
      if (!expand && expandedIndex > -1) {
        var exKeys = [].concat(_toConsumableArray(expandedKeys));
        exKeys.splice(expandedIndex, 1);
        return exKeys;
      }
      if (expand && expandedKeys.indexOf(eventKey) === -1) {
        return expandedKeys.concat([eventKey]);
      }
    }
  }, {
    key: 'generateTreeNodesStates',
    value: function generateTreeNodesStates(children, checkedKeys) {
      var checkedPositions = [];
      var treeNodesStates = {};
      traverseTreeNodes(children, function (item, _, pos, key, childrenPos, parentPos) {
        treeNodesStates[pos] = {
          node: item,
          key: key,
          checked: false,
          halfChecked: false,
          disabled: item.props.disabled,
          disableCheckbox: item.props.disableCheckbox,
          childrenPos: childrenPos,
          parentPos: parentPos
        };
        if (checkedKeys.indexOf(key) !== -1) {
          treeNodesStates[pos].checked = true;
          checkedPositions.push(pos);
        }
      });
      checkedPositions.forEach(function (checkedPosition) {
        updateCheckState(treeNodesStates, checkedPosition, true);
      });
      return treeNodesStates;
    }
  }, {
    key: 'calcExpandedKeys',
    value: function calcExpandedKeys(props, isNotInit) {
      var expandedKeys = props.expandedKeys || (isNotInit ? undefined : props.defaultExpandedKeys);
      if (!expandedKeys) {
        return undefined;
      }
      var expandAll = isNotInit ? false : props.defaultExpandAll;
      if (!expandAll && !props.autoExpandParent) {
        return expandedKeys;
      }

      var expandedPositionArr = [];
      if (props.autoExpandParent) {
        traverseTreeNodes(props.children, function (item, index, pos, key) {
          if (expandedKeys.indexOf(key) > -1) {
            expandedPositionArr.push(pos);
          }
        });
      }
      var filterExpandedKeysSet = {};
      traverseTreeNodes(props.children, function (item, index, pos, key) {
        if (expandAll) {
          filterExpandedKeysSet[key] = true;
        } else if (props.autoExpandParent) {
          var isCurrentParentOfExpanded = expandedPositionArr.some(function (p) {
            return isInclude(pos.split('-'), p.split('-'));
          });
          if (isCurrentParentOfExpanded) {
            filterExpandedKeysSet[key] = true;
          }
        }
      });
      var filterExpandedKeys = Object.keys(filterExpandedKeysSet);
      return filterExpandedKeys.length ? filterExpandedKeys : expandedKeys;
    }
  }, {
    key: 'calcCheckedKeys',
    value: function calcCheckedKeys(props, isNotInit) {
      if (!props.checkable) {
        return { checkedKeys: [], halfCheckedKeys: [] };
      }

      var checkedKeys = props.checkedKeys || (isNotInit && !props.loadData ? undefined : props.defaultCheckedKeys);
      if (!checkedKeys) {
        return undefined;
      }
      if (Array.isArray(checkedKeys)) {
        checkedKeys = { checkedKeys: checkedKeys, halfCheckedKeys: [] };
      } else if ((typeof checkedKeys === 'undefined' ? 'undefined' : _typeof(checkedKeys)) === 'object') {
        checkedKeys = { checkedKeys: checkedKeys.checked, halfCheckedKeys: checkedKeys.halfChecked };
      }

      if (!props.checkStrictly) {
        var checked = checkedKeys.checkedKeys || [];
        var treeNodesStates = this.generateTreeNodesStates(props.children, checked);
        return getCheck(treeNodesStates);
      }

      return checkedKeys;
    }
  }, {
    key: 'calcSelectedKeys',
    value: function calcSelectedKeys(props, isNotInit) {
      var selectedKeys = props.selectedKeys || (isNotInit ? undefined : props.defaultSelectedKeys);
      if (!selectedKeys) {
        return undefined;
      }
      if (props.multiple) {
        return [].concat(_toConsumableArray(selectedKeys));
      }
      if (selectedKeys.length) {
        return [selectedKeys[0]];
      }
      return selectedKeys;
    }
  }, {
    key: 'calcDropPosition',
    value: function calcDropPosition(e, treeNode) {
      var offsetTop = getOffset(treeNode.selectHandle).top;
      var offsetHeight = treeNode.selectHandle.offsetHeight;
      var pageY = e.pageY;
      var gapHeight = 2; // TODO: remove hard code
      if (pageY > offsetTop + offsetHeight - gapHeight) {
        return 1;
      }
      if (pageY < offsetTop + gapHeight) {
        return -1;
      }
      return 0;
    }
  }, {
    key: 'renderTreeNode',
    value: function renderTreeNode(child, index) {
      var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var state = this.state,
          props = this.props;

      var pos = level + '-' + index;
      var key = child.key || pos;

      var childProps = {
        root: this,
        eventKey: key,
        pos: pos,
        loadData: props.loadData,
        prefixCls: props.prefixCls,
        showIcon: props.showIcon,
        draggable: props.draggable,
        dragOver: state.dragOverNodeKey === key && state.dropPosition === 0,
        dragOverGapTop: state.dragOverNodeKey === key && state.dropPosition === -1,
        dragOverGapBottom: state.dragOverNodeKey === key && state.dropPosition === 1,
        expanded: state.expandedKeys.indexOf(key) !== -1,
        selected: state.selectedKeys.indexOf(key) !== -1,
        openTransitionName: this.getOpenTransitionName(),
        openAnimation: props.openAnimation,
        filterTreeNode: this.filterTreeNode
      };
      if (props.checkable) {
        childProps.checkable = props.checkable;
        childProps.checked = state.checkedKeys.indexOf(key) !== -1;
        childProps.halfChecked = state.halfCheckedKeys.indexOf(key) !== -1;
      }
      return React.cloneElement(child, childProps);
    }
  }, {
    key: 'render',
    value: function render() {
      var props = this.props;
      var className = classNames(props.prefixCls, props.className, _defineProperty({}, props.prefixCls + '-show-line', props.showLine));
      var domProps = {};
      if (props.focusable) {
        domProps.tabIndex = '0';
        domProps.onKeyDown = this.onKeyDown;
      }

      return React.createElement(
        'ul',
        _extends({}, domProps, {
          className: className,
          role: 'tree-node',
          unselectable: 'on'
        }),
        React.Children.map(props.children, this.renderTreeNode, this)
      );
    }
  }]);

  return Tree;
}(React.Component);

Tree.propTypes = {
  prefixCls: PropTypes.string,
  children: PropTypes.any,
  showLine: PropTypes.bool,
  showIcon: PropTypes.bool,
  selectable: PropTypes.bool,
  multiple: PropTypes.bool,
  checkable: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]),
  checkStrictly: PropTypes.bool,
  draggable: PropTypes.bool,
  autoExpandParent: PropTypes.bool,
  defaultExpandAll: PropTypes.bool,
  defaultExpandedKeys: PropTypes.arrayOf(PropTypes.string),
  expandedKeys: PropTypes.arrayOf(PropTypes.string),
  defaultCheckedKeys: PropTypes.arrayOf(PropTypes.string),
  checkedKeys: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.object]),
  defaultSelectedKeys: PropTypes.arrayOf(PropTypes.string),
  selectedKeys: PropTypes.arrayOf(PropTypes.string),
  onExpand: PropTypes.func,
  onCheck: PropTypes.func,
  onSelect: PropTypes.func,
  loadData: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onRightClick: PropTypes.func,
  onDragStart: PropTypes.func,
  onDragEnter: PropTypes.func,
  onDragOver: PropTypes.func,
  onDragLeave: PropTypes.func,
  onDrop: PropTypes.func,
  onDragEnd: PropTypes.func,
  filterTreeNode: PropTypes.func,
  openTransitionName: PropTypes.string,
  openAnimation: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};
Tree.childContextTypes = contextTypes;
Tree.defaultProps = {
  prefixCls: 'rc-tree',
  showLine: false,
  showIcon: true,
  selectable: true,
  multiple: false,
  checkable: false,
  checkStrictly: false,
  draggable: false,
  autoExpandParent: true,
  defaultExpandAll: false,
  defaultExpandedKeys: [],
  defaultCheckedKeys: [],
  defaultSelectedKeys: [],
  onExpand: noop,
  onCheck: noop,
  onSelect: noop,
  onDragStart: noop,
  onDragEnter: noop,
  onDragOver: noop,
  onDragLeave: noop,
  onDrop: noop,
  onDragEnd: noop,
  onMouseEnter: noop,
  onMouseLeave: noop
};

var _initialiseProps = function _initialiseProps() {
  var _this4 = this;

  this.onCheck = function (treeNode) {
    var props = _this4.props,
        state = _this4.state;

    var checked = !treeNode.props.checked || treeNode.props.halfChecked;
    var eventObj = {
      event: 'check',
      node: treeNode,
      checked: checked
    };

    if (props.checkStrictly) {
      var eventKey = treeNode.props.eventKey;
      var checkedKeys = [].concat(_toConsumableArray(state.checkedKeys));
      var index = checkedKeys.indexOf(eventKey);
      if (checked && index === -1) {
        checkedKeys.push(eventKey);
      }
      if (!checked && index > -1) {
        checkedKeys.splice(index, 1);
      }

      eventObj.checkedNodes = [];
      traverseTreeNodes(props.children, function (item) {
        if (checkedKeys.indexOf(item.key) !== -1) {
          eventObj.checkedNodes.push(item);
        }
      });

      if (!('checkedKeys' in props)) {
        _this4.setState({
          checkedKeys: checkedKeys
        });
      }
      props.onCheck(getStrictlyValue(checkedKeys, state.halfCheckedKeys), eventObj);
    } else {
      var treeNodesStates = _this4.generateTreeNodesStates(props.children, state.checkedKeys);
      treeNodesStates[treeNode.props.pos].checked = checked;
      treeNodesStates[treeNode.props.pos].halfChecked = false;
      updateCheckState(treeNodesStates, treeNode.props.pos, checked);

      var checkKeys = getCheck(treeNodesStates);
      eventObj.checkedNodes = checkKeys.checkedNodes;
      eventObj.checkedNodesPositions = checkKeys.checkedNodesPositions; // TODO: not in API
      eventObj.halfCheckedKeys = checkKeys.halfCheckedKeys; // TODO: not in API

      if (!('checkedKeys' in props)) {
        _this4.setState({
          checkedKeys: checkKeys.checkedKeys,
          halfCheckedKeys: checkKeys.halfCheckedKeys
        });
      }
      props.onCheck(checkKeys.checkedKeys, eventObj);
    }
  };

  this.onKeyDown = function (e) {
    e.preventDefault();
  };

  this.filterTreeNode = function (treeNode) {
    var filterTreeNode = _this4.props.filterTreeNode;
    if (typeof filterTreeNode !== 'function' || treeNode.props.disabled) {
      return false;
    }
    return filterTreeNode.call(_this4, treeNode);
  };
};

export default Tree;