/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import { parse } from '../../utils/parser';

test('stack with eval', function () {
  expect(parse('e@file:///Users/joe/Documents/Development/OSS/stack-frame/index.html:25:18\neval code\neval@[native code]\na@file:///Users/joe/Documents/Development/OSS/stack-frame/index.html:8:10\nglobal code@file:///Users/joe/Documents/Development/OSS/stack-frame/index.html:32:8')).toMatchSnapshot();
});