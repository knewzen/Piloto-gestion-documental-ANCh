import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _typeof from 'babel-runtime/helpers/typeof';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Animate from 'rc-animate';
import toArray from 'rc-util/es/Children/toArray';
import { contextTypes } from './Tree';

var defaultTitle = '---';

var TreeNode = function (_React$Component) {
  _inherits(TreeNode, _React$Component);

  function TreeNode(props) {
    _classCallCheck(this, TreeNode);

    var _this = _possibleConstructorReturn(this, (TreeNode.__proto__ || Object.getPrototypeOf(TreeNode)).call(this, props));

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
                        e.dataTransfer.setData('text/plain', '');
      } catch (error) {
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
      if (callbackPromise && (typeof callbackPromise === 'undefined' ? 'undefined' : _typeof(callbackPromise)) === 'object') {
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

  _createClass(TreeNode, [{
    key: 'onSelect',
    value: function onSelect() {
      this.props.root.onSelect(this);
    }
  }, {
    key: 'onKeyDown',


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
      var switcherCls = classNames(prefixCls + '-switcher', prefixCls + '-switcher_' + expandedState, _defineProperty({}, prefixCls + '-switcher-disabled', props.disabled));
      return React.createElement('span', { className: switcherCls, onClick: props.disabled ? null : this.onExpand });
    }
  }, {
    key: 'renderCheckbox',
    value: function renderCheckbox(props) {
      var prefixCls = props.prefixCls;
      var checkboxCls = _defineProperty({}, prefixCls + '-checkbox', true);
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
        return React.createElement(
          'span',
          { className: classNames(checkboxCls) },
          customEle
        );
      }
      return React.createElement(
        'span',
        {
          className: classNames(checkboxCls),
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
        children = toArray(props.children).filter(function (item) {
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
        } else if (_typeof(props.openAnimation) === 'object') {
          animProps.animation = _extends({}, props.openAnimation);
          if (!transitionAppear) {
            delete animProps.animation.appear;
          }
        }
        var cls = classNames(props.prefixCls + '-child-tree', _defineProperty({}, props.prefixCls + '-child-tree-open', props.expanded));
        newChildren = React.createElement(
          Animate,
          _extends({}, animProps, {
            showProp: 'data-expanded',
            transitionAppear: transitionAppear,
            component: ''
          }),
          !props.expanded ? null : React.createElement(
            'ul',
            { className: cls, 'data-expanded': props.expanded },
            React.Children.map(children, function (item, index) {
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
                newChildren = null;
        if (!props.loadData || props.isLeaf) {
          canRenderSwitcher = false;
          iconState = 'docu';
        }
      }
                        
      var iconEleCls = (_iconEleCls = {}, _defineProperty(_iconEleCls, prefixCls + '-iconEle', true), _defineProperty(_iconEleCls, prefixCls + '-icon_loading', this.state.dataLoading), _defineProperty(_iconEleCls, prefixCls + '-icon__' + iconState, true), _iconEleCls);

      var selectHandle = function selectHandle() {
        var icon = props.showIcon || props.loadData && _this2.state.dataLoading ? React.createElement('span', { className: classNames(iconEleCls) }) : null;
        var title = React.createElement(
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
        return React.createElement(
          'span',
          _extends({
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
        return React.createElement('span', { className: prefixCls + '-switcher ' + prefixCls + '-switcher-noop' });
      };

      return React.createElement(
        'li',
        _extends({}, liProps, {
          className: classNames(props.className, disabledCls, dragOverCls, filterCls)
        }),
        canRenderSwitcher ? this.renderSwitcher(props, expandedState) : renderNoopSwitcher(),
        props.checkable ? this.renderCheckbox(props) : null,
        selectHandle(),
        newChildren
      );
    }
  }]);

  return TreeNode;
}(React.Component);

TreeNode.propTypes = {
  prefixCls: PropTypes.string,
  disabled: PropTypes.bool,
  disableCheckbox: PropTypes.bool,
  expanded: PropTypes.bool,
  isLeaf: PropTypes.bool,
  root: PropTypes.object,
  onSelect: PropTypes.func
};
TreeNode.contextTypes = contextTypes;
TreeNode.defaultProps = {
  title: defaultTitle
};


TreeNode.isTreeNode = 1;

export default TreeNode;