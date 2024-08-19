import { PageContainer } from '@ant-design/pro-layout';
import { useState, useEffect } from 'react';
import { Spin, Button } from 'antd';
import styles from './index.less';
import ArticleTable from './ArticleTable';
import { history } from 'umi';
export default () => {
  const [loading] = useState<boolean>(false);
  useEffect(() => {}, []);

  const write = () => {
    history.push('/articlelist/new');
  };

  return (
    <PageContainer className={styles.main}>
      <Button
        className={styles['write-btn']}
        onClick={() => {
          write();
        }}
      >
        写文章
      </Button>
      <ArticleTable />
      <div
        style={{
          paddingTop: 100,
          textAlign: 'center',
        }}
      >
        <Spin spinning={loading} size="large" />
      </div>
    </PageContainer>
  );
};
