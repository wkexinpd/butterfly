import uml from './uml/index.js';
import _ from 'lodash';
import $ from 'jquery';

import Node from './node/panel-node.js';

import './index.less';

class panelPlugins {
  constructor() {
    this.imgData = [];
    this.addCanvas = [];
  }

  guid = () => {
    function  S4() {
       return  (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return  (S4()+S4()+ "-" +S4());
  }

  addNode = (canvas, node) => {
    canvas.addNode(node);
  }

  register = (registerArray, callback) => {
    if (!_.isArray(registerArray)) {
      console.warn('register数据必须是数组',registerArray);
      return ;
    }

    for (let registerData of registerArray) {
      if (!registerData.root) {
        console.warn('register数据root字段不存在=>',registerData);
        break;
      }
      if (!registerData.canvas) {
        console.warn('register数据canvas字段不存在=>',registerData);
        break;
      }
      if (registerData.type) {
        switch (registerData.type) {
          case 'uml' :
            for (let item of uml) {
              item.width = registerData.width || 36;
              item.height = registerData.height || 36;
              this.imgData.push(item);
            }
            break;
          default :
            console.warn('register数据type值不存在与我们的内置库中=>',registerData);
        }
      }

      if (registerData.data) {
        for (let item of registerData.data) {
          item.width = item.width || 36;
          item.height = item.height || 36;
          this.imgData.push(item);
        }
      }

      for (let item of this.imgData) {
        let nodeItem = $('<div class="panel-node-dnd" drag></div>')
          .css('width', item.width + 'px')
          .css('height', item.height + 'px');

        let img = new Image();
        img.src = item.content;

        let jqImg = $(img).addClass('panel-img');
        jqImg.on('dragstart', (e)=>{
          e.originalEvent.dataTransfer.setData('id', item.id + '-' + this.guid());

          e.originalEvent.dataTransfer.setDragImage(img,0,0);
        })

        nodeItem.append(img);
        $(registerData.root).append(nodeItem);
      }

      if (!this.addCanvas.includes(registerData.canvas.root)) {
        this.addCanvas.push(registerData.canvas.root);

        $(registerData.canvas.root).on('dragover', (e) => {
          e.preventDefault();
        });
  
        $(registerData.canvas.root).on('drop', (e) => {
          let {clientX, clientY} = e;
          let coordinates = registerData.canvas.terminal2canvas([clientX, clientY]);
          let id = e.originalEvent.dataTransfer.getData('id');
  
          let node = {
            id,
            left: coordinates[0],
            top: coordinates[1],
            Class: Node,
            content: id,
          }
  
          this.addNode(registerData.canvas, node);
  
        });
      }

      this.imgData = [];

    };

    if (_.isFunction(callback)) {
     callback();
    }

  }

}

let panelPluginsInstance = new panelPlugins();
panelPluginsInstance.PanelNode = Node;

export default panelPluginsInstance;