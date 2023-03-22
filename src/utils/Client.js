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
}
