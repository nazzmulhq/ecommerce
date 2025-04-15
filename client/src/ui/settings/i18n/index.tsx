"use client";

import API from "@lib/apiCall";
import ENDPOINT from "@lib/apiCall/endpoint";
import { Button, Col, Input, Row, Table } from "antd";
import { ChangeEvent, FC, useEffect, useState } from "react";

export interface II18n {
    id: string;
    title: string;
    en: string;
    bn: string;
}

interface Translations {
    [key: string]: string;
}

interface Locales {
    en: Translations;
    bn: Translations;
}

const I18n: FC = () => {
    const [i18nData, setI18nData] = useState<II18n[]>([]);

    const onChange = (e: ChangeEvent<HTMLInputElement>, record: II18n) => {
        const isDuplicate = i18nData.some(i18n => i18n.title === e.target.value);
        if (isDuplicate) {
            return;
        }
        const newI18nData = [...i18nData];
        const index = newI18nData.indexOf(record);
        newI18nData[index] = {
            ...record,
            [e.target.name]: e.target.value,
        };
        setI18nData(newI18nData);
    };

    const onSave = async () => {
        const data: Locales = {
            en: {},
            bn: {},
        };
        i18nData.forEach(i18n => {
            data.en[i18n.title] = i18n.en;
            data.bn[i18n.title] = i18n.bn;
        });
        const response = await API.post(ENDPOINT.SETTINGS.I18N, {
            languages: Object.keys(data),
            data,
        });
        console.log(response);
    };

    const columns = [
        {
            title: "Key",
            dataIndex: "title",
            key: "title",
            render: (text: string, record: II18n) => (
                <Input
                    allowClear
                    key={record.id}
                    name="title"
                    onChange={e => {
                        onChange(e, record);
                    }}
                    type="text"
                    value={text}
                />
            ),
        },
        {
            title: "Value",
            dataIndex: "value",
            key: "value",
            children: [
                {
                    title: "English",
                    dataIndex: "en",
                    key: "en",
                    render: (text: string, record: II18n) => (
                        <Input
                            allowClear
                            key={record.id}
                            name="en"
                            onChange={e => {
                                onChange(e, record);
                            }}
                            type="text"
                            value={text}
                        />
                    ),
                },
                {
                    title: "বাংলা",
                    dataIndex: "bn",
                    key: "bn",
                    render: (text: string, record: II18n) => (
                        <Input
                            allowClear
                            key={record.id}
                            name="bn"
                            onChange={e => {
                                onChange(e, record);
                            }}
                            type="text"
                            value={text}
                        />
                    ),
                },
            ],
        },
        {
            title: "Action",
            key: "action",
            width: "5%",
            render: (text: string, record: II18n) => (
                <Button
                    danger
                    htmlType="button"
                    onClick={() => {
                        const newI18nData = i18nData.filter(i18n => i18n.title !== record.title);
                        setI18nData(newI18nData);
                    }}
                    type="primary"
                >
                    Remove
                </Button>
            ),
        },
    ];

    const formatData = (res: Locales) => {
        console.log(res);
        const data: Locales = res;
        if (!data || !data.en || !data.bn) {
            return [];
        }
        return Object.keys(data.en).map(key => ({
            key,
            id: key,
            title: key,
            en: data.en[key],
            bn: data.bn[key],
        }));
    };

    useEffect(() => {
        // Fetch i18n data from the server
        const fetchData = async () => {
            const response = await API.get<II18n[]>(ENDPOINT.SETTINGS.I18N, {}, formatData);
            setI18nData(response);
        };
        fetchData();
    }, []);

    return (
        <div
            style={{
                padding: "20px",
            }}
        >
            <Row gutter={24}>
                <Col span={24}>
                    <Button
                        htmlType="submit"
                        onClick={onSave}
                        style={{
                            marginRight: "10px",
                        }}
                        type="primary"
                    >
                        Save
                    </Button>
                    <Button
                        htmlType="button"
                        onClick={() => {
                            const newI18nData = [...i18nData];
                            newI18nData.push({
                                id: `${Date.now()}-${Math.random()}`,
                                title: "",
                                en: "",
                                bn: "",
                            });
                            setI18nData(newI18nData);
                        }}
                        type="primary"
                    >
                        Add
                    </Button>
                    <Table
                        bordered
                        columns={columns}
                        dataSource={i18nData}
                        pagination={false}
                        size="small"
                        style={{
                            marginTop: "10px",
                        }}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default I18n;
