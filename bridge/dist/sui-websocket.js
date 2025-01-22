// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
var __classPrivateFieldGet =
  (this && this.__classPrivateFieldGet) ||
  function (receiver, state, kind, f) {
    if (kind === "a" && !f)
      throw new TypeError("Private accessor was defined without a getter");
    if (
      typeof state === "function"
        ? receiver !== state || !f
        : !state.has(receiver)
    )
      throw new TypeError(
        "Cannot read private member from an object whose class did not declare it"
      );
    return kind === "m"
      ? f
      : kind === "a"
      ? f.call(receiver)
      : f
      ? f.value
      : state.get(receiver);
  };
var __classPrivateFieldSet =
  (this && this.__classPrivateFieldSet) ||
  function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f)
      throw new TypeError("Private accessor was defined without a setter");
    if (
      typeof state === "function"
        ? receiver !== state || !f
        : !state.has(receiver)
    )
      throw new TypeError(
        "Cannot write private member to an object whose class did not declare it"
      );
    return (
      kind === "a"
        ? f.call(receiver, value)
        : f
        ? (f.value = value)
        : state.set(receiver, value),
      value
    );
  };
var _WebsocketClient_instances,
  _WebsocketClient_requestId,
  _WebsocketClient_disconnects,
  _WebsocketClient_webSocket,
  _WebsocketClient_connectionPromise,
  _WebsocketClient_subscriptions,
  _WebsocketClient_pendingRequests,
  _WebsocketClient_setupWebSocket,
  _WebsocketClient_reconnect;
