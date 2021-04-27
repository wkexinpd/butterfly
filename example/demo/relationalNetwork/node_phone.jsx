
'use strict';

import Node from './base_node';
import $ from 'jquery';
class Phone extends Node {
  constructor(...args) {
    super(...args);
  }
  genLogo = () => {
    return $('<i class="newIconfont iconapplication"></i>');
  }
}

export default Phone;
