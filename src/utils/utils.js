window.wt = new WebTorrent();

const appendJs = (url, body = document.body) => {
  const script = document.createElement('script');
  script.setAttribute('src', url);
  body.append(script);
}

const appendCss = (url, head = document.head) => {
  const link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('href', url);
  head.append(link);
}

const loadTorrent = (torrentId) => {
  return new Promise((resolve) => {
    wt.add(torrentId, (torrent) => {
      resolve(torrent);
    });
  })
}

export const initWeb = async (torrentId) => {
  console.log('[init document start]');
  const torrent = await loadTorrent(torrentId);
  const head = document.createElement('head');
  const body = document.createElement('body');

  head.innerHTML = `
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>WEB DHT NEW</title>
    </head>
  `;

  body.innerHTML = `
    <body>
      <div id="root"></div>
    </body>
  `;

  torrent.files.map(file => {
    console.log('[load file]', file.name)
    file.getBlobURL((err, url) => {
      if (err) {
        throw err;
      }
      if (file.name.match(/\.js$/)) {
        appendJs(url, body);
      } else if (file.name.match(/\.css$/)) {
        appendCss(url, head);
      }
    });
  });

  document.head.replaceWith(head);
  document.body.replaceWith(body);
}
