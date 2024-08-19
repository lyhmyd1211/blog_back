import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { notification, Table, Tag, Popconfirm } from 'antd';
import day from 'dayjs';
import { getArticleList, delArticle } from '@/services/ant-design-pro/article';
import type { ColumnsType } from 'antd/lib/table';
import { history } from 'umi';
const data: API.Article[] = [];

const ArticleTable = () => {
  const [colData, setColData] = useState<API.Article[]>(data);
  const fetchData = async () => {
    const res = await getArticleList();
    if (res && res.data) {
      setColData(
        res.data.map((item) => {
          item.key = item.id;
          return item;
        }),
      );
    }
  };
  const edit = async (id: string) => {
    history.push(`/articlelist/edit/${id}`);
  };
  const del = async (id: string) => {
    if (id) {
      const res = await delArticle({ id });
      notification[res.code === 0 ? 'success' : 'error']({
        description: res.msg,
        message: '删除提示',
      });
      fetchData();
    }
  };

  const columns: ColumnsType<API.Article> = [
    {
      title: '文章名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '发布时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (time: string) => <span>{day(time).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '文章类型',
      key: 'types',
      dataIndex: 'types',
      render: (tags: { value: string; label: string }[]) => {
        const color = 'green';
        return (
          <span>
            {tags.map((item) => {
              return (
                <Tag color={color} key={item.value}>
                  {item.label}
                </Tag>
              );
            })}
          </span>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: API.Article) => (
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

  return (
    <div className={styles.container}>
      <div className="article-list-main">
        <Table columns={columns} dataSource={colData} />
      </div>
    </div>
  );
};

export default ArticleTable;
