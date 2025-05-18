"use client";

import { Button, Card, Col, Input, message, Row, Space, Table } from "antd";
import { ChangeEvent, FC, useEffect, useState } from "react";

export interface II18n {
    id: string;
    title: string;
    [key: string]: string | object | any;
}

interface Translations {
    [key: string]: string;
}

interface Locales {
    en: Translations;
    bn: Translations;
    [key: string]: Translations; // Add this index signature to allow string indexing
}

const I18n: FC = () => {
    const [i18nData, setI18nData] = useState<II18n[]>([]);
    const [refetch, setFetch] = useState(0);

    // Function to get available languages from the data
    const getAvailableLanguages = (): string[] => {
        if (!i18nData.length) return ["en", "bn"]; // Default languages

        const languages = new Set<string>();
        i18nData.forEach(item => {
            Object.keys(item).forEach(key => {
                if (key !== "id" && key !== "title") {
                    languages.add(key);
                }
            });
        });

        return Array.from(languages);
    };

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
        const data: Locales = {} as Locales;
        const languages = getAvailableLanguages();

        // Initialize language objects
        languages.forEach(lang => {
            data[lang] = {};
        });

        i18nData.forEach(i18n => {
            languages.forEach(lang => {
                data[lang][i18n.title] = i18n[lang] || "";
            });
        });

        const response = await fetch("/api/i18n", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                languages,
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

    // Generate language columns dynamically
    const generateLanguageColumns = () => {
        const languages = getAvailableLanguages();

        return languages.map(lang => ({
            title: lang === "en" ? "English" : lang === "bn" ? "বাংলা" : lang.toUpperCase(),
            dataIndex: lang,
            key: lang,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
                <div style={{ padding: 8 }}>
                    <Input
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        placeholder={`Search ${lang}`}
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
            onFilter: (value: any, record: any) =>
                record[lang] && record[lang].toLowerCase().includes(value.toLowerCase()),
            render: (text: string, record: II18n) => (
                <Input
                    allowClear
                    key={record.id}
                    name={lang}
                    onChange={e => {
                        onChange(e, record);
                    }}
                    type="text"
                    value={text || ""}
                />
            ),
        }));
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
            children: generateLanguageColumns(),
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
        if (!res || Object.keys(res).length === 0) {
            return [];
        }

        // Get all unique keys from all language objects
        const allKeys = new Set<string>();
        Object.values(res).forEach(langObj => {
            if (langObj && typeof langObj === "object") {
                Object.keys(langObj).forEach(key => allKeys.add(key));
            }
        });

        // Create i18n data array
        return Array.from(allKeys).map(key => {
            const item: II18n = {
                id: key,
                title: key,
            };

            // Add translations for each language
            Object.keys(res).forEach(lang => {
                if (res[lang] && typeof res[lang] === "object") {
                    item[lang] = res[lang][key] || "";
                }
            });

            return item;
        });
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
            const formattedData = formatData(data)?.map((item: II18n) => ({
                ...item,
                key: item.title,
            }));
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
                                const languages = getAvailableLanguages();
                                const newEntry: II18n = {
                                    id: `${Date.now()}-${Math.random()}`,
                                    title: "",
                                };

                                // Add empty values for each available language
                                languages.forEach(lang => {
                                    newEntry[lang] = "";
                                });

                                const newI18nData = [newEntry, ...i18nData];
                                setI18nData(newI18nData);
                            }}
                            type="primary"
                        >
                            Add New Row
                        </Button>
                    </Space>
                </>
            }
        >
            <Row gutter={24} justify="end">
                <Col span={24}>
                    <Table id="i18n-table" bordered columns={columns} dataSource={i18nData} size="small" />
                </Col>
            </Row>
        </Card>
    );
};

export default I18n;