import { JsonRpcError } from "../node_modules/@mysten/sui.js/dist/esm/client/errors.js";
function getWebsocketUrl(httpUrl) {
  const url = new URL(httpUrl);
  url.protocol = url.protocol.replace("http", "ws");
  return url.toString();
}
export const DEFAULT_CLIENT_OPTIONS = {
  // We fudge the typing because we also check for undefined in the constructor:
  WebSocketConstructor:
    typeof WebSocket !== "undefined" ? WebSocket : undefined,
  callTimeout: 30000,
  reconnectTimeout: 3000,
  maxReconnects: 5,
};
export class WebsocketClient {
  constructor(endpoint, options = {}) {
    _WebsocketClient_instances.add(this);
    _WebsocketClient_requestId.set(this, 0);
    _WebsocketClient_disconnects.set(this, 0);
    _WebsocketClient_webSocket.set(this, null);
    _WebsocketClient_connectionPromise.set(this, null);
    _WebsocketClient_subscriptions.set(this, new Set());
    _WebsocketClient_pendingRequests.set(this, new Map());
    this.endpoint = endpoint;
    this.options = { ...DEFAULT_CLIENT_OPTIONS, ...options };
    if (!this.options.WebSocketConstructor) {
      throw new Error("Missing WebSocket constructor");
    }
    if (this.endpoint.startsWith("http")) {
      this.endpoint = getWebsocketUrl(this.endpoint);
    }
  }
  async makeRequest(method, params) {
    const webSocket = await __classPrivateFieldGet(
      this,
      _WebsocketClient_instances,
      "m",
      _WebsocketClient_setupWebSocket
    ).call(this);
    return new Promise((resolve, reject) => {
      __classPrivateFieldSet(
        this,
        _WebsocketClient_requestId,
        __classPrivateFieldGet(this, _WebsocketClient_requestId, "f") + 1,
        "f"
      );
      __classPrivateFieldGet(this, _WebsocketClient_pendingRequests, "f").set(
        __classPrivateFieldGet(this, _WebsocketClient_requestId, "f"),
        {
          resolve: resolve,
          reject,
          timeout: setTimeout(() => {
            __classPrivateFieldGet(
              this,
              _WebsocketClient_pendingRequests,
              "f"
            ).delete(
              __classPrivateFieldGet(this, _WebsocketClient_requestId, "f")
            );
            reject(new Error(`Request timeout: ${method}`));
          }, this.options.callTimeout),
        }
      );
      webSocket.send(
        JSON.stringify({
          jsonrpc: "2.0",
          id: __classPrivateFieldGet(this, _WebsocketClient_requestId, "f"),
          method,
          params,
        })
      );
    }).then(({ error, result }) => {
      if (error) {
        throw new JsonRpcError(error.message, error.code);
      }
      return result;
    });
  }
  async subscribe(input) {
    const subscription = new RpcSubscription(input);
    __classPrivateFieldGet(this, _WebsocketClient_subscriptions, "f").add(
      subscription
    );
    await subscription.subscribe(this);
    return () => subscription.unsubscribe(this);
  }
}
(_WebsocketClient_requestId = new WeakMap()),
  (_WebsocketClient_disconnects = new WeakMap()),
  (_WebsocketClient_webSocket = new WeakMap()),
  (_WebsocketClient_connectionPromise = new WeakMap()),
  (_WebsocketClient_subscriptions = new WeakMap()),
  (_WebsocketClient_pendingRequests = new WeakMap()),
  (_WebsocketClient_instances = new WeakSet()),
  (_WebsocketClient_setupWebSocket =
    function _WebsocketClient_setupWebSocket() {
      if (
        __classPrivateFieldGet(this, _WebsocketClient_connectionPromise, "f")
      ) {
        return __classPrivateFieldGet(
          this,
          _WebsocketClient_connectionPromise,
          "f"
        );
      }
      __classPrivateFieldSet(
        this,
        _WebsocketClient_connectionPromise,
        new Promise((resolve) => {
          __classPrivateFieldGet(
            this,
            _WebsocketClient_webSocket,
            "f"
          )?.close();
          __classPrivateFieldSet(
            this,
            _WebsocketClient_webSocket,
            new this.options.WebSocketConstructor(this.endpoint),
            "f"
          );
          __classPrivateFieldGet(
            this,
            _WebsocketClient_webSocket,
            "f"
          ).addEventListener("open", () => {
            __classPrivateFieldSet(this, _WebsocketClient_disconnects, 0, "f");
            resolve(
              __classPrivateFieldGet(this, _WebsocketClient_webSocket, "f")
            );
          });
          __classPrivateFieldGet(
            this,
            _WebsocketClient_webSocket,
            "f"
          ).addEventListener("close", () => {
            var _a;
            __classPrivateFieldSet(
              this,
              _WebsocketClient_disconnects,
              ((_a = __classPrivateFieldGet(
                this,
                _WebsocketClient_disconnects,
                "f"
              )),
              _a++,
              _a),
              "f"
            );
            if (
              __classPrivateFieldGet(this, _WebsocketClient_disconnects, "f") <=
              this.options.maxReconnects
            ) {
              setTimeout(() => {
                __classPrivateFieldGet(
                  this,
                  _WebsocketClient_instances,
                  "m",
                  _WebsocketClient_reconnect
                ).call(this);
              }, this.options.reconnectTimeout);
            }
          });
          __classPrivateFieldGet(
            this,
            _WebsocketClient_webSocket,
            "f"
          ).addEventListener("message", ({ data }) => {
            let json;
            try {
              json = JSON.parse(data);
            } catch (error) {
              console.error(new Error(`Failed to parse RPC message: ${data}`));
              return;
            }
            if (
              "id" in json &&
              json.id != null &&
              __classPrivateFieldGet(
                this,
                _WebsocketClient_pendingRequests,
                "f"
              ).has(json.id)
            ) {
              const { resolve, timeout } = __classPrivateFieldGet(
                this,
                _WebsocketClient_pendingRequests,
                "f"
              ).get(json.id);
              clearTimeout(timeout);
              resolve(json);
            } else if ("params" in json) {
              const { params } = json;
              __classPrivateFieldGet(
                this,
                _WebsocketClient_subscriptions,
                "f"
              ).forEach((subscription) => {
                if (subscription.subscriptionId === params.subscription)
                  if (params.subscription === subscription.subscriptionId) {
                    subscription.onMessage(params.result);
                  }
              });
            }
          });
        }),
        "f"
      );
      return __classPrivateFieldGet(
        this,
        _WebsocketClient_connectionPromise,
        "f"
      );
    }),
  (_WebsocketClient_reconnect = async function _WebsocketClient_reconnect() {
    __classPrivateFieldGet(this, _WebsocketClient_webSocket, "f")?.close();
    __classPrivateFieldSet(this, _WebsocketClient_connectionPromise, null, "f");
    return Promise.allSettled(
      [
        ...__classPrivateFieldGet(this, _WebsocketClient_subscriptions, "f"),
      ].map((subscription) => subscription.subscribe(this))
    );
  });
class RpcSubscription {
  constructor(input) {
    this.subscriptionId = null;
    this.subscribed = false;
    this.input = input;
  }
  onMessage(message) {
    if (this.subscribed) {
      this.input.onMessage(message);
    }
  }
  async unsubscribe(client) {
    const { subscriptionId } = this;
    this.subscribed = false;
    if (subscriptionId == null) return false;
    this.subscriptionId = null;
    return client.makeRequest(this.input.unsubscribe, [subscriptionId]);
  }
  async subscribe(client) {
    this.subscriptionId = null;
    this.subscribed = true;
    const newSubscriptionId = await client.makeRequest(
      this.input.method,
      this.input.params
    );
    if (this.subscribed) {
      this.subscriptionId = newSubscriptionId;
    }
  }
}
