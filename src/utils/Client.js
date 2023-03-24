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

  getContent(file) {
    return new Promise((resolve, reject) => {
      file.getBuffer((err, buffer) => {
        if (err) {
          reject(err);
        }
        resolve(buffer.toString());
      });
    });
  }

  async loadFiles(torrentId) {
    const torrent = await this.loadTorrent(torrentId);
    return Promise.all(torrent.files.map(async (file) => {
      console.log('[load file]', file.name);
      const content = await this.getContent(file);
      const ext = file.name.split('.').pop();
      return { file, content, ext };
    }));
  }

  parseDocument = async (torrentId) => {
    console.log('[parse document start]:', torrentId);
    const files = await this.loadFiles(torrentId);
  
    const template = files.find(d => d.ext === 'html')?.content;
    const styles = files.filter(d => d.ext === 'css');
    const scripts = files.filter(d => d.ext === 'js');

    console.log('[parse document end]');

    return {
      template: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>WEB DHT NEW</title>
            ${styles.map(style => `<style>${style.content}</style>`).join('\n')}
          </head>
          <body>
            <div id="root"></div>
          </body>
        </html>
      `,
      scripts,
    };
  }
}
