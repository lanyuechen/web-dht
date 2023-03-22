export default class Client {
  constructor() {
    this.client = new WebTorrent();
  }

  loadTorrent(torrentId) {
    return new Promise((resolve, reject) => {
      const torrent = this.client.add(torrentId);
      torrent.on('ready', () => {
        resolve(torrent);
      });
      torrent.on('error', (err) => {
        reject(err);
      });
    })
  }

  getBlobUrl(file) {
    return new Promise((resolve, reject) => {
      file.getBlobURL((err, url) => {
        if (err) {
          reject(err);
        }
        resolve(url);
      });
    });
  }

  getText(file) {
    return new Promise((resolve, reject) => {
      file.getBuffer((err, buffer) => {
        if (err) {
          reject(err);
        }
        resolve(buffer.toString());
      });
    });
  }

  loadFiles(files) {
    return Promise.all(files.map(async (file) => {
      console.log('[load file]', file.name);
      const url = await this.getBlobUrl(file);
      return { file, url };
    }));
  }

  async createDocument(torrentId, doc) {
    console.log('[create document start]');

    const torrent = await this.loadTorrent(torrentId);
    const files = await this.loadFiles(torrent.files);

    doc.documentElement.innerHTML = `
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>WEB DHT NEW</title>
      </head>
      <body>
        <div id="root"></div>
      </body>
    `;

    files.map(({file, url}) => {
      if (file.name.match(/\.js$/)) {
        const script = doc.createElement('script');
        script.src = url;
        doc.body.appendChild(script);
      } else if (file.name.match(/\.css$/)) {
        const link = doc.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        doc.head.appendChild(link);
      }
    });
    console.log('[create document end]');
  }

  async getDocument(torrentId) {
    console.log('[get document start]');

    const scripts = [];
    const links = [];

    const torrent = await this.loadTorrent(torrentId);
    const files = await this.loadFiles(torrent.files);

    files.map(({file, url}) => {
      if (file.name.match(/\.js$/)) {
        scripts.push(url);
      } else if (file.name.match(/\.css$/)) {
        links.push(url);
      }
    });

    return `
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>WEB DHT NEW</title>
        ${links.map(url => `<link rel="stylesheet" href="${url}" />`).join('\n')}
      </head>
      <body>
        <div id="root"></div>
        ${scripts.map(url => `<script src="${url}"></script>`).join('\n')}
      </body>
    `;
  }
}
