import { useState } from 'react';
import { Grid, Space, Upload, Button, Input, Typography } from '@arco-design/web-react';

import { initWeb } from '@/utils/utils';

export default () => {
  const [torrentId, setTorrentId] = useState('');
  const [magnetURI, setMagnetURI] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const handleOk = async () => {
    setLoading(true);
    try {
      await initWeb(torrentId);
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
    setFileList(fileList.map(file => file.originFile));
  }

  const handleSeed = () => {
    seed(fileList);
  }

  return (
    <>
      <div style={{textAlign: 'center', marginBottom: 16}}>
        <Space>
          <Input
            style={{width: 400}}
            placeholder="请输入torrentId"
            size="large"
            value={torrentId}
            onChange={(value) => setTorrentId(value)}
          />
          <Button
            size="large"
            type="primary"
            loading={loading}
            disabled={!torrentId}
            onClick={handleOk}
          >
            确定
          </Button>
        </Space>
      </div>
      
      <div>
        <Upload
          multiple
          autoUpload={false}
          onChange={handleChange}
        />
        <Typography.Paragraph copyable={!!magnetURI}>
          {magnetURI}
        </Typography.Paragraph>
        <Button onClick={handleSeed} type="primary" disabled={fileList.length === 0}>Seed</Button>
      </div>
    </>
  );
}
