import { useState, useMemo } from 'react';
import { Upload, Button, Input, Typography, Grid } from '@arco-design/web-react';
import { IconFile, IconDelete } from '@arco-design/web-react/icon';
import debounce from 'lodash/debounce';

import { initWeb } from '@/utils/utils';

export default () => {
  const [torrentId, setTorrentId] = useState('');
  const [magnetURI, setMagnetURI] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const client = useMemo(() => new WebTorrent(), []);

  const seed = useMemo(() => debounce((files) => {
    client.seed(files, (torrent) => {
      setMagnetURI(torrent.magnetURI);
    });
  }, 100), []);

  const handleChange = (files) => {
    setFileList(files);
    seed(files.map(file => file.originFile));
  }

  const handleOk = async () => {
    setLoading(true);
    try {
      await initWeb(torrentId);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{width: '50%', margin: '160px auto 0 auto'}}>
      <Grid.Row gutter={16} style={{marginBottom: 16}}>
        <Grid.Col flex="auto">
          <Input
            placeholder="请输入torrentId"
            size="large"
            value={torrentId}
            onChange={(value) => setTorrentId(value)}
          />
        </Grid.Col>
        <Grid.Col flex="initial">
          <Button
            size="large"
            type="primary"
            loading={loading}
            disabled={!torrentId}
            onClick={handleOk}
          >
            确定
          </Button>
        </Grid.Col>
        <Grid.Col flex="initial">
          <Upload
            multiple
            autoUpload={false}
            showUploadList={false}
            onChange={handleChange}
          >
            <Button type="text" size="large">
              Seed
            </Button>
          </Upload>
        </Grid.Col>
      </Grid.Row>

      <div style={{background: 'var(--color-fill-2)', marginBottom: 16}}>
        {fileList.map(file => (
          <Grid.Row key={file.name} gutter={8}>
            <Grid.Col flex="auto">
              <div style={{padding: '4px 8px'}}>
                <IconFile />&nbsp;&nbsp;{file.name}
              </div>
            </Grid.Col>
            <Grid.Col flex="32px">
              <Button type="text" icon={<IconDelete />} />
            </Grid.Col>
          </Grid.Row>
        ))}
      </div>
      
      {magnetURI && (
        <Typography style={{ background: 'var(--color-fill-2)', padding: 16 }}>
          <Typography.Paragraph copyable style={{marginBottom: 0}}>
            {magnetURI}
          </Typography.Paragraph>
        </Typography>
      )}
    </div>
  );
}
