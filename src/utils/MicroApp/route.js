// 保存原有方法
const originalPush = window.history.pushState;
const originalReplace = window.history.replaceState;

let lastUrl = null
export const reroute = (url) => {
  if (url !== lastUrl) {
    const { actives, unmounts } = {} // 匹配路由，寻找符合条件的子应用
    // 执行生命周期
    Promise.all(
      unmounts
        .map(async (app) => {
          // await runUnmounted(app)
        })
        .concat(
          actives.map(async (app) => {
            // await runBeforeLoad(app)
            // await runBoostrap(app)
            // await runMounted(app)
          })
        )
    ).then(() => {
      // 执行路由劫持小节未使用的函数
      callCapturedListeners()
    })
  }
  lastUrl = url || location.href
}

export const hijackRoute = () => {
  console.log('=====hijackRoute')
  // 重写方法
  window.history.pushState = (...args) => {
    // 调用原有方法
    originalPush.apply(window.history, args);
    // URL 改变逻辑，实际就是如何处理子应用
    // ...
  };

  window.history.replaceState = (...args) => {
    originalReplace.apply(window.history, args);
    // URL 改变逻辑
    // ...
  };

  // 监听事件，触发 URL 改变逻辑
  window.addEventListener("hashchange", (e) => {
    console.log('====hashchange', e)
  });
  window.addEventListener("popstate", (e) => {
    console.log('====popstate', e)
  });

  // 重写
  window.addEventListener = hijackEventListener(window.addEventListener);
  window.removeEventListener = hijackEventListener(window.removeEventListener);
};

const capturedListeners = {
  hashchange: [],
  popstate: [],
};

const hasListeners = (name, fn) => {
  return capturedListeners[name].filter((listener) => listener === fn).length;
};

const hijackEventListener = (func) => {
  return function (name, fn) {
    // 如果是以下事件，保存回调函数
    if (name === 'hashchange' || name === 'popstate') {
      if (!hasListeners(name, fn)) {
        capturedListeners[name].push(fn);
        return;
      } else {
        capturedListeners[name] = capturedListeners[name].filter(
          (listener) => listener !== fn
        );
      }
    }
    return func.apply(window, arguments);
  };
};

// 后续渲染子应用后使用，用于执行之前保存的回调函数
export function callCapturedListeners() {
  if (historyEvent) {
    Object.keys(capturedListeners).forEach((eventName) => {
      const listeners = capturedListeners[eventName]
      if (listeners.length) {
        listeners.forEach((listener) => {
          listener.call(this, historyEvent)
        })
      }
    })
    historyEvent = null
  }
}