window.wt = new WebTorrent();

const appendJs = (url) => {
  const script = document.createElement('script');
  script.setAttribute('src', url);
  document.body.append(script);
}

const appendCss = (url) => {
  const link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('href', url);
  document.head.append(link);
}

const loadTorrent = (torrentId) => {
  return new Promise((resolve) => {
    wt.add(torrentId, (torrent) => {
      resolve(torrent);
    });
  })
}

export const loadResource = async (torrentId) => {
  console.log('[load resource start]');
  const torrent = await loadTorrent(torrentId);

  torrent.files.map(file => {
    console.log('[load file]', file.name)
    file.getBlobURL((err, url) => {
      if (err) {
        throw err;
      }
      if (file.name.match(/\.js$/)) {
        appendJs(url);
      } else if (file.name.match(/\.css$/)) {
        appendCss(url);
      }
    });
  })
}
