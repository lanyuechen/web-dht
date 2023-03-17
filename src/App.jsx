import { useState, useMemo, useEffect } from 'react';
import { Space, Upload, Button, Input, Grid, Spin } from '@arco-design/web-react';
import { IconFile, IconDelete, IconUpload, IconSend } from '@arco-design/web-react/icon';
import debounce from 'lodash/debounce';

import { initWeb } from '@/utils/utils';

const useParams = () => {
  const res = {};
  if (!location.search) {
    return res;
  }
  const search = location.search.substring(1);
  search.split('&').forEach(kv => {
    const [k, v] = kv.split('=');
    res[k] = decodeURIComponent(v);
  });
  return res;
}

export default () => {
  const [torrentId, setTorrentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const { torrent } = useParams();

  const client = useMemo(() => new WebTorrent(), []);

  const seed = useMemo(() => debounce((files) => {
    client.torrents.forEach(torrent => {
      client.remove(torrent.infoHash);
    });

    if (files.length) {
      client.seed(files, (torrent) => {
        setTorrentId(torrent.magnetURI);
      });
    } else {
      setTorrentId('');
    }
  }, 100), []);

  useEffect(() => {
    seed(fileList.map(file => file.originFile));
  }, [fileList]);

  useEffect(() => {
    if (torrent) {
      setLoading(true);
      initWeb(torrent).finally(() => {
        setLoading(false);
      })
    }
  }, [torrent]);

  const handleChange = (files) => {
    setFileList(files);
  }

  const handleRemove = (file) => {
    setFileList((files) => files.filter(d => d !== file));
  }

  const handleOk = () => {
    window.open(`${location.origin}?torrent=${encodeURIComponent(torrentId)}`);
  }

  if (torrent) {
    return (
      <Spin loading={loading} tip="疯狂加载中..." style={{width: '100%', marginTop: 200}} />
    );
  }

  return (
    <div style={{width: '50%', margin: '160px auto 0 auto'}}>
      <Input
        placeholder="请输入torrentId"
        size="large"
        value={torrentId}
        style={{marginBottom: 16}}
        addAfter={(
          <Space style={{margin: '0 -16px'}} size={0}>
            <Upload
              multiple
              autoUpload={false}
              showUploadList={false}
              fileList={fileList}
              onChange={handleChange}
            >
              <Button size="large" icon={<IconUpload />} />
            </Upload>
            <Button
              type="primary"
              size="large"
              loading={loading}
              disabled={!torrentId}
              icon={<IconSend />}
              onClick={handleOk}
            />
          </Space>
        )}
        onChange={(value) => setTorrentId(value)}
      />

      <div style={{background: 'var(--color-fill-2)', marginBottom: 16}}>
        {fileList.map(file => (
          <Grid.Row key={file.name} gutter={8}>
            <Grid.Col flex="auto">
              <div style={{padding: '4px 8px'}}>
                <IconFile />&nbsp;&nbsp;{file.name}
              </div>
            </Grid.Col>
            <Grid.Col flex="32px">
              <Button type="text" icon={<IconDelete />} onClick={() => handleRemove(file)} />
            </Grid.Col>
          </Grid.Row>
        ))}
      </div>
    </div>
  );
}
