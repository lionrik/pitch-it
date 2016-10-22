/**
 *    Copyright 2016, the creators of pitch-it
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *    http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * be found in the LICENSE file in the root directory
 * 
 */

'use strict';

import Message from '../../../shared/Message';

export default class ClientSocket {
  constructor(host, port, connected, disconnected) {
    this._messageHandlers = {};
    this._connectedCallback = connected;
    this._disconnectedCallback = disconnected;
    let socketURL = (this._isTLS() ? 'wss' : 'ws') + '://' + host + ':' + port;
    this._socket = new WebSocket(socketURL);
    this._socket.onopen = connected;
    this._socket.onclose = disconnected;
    this._socket.onmessage = this._handleMessage.bind(this);
    this._callbacks = {};
  }
  
  _isTLS() {
    return (window.location.protocol === 'https:')
  }

  _connected() {
    console.log('Connected');
    if (this._connectedCallback) {
      this._connectedCallback();
    }
  }
  
  _disconnected() {
    console.log('disconnected');
    if (this._disconnectedCallback) {
      this._disconnectedCallback();
    }
  }
  
  _handleMessage(msg) {
    msg = Message.deserialize(msg);
    if (this._callbacks[type]) {
      this._callbacks[type](msg);
    } else {
      console.info('No handler found for ', msg.type);
    }
  }
  
  send(msg) {
    this._socket.send(msg.serialize());
  }

  on(type, handle) {
    if (!this._callbacks[type]) {
      this._callbacks[type] = handle;
    } else {
      console.warn('Try to overwrite handler for ', type);
    }
  }
}
