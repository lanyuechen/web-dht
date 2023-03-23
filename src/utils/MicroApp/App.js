import Client from '@/utils/Client';
import Sandbox from './Sandbox';

const parseTemplate = (template) => {
  return template
    .replace(/<head[^>]*>[\s\S]*?<\/head>/i, (match) => {
      // 将head标签替换为micro-app-head，因为web页面只允许有一个head标签
      return match
        .replace(/<head/i, '<micro-app-head')
        .replace(/<\/head>/i, '</micro-app-head>')
    })
    .replace(/<body[^>]*>[\s\S]*?<\/body>/i, (match) => {
      // 将body标签替换为micro-app-body，防止与基座应用的body标签重复导致的问题。
      return match
        .replace(/<body/i, '<micro-app-body')
        .replace(/<\/body>/i, '</micro-app-body>')
    });
}

const parseDocument = async (app) => {
  const files = await app.client.loadFiles(app.torrentId);

  const template = files.find(d => d.ext === 'html')?.content;
  const styles = files.filter(d => d.ext === 'css');
  const scripts = files.filter(d => d.ext === 'js');

  const html = parseTemplate(template);

  // 将html字符串转化为DOM结构
  const htmlDom = document.createElement('div');
  htmlDom.innerHTML = html;

  const appHead = htmlDom.querySelector('micro-app-head');
  styles.forEach(({ content }) => {
    const style = document.createElement('style');
    style.textContent = content;
    appHead.appendChild(style);
  });

  app.source.dom = htmlDom;
  app.source.styles = styles;
  app.source.scripts = scripts;

  app.onLoad(htmlDom);
}

export const appInstanceMap = new Map();

// 创建微应用
export default class {
  constructor ({ name, torrentId, container }) {
    this.name = name // 应用名称
    this.torrentId = torrentId;
    this.container = container;

    this.status = 'loading';
    this.client = new Client();

    parseDocument(this);
    this.sandbox = new Sandbox(name);
  }

  status = 'created' // 组件状态，包括 created/loading/mount/unmount

  // 存放应用的静态资源
  source = { 
    dom: null,
    links: [],
    scripts: [],
  };

  // 资源加载完时执行
  onLoad () {
    // 执行mount方法
    this.mount();
  }

  /**
   * 资源加载完成后进行渲染
   */
  mount () {
    const cloneDom = this.source.dom.cloneNode(true);
    const fragment = document.createDocumentFragment();
    Array.from(cloneDom.childNodes).forEach((node) => {
      fragment.appendChild(node)
    });

    // 将格式化后的DOM结构插入到容器中
    this.container.appendChild(fragment);

    this.sandbox.start();

    // 执行js
    this.source.scripts.forEach((info) => {
      (0, eval)(this.sandbox.bindScope(info.content));
    });

    // 标记应用为已渲染
    this.status = 'mounted';
  }

  /**
   * 卸载应用
   * 执行关闭沙箱，清空缓存等操作
   */
  unmount (destory) {
    // 更新状态
    this.status = 'unmount'
    // 清空容器
    this.container = null

    this.sandbox.stop();
    
    // destory为true，则删除应用
    if (destory) {
      appInstanceMap.delete(this.name)
    }
  }
}