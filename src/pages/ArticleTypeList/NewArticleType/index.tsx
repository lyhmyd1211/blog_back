import { message, Button } from 'antd';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { useRequest } from 'umi';
import type { FC } from 'react';
import { getArticleTypeById, addArticleType, editArticleType, hasCode } from './service';
// import styles from './style.less';

const NewArticleType: FC<Record<string, any>> = (prop) => {
  const { run } = useRequest(prop.detailId ? editArticleType : addArticleType, {
    manual: true,
    onSuccess: () => {
      message.success('提交成功');
      prop.handleOk();
    },
  });

  const onFinish = async (values: Record<string, any>) => {
    const param = prop.detailId ? { id: prop.detailId, ...values } : values;
    run(param);
  };

  const fetchType = () => {
    return new Promise<Record<string, any>>((resolve) => {
      if (prop.detailId) {
        getArticleTypeById({ id: prop.detailId }).then((res) => {
          if (res.data) {
            resolve(res.data);
          }
        });
      } else {
        resolve({});
      }
    });
  };

  const isExsist = async (rule, value, callback) => {
    try {
      const res = await hasCode({ code: value, id: prop.detailId });
      if (!value || (res.code == 0 && res.data == 0)) {
        return Promise.resolve();
      } else if (res.code == 0 && res.data == 1) {
        return Promise.reject(new Error('存在相同的code'));
      }
      throw new Error('校验错误');
    } catch (error) {
      callback(error);
    }
  };

  return (
    <div>
      <ProForm
        hideRequiredMark
        name="basic"
        layout="horizontal"
        initialValues={{}}
        request={async () => await fetchType()}
        onFinish={onFinish}
        submitter={{
          render: (props) => {
            return [
              <Button key="resetbtn" onClick={() => props.form?.resetFields()}>
                重置
              </Button>,
              <Button key="submitbtn" type="primary" onClick={() => props.form?.submit?.()}>
                提交
              </Button>,
            ];
          },
        }}
      >
        <ProFormText
          width="md"
          label="类型名称"
          name="text"
          rules={[
            {
              required: true,
              message: '请输入类型名称',
            },
          ]}
          placeholder="给类型起个名字"
        />
        <ProFormText
          width="md"
          label="类型编码"
          name="code"
          rules={[
            {
              required: true,
              message: '请输入类型编码',
            },
            {
              validator: isExsist,
              validateTrigger: 'onBlur',
            },
          ]}
          // fieldProps={{
          //   onBlur: onBlur,
          // }}
          placeholder="类型编码"
        />
      </ProForm>
    </div>
  );
};

export default NewArticleType;
