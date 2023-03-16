import { useState } from 'react';
import { Grid, Space, Upload, Button, Input, Typography } from '@arco-design/web-react';

import { loadResource } from '@/utils/utils';

export default () => {
  const [torrentId, setTorrentId] = useState('magnet:?xt=urn:btih:66f9eb84bc6169f7d301ad3aca6debb6037f8e0d&dn=index-22e5abbc.js&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com');
  const [magnetURI, setMagnetURI] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    setLoading(true);
    try {
      await loadResource(torrentId);
    } finally {
      setLoading(false);
    }
  }

  const seed = (file) => {
    const client = new WebTorrent();

    client.seed(file, (torrent) => {
      setMagnetURI(torrent.magnetURI);
      console.log('torrent', torrent);
    });
  }

  const handleChange = (fileList) => {
    seed(fileList);
  }

  return (
    <Grid.Row gutter={[16, 16]}>
      <Grid.Col span={24}>
        <Space>
          <Input
            style={{width: 400}}
            placeholder="请输入torrentId"
            value={torrentId}
            onChange={(value) => setTorrentId(value)}
          />
          <Button onClick={handleOk} type="primary" loading={loading}>确定</Button>
        </Space>
      </Grid.Col>
      
      <Grid.Col span={24}>
        <Upload
          multiple
          autoUpload={false}
          onChange={handleChange}
        />
        <Typography.Paragraph copyable={!!magnetURI}>
          {magnetURI}
        </Typography.Paragraph>
      </Grid.Col>
    </Grid.Row>
  );
}
