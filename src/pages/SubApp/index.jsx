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

    setLoading(true);

    // 直接通过innerHTML设置iframe，script和css不会加载
    const iframeDocument = ref.current.contentDocument;
    client.parseDocument(decodeURIComponent(id)).then(({ template, scripts }) => {
      if (iframeDocument?.documentElement?.innerHTML) {
        iframeDocument.documentElement.innerHTML = template;
        scripts.forEach(d => {
          const script = iframeDocument.createElement('script');
          script.textContent = d.content;
          iframeDocument.body.appendChild(script);
        });
      }
    }).finally(() => {
      setLoading(false);
    });
  }, [client]);

  return (
    <Spin loading={loading} tip="疯狂加载中...">
      <iframe
        ref={ref}
        style={{
          width: '100vw',
          height: '100vh',
          border: 'none',
        }}
      />
    </Spin>
  );
}
