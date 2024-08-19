import { message, Modal } from 'antd';
import type { FC } from 'react';
import { useMemo, useState, useEffect, useRef } from 'react';
import { Input, Button, Divider } from 'antd';
import ProForm, { ProFormText, ProFormSelect } from '@ant-design/pro-form';
import type { ProFormInstance } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import { MdEditor } from '@/components/MdEditor';
import { addArticle, editArticle } from './service';
import styles from './style.less';
import day from 'dayjs';
import { history } from 'umi';
import { getArticleTypeList } from '../../ArticleTypeList/service';
import { getArticleById } from './service';
import { PlusOutlined } from '@ant-design/icons';
import NewType from '../../ArticleTypeList/NewArticleType';
// import type { UploadFile } from 'antd/lib/upload/interface';
const NewArticle: FC<Record<string, any>> = (props) => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [initVal, setInitVal] = useState<Record<string, any>>();
  // const [, setUploadFile] = useState<UploadFile>();
  // const [typeDataOption, setTypeDataOption] = useState<API.ArticleType[]>([]);
  const [chooseData, setChooseData] = useState<string[]>([]);
  const [titleData, setTitleData] = useState<string>(day(new Date()).format('YYYY-MM-DD HH:mm:ss'));
  const [contentData, setContentData] = useState<string>('');

  const getValue = (val: string) => {
    setContentData(val);
  };

  const getType = async () => {
    const { data } = await getArticleTypeList();
    if (data) {
      const option = data.map((item) => {
        return { label: item.text, value: item.code };
      });
      return option;
    }
    return [];
    // if (data) {
    //   setTypeDataOption(data);
    // }
  };

  const onchange = (val: string[]) => {
    if (val.length <= 3) {
      setChooseData(val);
    } else {
      message.error('别贪心，最多选择3个标签!');
    }
  };

  const titleChange = (val: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitleData(val.target.value);
  };

  const getParam = useMemo(() => {
    return { title: titleData, content: contentData };
  }, [contentData, titleData]);

  const formRef = useRef<ProFormInstance>();
  const onFinish = async () => {
    formRef.current?.validateFieldsReturnFormatValue?.().then(async (values) => {
      console.log('校验表单并返回格式化后的所有数据：', values);
      const params = {
        ...values,
        type: values.type.join(','),
        cover: values.cover[0].response.data.filePath,
      };
      let res;
      if (props.match.params.id) {
        res = await editArticle({ id: props.match.params.id, ...getParam, ...params });
      } else {
        res = await addArticle({ ...getParam, ...params });
      }

      if (!res) {
        console.log('res', res);
      } else if (res.code == 0) {
        message.success(res.msg);
        setIsShowModal(false);
        localStorage.removeItem('smde_article_editor');
        history.push('/articlelist');
      } else {
        message.error(res.msg);
      }
    });
  };

  // useEffect(() => {
  //   if (isShowModal) {
  //     getType();
  //   }
  // }, [isShowModal]);

  const fetchArticle = async () => {
    if (props.match.params.id) {
      const res = await getArticleById({ id: props.match.params.id });
      if (res.data) {
        // setChooseData(
        //   res.data.types.map((item: { value: string }) => {
        //     return item.value;
        //   }),
        // );
        const fileList = [
          {
            response: { data: { filePath: res.data.cover } },
            name: '封面.png',
          },
        ];

        setInitVal({ ...res.data, cover: fileList });
        setContentData(res.data.content);
        setTitleData(res.data.title);
      }
    }
  };
  useEffect(() => {
    fetchArticle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.match.params.id]);

  const [isShowTypeModal, setIsShowTypeModal] = useState(false);
  const handleOk = () => {
    getType();
    setIsShowTypeModal(false);
  };
  const handleCancel = () => {
    setIsShowTypeModal(false);
  };
  const addItem = () => {
    setIsShowTypeModal(true);
  };

  // const fileChange = (val) => {
  //   setUploadFile(val.fileList);
  // };

  // const fileRemove = (file) => {
  //   console.log('yichu', file);
  //   // setUploadFile()
  // };

  return (
    <PageContainer header={{ title: '' }}>
      <div className={styles.pubtitle}>
        <Input.TextArea
          defaultValue={titleData}
          placeholder="请输入文章标题 (5-100)字"
          className={styles.pubInput}
          minLength={5}
          maxLength={100}
          showCount={true}
          value={titleData}
          style={{ width: '100%' }}
          autoSize={{ minRows: 1, maxRows: 1 }}
          onChange={titleChange}
        />
        <Button
          className={styles.pubBtn}
          onClick={() => {
            setIsShowModal(true);
          }}
        >
          发布文章
        </Button>
      </div>
      <div className={styles.editorMain}>
        <MdEditor
          defaultValue={contentData}
          getValue={getValue}
          id="article_editor"
          autoSave={true}
          delay={600000}
        />
      </div>
      <Modal
        title="发布文章"
        width={600}
        visible={isShowModal}
        onCancel={() => {
          setIsShowModal(false);
        }}
        maskClosable={false}
        footer={false}
        // footer={[
        //   <Button
        //     key="back"
        //     onClick={() => {
        //       setIsShowModal(false);
        //     }}
        //   >
        //     取消
        //   </Button>,
        //   <Button type="primary" key="submit" onClick={onFinish}>
        //     确认发布
        //   </Button>,
        // ]}
        destroyOnClose
      >
        <ProForm
          name="basic"
          layout="horizontal"
          formRef={formRef}
          initialValues={initVal}
          // request={async () => await fetchType()}
          onFinish={onFinish}
          submitter={{
            render: (prop) => {
              return [
                <Button key="resetbtn" onClick={() => prop.form?.resetFields()}>
                  重置
                </Button>,
                <Button key="submitbtn" type="primary" onClick={() => prop.form?.submit?.()}>
                  提交
                </Button>,
              ];
            },
          }}
        >
          <ProFormSelect
            name="type"
            label="文章类型"
            allowClear
            mode="tags"
            fieldProps={{
              value: chooseData,
              onChange: onchange,
              maxTagCount: 3,
              dropdownRender: (menu) => (
                <div>
                  {menu}
                  <Divider style={{ margin: '4px 0' }} />
                  <div>
                    <a
                      style={{
                        flex: 'none',
                        padding: '8px',
                        display: 'block',
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                      onClick={addItem}
                    >
                      <PlusOutlined /> 添加新类型
                    </a>
                  </div>
                </div>
              ),
            }}
            request={getType}
            placeholder="请选择类型"
            rules={[{ required: true, message: '请选择一个类型' }]}
          />
          <ProFormText
            label="文章摘要"
            name="abstract"
            rules={[
              {
                required: true,
                message: '请输入文章摘要',
              },
            ]}
            placeholder="请输入文章摘要"
          />
          {/* <ProFormUploadDragger
            rules={[
              {
                required: true,
                message: '请上传封面图片',
              },
            ]}
            max={1}
            label="封面图片"
            name="cover"
            action="/api/upload"
            fieldProps={{
              onRemove: fileRemove,
              onChange: fileChange,
              headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
            }}
          /> */}
        </ProForm>
        {/* <div className={styles.formContent}>
          <label>文章类型：</label>
          <Select
            mode="tags"
            allowClear
            value={chooseData}
            style={{ width: '100%' }}
            placeholder="请选择文章类型"
            maxTagCount={3}
            onChange={onchange}
            dropdownRender={(menu) => (
              <div>
                {menu}
                <Divider style={{ margin: '4px 0' }} />
                <div>
                  <a
                    style={{
                      flex: 'none',
                      padding: '8px',
                      display: 'block',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                    onClick={addItem}
                  >
                    <PlusOutlined /> 添加新类型
                  </a>
                </div>
              </div>
            )}
          >
            {typeDataOption.map((item) => {
              return <Select.Option value={item.code || ''}>{item.text}</Select.Option>;
            })}
          </Select>
        </div>
        <div className={styles.formContent}>
          <label>文章摘要：</label>
          <Input onChange={absChange}/>
        </div>
        <div className={styles.formContent}>
          <label>封面图片：</label>
          <Upload />
        </div> */}
      </Modal>
      <Modal
        title="新增文章类型"
        visible={isShowTypeModal}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <NewType handleOk={handleOk} />
      </Modal>
    </PageContainer>
  );
};

export default NewArticle;
