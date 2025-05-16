"use client";

import { Button, Card, Col, Input, message, Row, Space, Table } from "antd";
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
    const [refetch, setFetch] = useState(0);

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
        // const response = await API.post(ENDPOINT.SETTINGS.I18N, {
        //     languages: Object.keys(data),
        //     data,
        // });
        const response = await fetch("/api/i18n", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                languages: Object.keys(data),
                data,
            }),
        });
        if (!response.ok) {
            console.error("Failed to save i18n data");
            return;
        }

        message.success("I18n data saved successfully");
    };

    const onFilterReset = (e: any, clearFilters: any) => {
        if (clearFilters) {
            clearFilters();
        }
        setFetch(prev => prev + 1);
    };

    const columns = [
        {
            title: "Key",
            dataIndex: "title",
            key: "title",
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
                <div style={{ padding: 8 }}>
                    <Input
                        allowClear
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onClear={() => confirm()}
                        onPressEnter={() => confirm()}
                        placeholder="Search Key"
                        style={{ marginBottom: 8, display: "block" }}
                        value={selectedKeys[0]}
                    />
                    <Space>
                        <Button onClick={() => confirm()} size="small" style={{ width: 90 }} type="primary">
                            Search
                        </Button>
                        <Button onClick={e => onFilterReset(e, clearFilters)} size="small" style={{ width: 90 }}>
                            Reset
                        </Button>
                    </Space>
                </div>
            ),
            onFilter: (value: any, record: any) => record.title.toLowerCase().includes(value.toLowerCase()),
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
                    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
                        <div style={{ padding: 8 }}>
                            <Input
                                onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                                onPressEnter={() => confirm()}
                                placeholder="Search English"
                                style={{ marginBottom: 8, display: "block" }}
                                value={selectedKeys[0]}
                            />
                            <Space>
                                <Button onClick={() => confirm()} size="small" style={{ width: 90 }} type="primary">
                                    Search
                                </Button>
                                <Button
                                    onClick={e => onFilterReset(e, clearFilters)}
                                    size="small"
                                    style={{ width: 90 }}
                                >
                                    Reset
                                </Button>
                            </Space>
                        </div>
                    ),
                    onFilter: (value: any, record: any) => record.en.toLowerCase().includes(value.toLowerCase()),
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
                    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
                        <div style={{ padding: 8 }}>
                            <Input
                                onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                                onPressEnter={() => confirm()}
                                placeholder="Search বাংলা"
                                style={{ marginBottom: 8, display: "block" }}
                                value={selectedKeys[0]}
                            />
                            <Space>
                                <Button onClick={() => confirm()} size="small" style={{ width: 90 }} type="primary">
                                    Search
                                </Button>
                                <Button
                                    onClick={e => onFilterReset(e, clearFilters)}
                                    size="small"
                                    style={{ width: 90 }}
                                >
                                    Reset
                                </Button>
                            </Space>
                        </div>
                    ),
                    onFilter: (value: any, record: any) => record.bn.toLowerCase().includes(value.toLowerCase()),
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
            const response = await fetch("/api/i18n", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                console.error("Failed to fetch i18n data");
                return;
            }
            const data = await response.json();
            const formattedData = formatData(data);
            setI18nData(formattedData);
        };
        fetchData();
    }, [refetch]);

    return (
        <Card
            title="Language"
            extra={
                <>
                    <Space>
                        <Button htmlType="submit" onClick={onSave} type="primary">
                            Save I18n
                        </Button>
                        <Button
                            htmlType="button"
                            onClick={() => {
                                const newI18nData = [
                                    {
                                        id: `${Date.now()}-${Math.random()}`,
                                        title: "",
                                        en: "",
                                        bn: "",
                                    },
                                    ...i18nData,
                                ];
                                setI18nData(newI18nData);
                            }}
                            type="primary"
                        >
                            Add New
                        </Button>
                    </Space>
                </>
            }
        >
            <Row gutter={24} justify="end">
                <Col span={24}>
                    <Table
                        id="i18n-table"
                        bordered
                        columns={columns}
                        dataSource={i18nData}
                        size="small"
                        style={{
                            marginTop: "10px",
                        }}
                    />
                </Col>
            </Row>
        </Card>
    );
};

export default I18n;
