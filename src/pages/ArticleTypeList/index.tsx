import { PageContainer } from '@ant-design/pro-layout';
import { useState, useEffect } from 'react';
import { Spin, Button, Modal } from 'antd';
import styles from './index.less';
import TypeTable from './TypeTable';
import NewType from './NewArticleType';
export default () => {
  const [loading] = useState<boolean>(false);
  const [isShowEditModal, setIsShowEditModal] = useState<boolean>(false);
  const [detailId, setDetailId] = useState<string>();
  const addType = () => {
    setDetailId('');
    setIsShowEditModal(true);
  };
  const handleOk = () => {
    setIsShowEditModal(false);
  };
  const handleCancel = () => {
    setIsShowEditModal(false);
  };
  const getEditStatus = async (id: string) => {
    setDetailId(id);
    setIsShowEditModal(true);
  };
  useEffect(() => {}, []);
  return (
    <PageContainer className={styles.main}>
      <Button
        className={styles['write-btn']}
        onClick={() => {
          addType();
        }}
      >
        新增文章类型
      </Button>
      <TypeTable getEditStatus={getEditStatus} updated={isShowEditModal} />
      <div
        style={{
          paddingTop: 100,
          textAlign: 'center',
        }}
      >
        <Spin spinning={loading} size="large" />
      </div>
      <Modal
        title="新增文章类型"
        visible={isShowEditModal}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <NewType detailId={detailId} handleOk={handleOk} />
      </Modal>
    </PageContainer>
  );
};
