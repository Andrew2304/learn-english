/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { SoundOutlined } from '@ant-design/icons';
import { Button, Card, Col, Flex, Input, notification, Pagination, PaginationProps, Row, Select, Tag } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { apiUrl, LearnType, WordType } from '../helpers';

type NotificationType = 'success' | 'info' | 'warning' | 'error';


export default function Home() {
  const [params, setParams] = useState<any>({
    wordType: null,
    keyword: null,
    page: 1
  });
  const [data, setData] = useState<any>(null);
  const [typeLearn, setTypeLearn] = useState(LearnType.LEARN_LISTEN);
  const [typeWord, setTypeWord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type: NotificationType) => {
    api[type]({
      message: '',
      description: 'Write success',
      duration: 2,
    });
  };

  // const total = 100;

  const fetchData = async () => {
    setLoading(true);
    try {
      const take = 10;
      const skip = (params.page - 1) * take;
      const response = await axios.get(
        `${apiUrl}/words?take=10&skip=${skip}&wordType=${params.wordType}&keyword=${params.keyword}`,
      );
      setData(response.data);
    } catch (err: any) {
      setError(err.message);
      console.log('error fetchData');
    } finally {
      setLoading(false);
    }
  };

  const writeWordSuccessLog = async (wordId: number, type: number) => {
    try {
      await axios.post(`${apiUrl}/histories`, {
        wordId,
        type: type === 1 ? 'LISTEN' : 'WRITE',
      });
    } catch (err: any) {
      setError(err.message);
      console.log('error writeWordSuccessLog');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSoundOne = (item: any) => {
    const audio = new Audio(item?.pronunciationLink); // Replace with your sound file path
    audio.play();
    setIsPlaying(true);

    audio.onended = () => {
      setIsPlaying(false);
      writeWordSuccessLog(item?.id, 1);
    };
  }

  const handleSoundRepeat = (item: any) => {
    let count = 1;
    const audio = new Audio(item?.pronunciationLink); // Replace with your sound file path
    audio.play();
    setIsPlaying(true);

    audio.onended = () => {
      count++;
      setIsPlaying(false);
      setTimeout(() => {
        if (count === 5) audio.pause();
        else audio.play();
      }, 500)
    };
  }

  const onChangeInput = (text: string, item: any) => {
    if (text === item.name) {
      writeWordSuccessLog(item.id, 2);
      openNotificationWithIcon('success');
    }
  };

  

  const onChangeType = (value: LearnType) => {
    setTypeLearn(value);
  };
  const onChangeWordType = (value: WordType) => {
    setTypeWord(value);
    setParams((prev: any) => {
      return { ...prev, page: 1, wordType: value };
    });
  };
  const onChangeFind = () => {
    fetchData();
  };

  const onChangePagination: PaginationProps['onChange'] = (pageNumber) => {
    setParams((prev: any) => {
      return {...prev, page: pageNumber };
    })
  };

  const getTitle = (title: string) => {
    title = title.toLowerCase();
    if (typeLearn === LearnType.LEARN_VOCABULARY) return `${title[0]}${'*'.padEnd(title.length - 1, '*')}`;
    else return title;
  }

  
  
  useEffect(() => {
    fetchData();
  }, [params]);
  
  return (
    <div className="max-w-screen-2xl items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] m-home">
      <Row gutter={24}>
        <Col span={24}>
          <Select
            style={{ width: '200px' }}
            showSearch
            onChange={onChangeType}
            placeholder="Select type"
            optionFilterProp="label"
            defaultValue={LearnType.LEARN_LISTEN}
            options={[
              {
                value: LearnType.LEARN_LISTEN,
                label: 'Học nghe',
              },
              {
                value: LearnType.LEARN_VOCABULARY,
                label: 'Học từ vựng',
              },
            ]}
          />
          <Select
            className="ml-2"
            style={{ width: '200px' }}
            showSearch
            onChange={onChangeWordType}
            placeholder="Select word"
            optionFilterProp="label"
            defaultValue={null}
            options={[
              {
                value: '',
                label: 'Tất cả từ',
              },
              {
                value: WordType.LEARN,
                label: 'Từ chưa học',
              },
              {
                value: WordType.LEARNED,
                label: 'Từ đã học',
              },
            ]}
          />

          <Input
            placeholder="Tìm cần tìm"
            className="ml-2"
            style={{ width: '200px' }}
          />
        </Col>
      </Row>

      <Button type="primary" className="mt-4" onClick={onChangeFind}>
        Refresh
      </Button>

      <Row gutter={24} className="mt-4">
        <Col span={24}>
          <Pagination
            total={data?.count}
            onChange={onChangePagination}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `Total ${total} items`}
          />
        </Col>
      </Row>

      <Row gutter={24} className="mt-4">
        <Flex wrap gap="20px">
          {data?.data?.map((item: any) => (
            <Card
              title={`${getTitle(item?.name)}`}
              bordered={false}
              style={{ width: 250, textAlign: 'center' }}
              key={item?.id}
            >
              <Flex justify={'space-between'} align={'center'}>
                <span>/{item?.pronunciation}/</span>
                <span>{item?.type}</span>
              </Flex>

              <Flex justify={'flex-start'} align={'center'}>
                <span>{item?.translation}</span>
              </Flex>

              <Flex justify={'flex-end'} align={'center'}>
                {item?.listen && (
                  <Tag color="blue">L-{item?.listen?.count}</Tag>
                )}
                {item?.write && (
                  <Tag color="green">W-{item?.write?.count}</Tag>
                )}
                <Button
                  icon={<SoundOutlined />}
                  onClick={() => handleSoundOne(item)}
                />
                <Button
                  // type="primary"
                  className="ml-1"
                  icon={<SoundOutlined />}
                  onClick={() => handleSoundRepeat(item)}
                />
              </Flex>

              {typeLearn === LearnType.LEARN_VOCABULARY && (
                <Flex justify={'flex-start'} align={'center'} className="mt-1">
                  <Input.OTP
                    length={item.name.length}
                    onChange={(value) => onChangeInput(value, item)}
                  />
                </Flex>
              )}
            </Card>
          ))}
        </Flex>
      </Row>

      {contextHolder}
    </div>
  );
}
