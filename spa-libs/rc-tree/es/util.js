/* eslint no-loop-func: 0*/
import { Children } from 'react';

export function getOffset(ele) {
  if (!ele.getClientRects().length) {
    return { top: 0, left: 0 };
  }

  var rect = ele.getBoundingClientRect();
  if (rect.width || rect.height) {
    var doc = ele.ownerDocument;
    var win = doc.defaultView;
    var docElem = doc.documentElement;

    return {
      top: rect.top + win.pageYOffset - docElem.clientTop,
      left: rect.left + win.pageXOffset - docElem.clientLeft
    };
  }

  return rect;
}

export function traverseTreeNodes(treeNodes, callback) {
  var traverse = function traverse(subTreeNodes, level, parentsChildrenPos, parentPos) {
    if (Array.isArray(subTreeNodes)) {
      subTreeNodes = subTreeNodes.filter(function (item) {
        return !!item;
      });
    }
    Children.forEach(subTreeNodes, function (item, index) {
      var pos = level + '-' + index;
      parentsChildrenPos.push(pos); // Note: side effect

      var childrenPos = [];
      if (item.props.children && item.type && item.type.isTreeNode) {
        traverse(item.props.children, pos, childrenPos, pos);
      }
      callback(item, index, pos, item.key || pos, childrenPos, parentPos);
    });
  };
  traverse(treeNodes, 0, []);
}

export function updateCheckState(obj, checkedPosition, checkIt) {
  var childrenLoop = function childrenLoop(parentObj) {
    parentObj.childrenPos.forEach(function (childPos) {
      var childObj = obj[childPos];
      // User click don't change disabled item checked state
      if (!childObj.disableCheckbox && !childObj.disabled) {
        childObj.halfChecked = false;
        childObj.checked = checkIt;
      }
      childrenLoop(childObj);
    });
  };

  childrenLoop(obj[checkedPosition]);

  var parentLoop = function parentLoop(childObj) {
    if (!childObj.parentPos) return;
    var parentObj = obj[childObj.parentPos];

    var childrenCount = parentObj.childrenPos.length;

    var checkedChildrenCount = 0;
    parentObj.childrenPos.forEach(function (childPos) {
      if (obj[childPos].disableCheckbox) {
        childrenCount -= 1;
        return;
      }
      if (obj[childPos].checked === true) checkedChildrenCount++;else if (obj[childPos].halfChecked === true) checkedChildrenCount += 0.5;
    });

    if (checkedChildrenCount === childrenCount) {
      parentObj.checked = true;
      parentObj.halfChecked = false;
    } else if (checkedChildrenCount > 0) {
      parentObj.halfChecked = true;
      parentObj.checked = false;
    } else {
      parentObj.checked = false;
      parentObj.halfChecked = false;
    }
    parentLoop(parentObj);
  };

  parentLoop(obj[checkedPosition]);
}

export function getCheck(treeNodesStates) {
  var halfCheckedKeys = [];
  var checkedKeys = [];
  var checkedNodes = [];
  var checkedNodesPositions = [];
  Object.keys(treeNodesStates).forEach(function (item) {
    var itemObj = treeNodesStates[item];
    if (itemObj.checked) {
      checkedKeys.push(itemObj.key);
      checkedNodes.push(itemObj.node);
      checkedNodesPositions.push({ node: itemObj.node, pos: item });
    } else if (itemObj.halfChecked) {
      halfCheckedKeys.push(itemObj.key);
    }
  });
  return {
    halfCheckedKeys: halfCheckedKeys,
    checkedKeys: checkedKeys,
    checkedNodes: checkedNodes,
    checkedNodesPositions: checkedNodesPositions
  };
}

export function getStrictlyValue(checkedKeys, halfChecked) {
  if (halfChecked) {
    return { checked: checkedKeys, halfChecked: halfChecked };
  }
  return checkedKeys;
}

export function isInclude(smallArray, bigArray) {
  return smallArray.every(function (item, index) {
    return item === bigArray[index];
  });
}