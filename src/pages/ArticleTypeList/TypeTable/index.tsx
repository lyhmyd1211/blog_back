import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { notification, Table, Tag, Popconfirm } from 'antd';
import { getArticleTypeList, delArticleType } from '../service';
import type { ColumnsType } from 'antd/lib/table';

const data: API.ArticleType[] = [];
type propsType = {
  getEditStatus: any;
  updated: boolean;
};
const TypeTable = (props: propsType) => {
  const [colData, setColData] = useState<API.ArticleType[]>(data);
  const fetchData = async () => {
    const res = await getArticleTypeList();
    if (res && res.data) {
      setColData(
        res.data.map((item) => {
          item.key = item.id;
          return item;
        }),
      );
    }
  };

  const del = async (id: string) => {
    if (id) {
      const res = await delArticleType({ id });
      notification[res.code === 0 ? 'success' : 'error']({
        description: res.msg,
        message: '删除提示',
      });
      fetchData();
    }
  };

  const edit = async (id: string) => {
    props.getEditStatus(id);
  };

  const columns: ColumnsType<API.ArticleType> = [
    {
      title: '文章类型名称',
      key: 'text',
      dataIndex: 'text',
      render: (tags: string) => {
        const color = 'green';
        return (
          <span>
            {
              <Tag color={color} key={tags}>
                {tags}
              </Tag>
            }
          </span>
        );
      },
    },
    {
      title: '文章类型编码',
      dataIndex: 'code',
      key: 'code',
    },

    {
      title: '操作',
      key: 'action',
      render: (text: string, record: API.ArticleType) => (
        <span>
          <>
            <a
              style={{ marginRight: '10px' }}
              onClick={() => {
                if (record.id) {
                  edit(record.id);
                }
              }}
            >
              修改
            </a>
            <Popconfirm
              title="确定删除么"
              onConfirm={() => {
                if (record.id) {
                  del(record.id);
                }
              }}
              okText="确定"
              cancelText="取消"
            >
              <a>删除</a>
            </Popconfirm>
          </>
        </span>
      ),
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!props.updated) {
      fetchData();
    }
  }, [props.updated]);

  return (
    <div className={styles.container}>
      <div className="article-list-main">
        <Table columns={columns} dataSource={colData} />
      </div>
    </div>
  );
};

export default TypeTable;
