import { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Space, Upload, Button, Input, Grid, Typography, Tooltip } from '@arco-design/web-react';
import { IconFile, IconDelete, IconUpload, IconSend } from '@arco-design/web-react/icon';
import debounce from 'lodash/debounce';

export default () => {
  const navigate = useNavigate();
  const [torrentId, setTorrentId] = useState('');
  const [fileList, setFileList] = useState([]);

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
  }, 100), [client]);

  useEffect(() => {
    seed(fileList.map(file => file.originFile));
  }, [fileList]);

  const handleChange = (files) => {
    setFileList(files);
  }

  const handleRemove = (file) => {
    setFileList((files) => files.filter(d => d !== file));
  }

  const handleOk = () => {
    navigate(`/${encodeURIComponent(torrentId)}`);
  }

  return (
    <div style={{width: '50%', margin: '160px auto 0 auto'}}>
      <Input
        placeholder="请输入torrentId"
        size="large"
        value={torrentId}
        style={{marginBottom: 16}}
        addAfter={(
          <Space style={{margin: '0 -16px'}} size={2}>
            <Typography.Text
              copyable={{
                text: torrentId,
              }}
              style={{
                height: 36,
                width: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
            <Upload
              multiple
              autoUpload={false}
              showUploadList={false}
              fileList={fileList}
              onChange={handleChange}
            >
              <Tooltip content="上传">
                <Button size="large" icon={<IconUpload />} />
              </Tooltip>
            </Upload>
            <Tooltip content="跳转">
              <Button
                size="large"
                disabled={!torrentId}
                icon={<IconSend />}
                onClick={handleOk}
              />
            </Tooltip>
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
