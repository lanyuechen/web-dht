import { useState, useMemo, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Spin } from '@arco-design/web-react';

import Client from '@/utils/Client';

export default () => {
  const { id } = useParams();
  const ref = useRef();

  const [loading, setLoading] = useState(false);

  const client = useMemo(() => new Client(), []);

  useEffect(() => {
    if (!client) {
      return;
    }

    // setLoading(true);

    // client.createDocument(decodeURIComponent(id), ref.current.contentDocument).finally(() => {
    //   setLoading(false);
    // });

    // 直接通过innerHTML设置iframe，script和css不会加载
    // client.getDocument(decodeURIComponent(id)).then(doc => {
    //   if (ref.current.contentDocument?.documentElement?.innerHTML) {
    //     ref.current.contentDocument.documentElement.innerHTML = doc;
    //   }
    // }).finally(() => {
    //   setLoading(false);
    // });
  }, [client]);

  return (
    <Spin loading={loading} tip="疯狂加载中...">
      <micro-app
        name="test"
        torrent={id}
        style={{
          display: 'block',
          width: '100vw',
          height: '100vh',
        }}
      />
      {/* <iframe
        ref={ref}
        style={{
          width: '100vw',
          height: '100vh',
          border: 'none',
        }}
      /> */}
    </Spin>
  );
}
