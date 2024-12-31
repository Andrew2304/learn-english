/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { SoundOutlined } from '@ant-design/icons';
import { Button, Card, Col, Flex, Input, notification, Pagination, PaginationProps, Row, Select, Switch, Tag } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { apiUrl, LearnType, LogType, WordType } from '../helpers';

type NotificationType = 'success' | 'info' | 'warning' | 'error';


export default function Home() {
  const [params, setParams] = useState<any>({
    wordType: null,
    keyword: null,
    page: 1
  });
  const [data, setData] = useState<any>(null);
  const [historyData, setHistoryData] = useState<any>(null);
  const [typeLearn, setTypeLearn] = useState(LearnType.LEARN_LISTEN);
  const [typeWord, setTypeWord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isShowHistory, setIsShowHistory] = useState(false);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type: NotificationType, message?: string) => {
    api[type]({
      message: '',
      description: message ? message : 'Write success',
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

  const fetchHistoryData = async () => {
    setLoading(true);
    try {
      // const take = 10;
      // const skip = (params.page - 1) * take;
      const response = await axios.get(
        `${apiUrl}/histories?take=1000&skip=0`,
      );
      setHistoryData(response.data);
    } catch (err: any) {
      setError(err.message);
      console.log('error fetchHistoryData');
    } finally {
      setLoading(false);
    }
  };


  const writeWordSuccessLog = async (wordId: number, type: LogType, description?: string) => {
    try {
      await axios.post(`${apiUrl}/histories`, {
        wordId,
        type: LogType[type],
        description,
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
      writeWordSuccessLog(item?.id, LogType.LISTEN);
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
    if (text === item.name.toLowerCase()) {
      writeWordSuccessLog(item.id, LogType.WRITE);
      openNotificationWithIcon('success');
    }
    if (text.length === item.name.length && text !== item.name.toLowerCase()) {
      writeWordSuccessLog(item.id, LogType.WRITE_ERROR, text);
      openNotificationWithIcon('error', 'Write error');
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
  const changeIsShowHistory = (value: any) => {
    setIsShowHistory(value);
  };
  const onChangeFind = () => {
    fetchData();
    fetchHistoryData();
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
    fetchHistoryData();
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
          <Switch onChange={changeIsShowHistory}/> <span>History</span>
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
                <b>{item?.translation}</b>
              </Flex>

              {typeLearn === LearnType.LEARN_VOCABULARY && (
                <Flex justify={'flex-start'} align={'center'} className="mt-2">
                  <Input.OTP
                    length={item.name.length}
                    onChange={(value) => onChangeInput(value, item)}
                  />
                </Flex>
              )}

              <Flex justify={'flex-end'} align={'center'} className="mt-2">
                {item?.listen && (
                  <Tag color="blue">L-{item?.listen?.count}</Tag>
                )}
                {item?.write && <Tag color="green">W-{item?.write?.count}</Tag>}
                <Button
                  tabIndex={-1}
                  icon={<SoundOutlined />}
                  onClick={() => handleSoundOne(item)}
                />
                <Button
                  tabIndex={-1}
                  // type="primary"
                  className="ml-1"
                  icon={<SoundOutlined />}
                  onClick={() => handleSoundRepeat(item)}
                />
              </Flex>
            </Card>
          ))}
        </Flex>
      </Row>

      <Row gutter={24} className="mt-4">
        <Col span={24}>
          <Card title="Card title" bordered={false} style={{ width: 300 }}>
            <Flex justify={'space-between'} align={'center'}>
              <span>Tồng từ đúng:</span>
              <span>{historyData?.learnedCount}</span>
            </Flex>
            <Flex justify={'space-between'} align={'center'}>
              <span>Tồng từ sai:</span>
              <span>{historyData?.wordErrorData?.total}</span>
            </Flex>
            <Flex justify={'space-between'} align={'center'}>
              <span>Tổng từ chưa học:</span>
              <span>
                {data?.count -
                  historyData?.learnedCount -
                  historyData?.wordErrorData?.total}
              </span>
            </Flex>
          </Card>
        </Col>
      </Row>

      {isShowHistory === true && (
        <Row gutter={24} className="mt-4">
          <Flex wrap gap="20px">
            {historyData?.wordErrorData?.data?.map((item: any) => (
              <Card
                title={`${getTitle(item?.name)} - ${item.count}`}
                bordered={false}
                style={{ width: 250, textAlign: 'center' }}
                key={item?.id}
              >
                <Flex justify={'space-between'} align={'center'}>
                  <span>/{item?.pronunciation}/</span>
                  <span>{item?.type}</span>
                </Flex>

                <Flex justify={'flex-start'} align={'center'}>
                  <b>{item?.translation}</b>
                </Flex>

                {typeLearn === LearnType.LEARN_VOCABULARY && (
                  <Flex justify={'flex-start'} align={'center'} className="mt-2">
                    <Input.OTP
                      length={item.name.length}
                      onChange={(value) => onChangeInput(value, item)}
                    />
                  </Flex>
                )}

                <Flex justify={'flex-end'} align={'center'} className="mt-2">
                  {item?.listen && (
                    <Tag color="blue">L-{item?.listen?.count}</Tag>
                  )}
                  {item?.write && <Tag color="green">W-{item?.write?.count}</Tag>}
                  <Button
                    tabIndex={-1}
                    icon={<SoundOutlined />}
                    onClick={() => handleSoundOne(item)}
                  />
                  <Button
                    tabIndex={-1}
                    // type="primary"
                    className="ml-1"
                    icon={<SoundOutlined />}
                    onClick={() => handleSoundRepeat(item)}
                  />
                </Flex>
              </Card>
            ))}
          </Flex>
        </Row>
      )}

      {contextHolder}
    </div>
  );
}
