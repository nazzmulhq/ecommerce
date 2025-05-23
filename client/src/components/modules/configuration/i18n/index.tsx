"use client";

/**
 * I18n Configuration Module
 *
 * This component provides an interface for managing application translations.
 * It allows users to add, edit, filter, and save language key-value pairs.
 */

import AppIcons from "@components/common/AppIcons";
import { App, Button, Card, Col, Collapse, Form, Input, Modal, Row, Space, Table, Tooltip } from "antd";
import { FC, useEffect, useState } from "react";

// Type Definitions
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
    [key: string]: Translations;
}

/**
 * I18n Configuration Component
 *
 * Provides an interface for managing multilingual content in the application.
 */
const I18n: FC = () => {
    // State Management
    const [i18nData, setI18nData] = useState<II18n[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [refetch, setFetch] = useState(0);
    const [editingKey, setEditingKey] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRecord, setCurrentRecord] = useState<II18n | null>(null);
    const [filterVisible, setFilterVisible] = useState(false);
    const [filteredData, setFilteredData] = useState<II18n[]>([]);

    // Get message from App
    const { message } = App.useApp();

    // Form instances
    const [editForm] = Form.useForm();
    const [filterForm] = Form.useForm();

    /**
     * Returns an array of available languages from the data
     * Default returns ["en", "bn"] if no data is available
     */
    const getAvailableLanguages = (): string[] => {
        if (!i18nData.length) return ["en", "bn"]; // Default languages

        const languages = new Set<string>();
        i18nData.forEach(item => {
            Object.keys(item).forEach(key => {
                if (key !== "id" && key !== "title" && key !== "key") {
                    languages.add(key);
                }
            });
        });

        return Array.from(languages);
    };

    // CRUD Operations

    /**
     * Updates a translation value for a specific record and language
     * @param value - New translation value
     * @param record - The record being updated
     * @param lang - Language code
     */
    const handleChangeTranslation = (value: string, record: II18n, lang: string) => {
        setI18nData(prevData => prevData.map(item => (item.id === record.id ? { ...item, [lang]: value } : item)));
    };

    /**
     * Updates the key of a translation record
     * @param value - New key value
     * @param record - The record being updated
     */
    const handleChangeKey = (value: string, record: II18n) => {
        const isDuplicate = i18nData.some(i18n => i18n.id !== record.id && i18n.title === value);

        if (isDuplicate) {
            message.error("Key already exists!");
            return;
        }

        setI18nData(prevData => prevData.map(item => (item.id === record.id ? { ...item, title: value } : item)));
    };

    /**
     * Removes a translation record from the data
     * @param record - The record to remove
     */
    const handleRemoveRow = (record: II18n) => {
        setI18nData(prevData => prevData.filter(item => item.id !== record.id));
        message.success("Row removed successfully");
    };

    /**
     * Saves all translation data to the server
     */
    const handleSave = async () => {
        try {
            setLoading(true);
            const data: Locales = {} as Locales;
            const languages = getAvailableLanguages();

            // Initialize language objects
            languages.forEach(lang => {
                data[lang] = {};
            });

            // Filter out entries with empty keys
            const validEntries = i18nData.filter(entry => entry.title.trim() !== "");

            // Populate data object
            validEntries.forEach(i18n => {
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
                throw new Error("Failed to save i18n data");
            }

            message.success("I18n data saved successfully");
            setFetch(prev => prev + 1); // Refresh data after save
        } catch (error) {
            message.error(error instanceof Error ? error.message : "An error occurred while saving");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Formats raw translation data from the API into structured I18n objects
     * @param res - Raw translation data from API
     */
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

    // Modal Operations

    /**
     * Opens the add/edit modal and populates form if editing
     * @param record - Record to edit (null for adding new)
     */
    const handleAddOrEdit = (record: II18n | null = null) => {
        if (record) {
            // edit
            setCurrentRecord(record);
            setIsModalOpen(true);

            const formValues: any = { title: record.title };
            getAvailableLanguages().forEach(lang => {
                formValues[lang] = record[lang] || "";
            });

            editForm.setFieldsValue(formValues);
        } else {
            //add
            setCurrentRecord(record);
            setIsModalOpen(true);
        }
    };

    /**
     * Closes the modal and resets the form
     */
    const handleModalCancel = () => {
        setIsModalOpen(false);
        setCurrentRecord(null);
        editForm.resetFields();
    };

    /**
     * Processes form submission for adding or editing translations
     */
    const handleModalSubmit = () => {
        editForm
            .validateFields()
            .then(values => {
                const newTitle = values.title.trim();

                // Validate the title
                if (!newTitle) {
                    message.error("Key cannot be empty!");
                    return;
                }

                // Check for duplicates
                const isDuplicate = i18nData.some(i18n => i18n.id !== currentRecord?.id && i18n.title === newTitle);

                if (isDuplicate) {
                    message.error("Key already exists!");
                    return;
                }

                // Handle both adding new item and editing existing item
                if (currentRecord) {
                    // Edit existing record
                    setI18nData(prevData =>
                        prevData.map(item => {
                            if (item.id === currentRecord.id) {
                                const updatedItem = { ...item };
                                updatedItem.title = newTitle;

                                // Update all language values
                                getAvailableLanguages().forEach(lang => {
                                    updatedItem[lang] = values[lang] || "";
                                });

                                return updatedItem;
                            }
                            return item;
                        }),
                    );
                    message.success("Entry updated successfully");
                } else {
                    // Add new record
                    const newEntry: II18n = {
                        id: `key_${Date.now()}`,
                        title: newTitle,
                        key: `key_${Date.now()}`,
                    };

                    // Add language values
                    getAvailableLanguages().forEach(lang => {
                        newEntry[lang] = values[lang] || "";
                    });

                    setI18nData(prevData => [newEntry, ...prevData]);
                    message.success("New entry added successfully");
                }

                // Reset form and close modal
                setIsModalOpen(false);
                setCurrentRecord(null);
                editForm.resetFields();
            })
            .catch(error => {
                console.error("Validation failed:", error);
            });
    };

    // Filtering Operations

    /**
     * Filters data based on search criteria
     * @param values - Form values containing filter criteria
     */
    const handleFilter = (values: any) => {
        let result = [...i18nData];

        // Filter by key if provided
        if (values.keyFilter) {
            const keyFilter = values.keyFilter.trim().toLowerCase();
            result = result.filter(item => item.title.toLowerCase().includes(keyFilter));
        }

        // Filter by language content if provided
        getAvailableLanguages().forEach(lang => {
            if (values[`${lang}Filter`]) {
                const langFilter = values[`${lang}Filter`].trim().toLowerCase();
                result = result.filter(item => item[lang] && item[lang].toLowerCase().includes(langFilter));
            }
        });

        setFilteredData(result);
        message.success(`Found ${result.length} matching entries`);
    };

    /**
     * Resets all filters and restores original data
     */
    const resetFilter = () => {
        filterForm.resetFields();
        setFilteredData(i18nData);
    };

    // UI Generation

    /**
     * Generates table columns for each available language
     */
    const generateLanguageColumns = () => {
        const languages = getAvailableLanguages();

        return languages
            .filter((lang: string) => lang !== "key")
            .map(lang => ({
                title: lang.toUpperCase(),
                dataIndex: lang,
                key: lang,
            }));
    };

    // Side Effects

    /**
     * Fetches translation data when component loads or refetch is triggered
     */
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/i18n", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch i18n data");
                }

                const data = await response.json();
                const formattedData = formatData(data)?.map((item: II18n) => ({
                    ...item,
                    key: item.title,
                }));

                setI18nData(formattedData);
            } catch (error) {
                console.error("Error fetching i18n data:", error);
                message.error("Failed to load translations");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [refetch]);

    /**
     * Updates filtered data when the main data changes
     */
    useEffect(() => {
        setFilteredData(i18nData);
    }, [i18nData]);

    // Table Configuration
    const columns = [
        {
            title: "Key",
            dataIndex: "title",
            key: "title",
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
            render: (_: string, record: II18n) => (
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleAddOrEdit(record)}
                        icon={<AppIcons name="AiOutlineEdit" />}
                    />

                    <Button
                        danger
                        htmlType="button"
                        onClick={() => handleRemoveRow(record)}
                        icon={<AppIcons name="AiOutlineDelete" />}
                    />
                </Space>
            ),
        },
    ];

    return (
        <App>
            <Card
                title="Language Configuration"
                extra={
                    <Space>
                        <Tooltip title="Filter">
                            <Button
                                icon={<AppIcons name="AiFillFilter" />}
                                onClick={() => setFilterVisible(!filterVisible)}
                                type={filterVisible ? "primary" : "default"}
                            />
                        </Tooltip>
                        <Tooltip title="Save to Database">
                            <Button
                                htmlType="submit"
                                onClick={handleSave}
                                type="primary"
                                loading={loading}
                                icon={<AppIcons name="AiOutlineSave" />}
                            >
                                Submit
                            </Button>
                        </Tooltip>
                        <Tooltip title="Add New Translation">
                            <Button
                                htmlType="button"
                                onClick={() => handleAddOrEdit()}
                                type="primary"
                                icon={<AppIcons name="AiOutlinePlus" />}
                            />
                        </Tooltip>
                    </Space>
                }
            >
                {/* Filter Section */}
                <Row gutter={24}>
                    <Col span={24}>
                        <Collapse
                            defaultActiveKey={["1"]}
                            style={{ marginBottom: 16 }}
                            onChange={() => setFilterVisible(!filterVisible)}
                            activeKey={filterVisible ? "1" : ""}
                            items={[
                                {
                                    key: "1",
                                    label: "Filter Options",
                                    children: (
                                        <Form form={filterForm} layout="vertical" onFinish={handleFilter}>
                                            <Row gutter={16}>
                                                <Col span={8}>
                                                    <Form.Item name="keyFilter" label="Filter by Key">
                                                        <Input placeholder="Search by key" />
                                                    </Form.Item>
                                                </Col>

                                                {getAvailableLanguages().map(lang => (
                                                    <Col span={8} key={`${lang}Filter`}>
                                                        <Form.Item
                                                            name={`${lang}Filter`}
                                                            label={`Filter by ${lang.toUpperCase()}`}
                                                        >
                                                            <Input placeholder={`Search in ${lang.toUpperCase()}`} />
                                                        </Form.Item>
                                                    </Col>
                                                ))}
                                            </Row>

                                            <Row>
                                                <Col span={24} style={{ textAlign: "right" }}>
                                                    <Space>
                                                        <Button onClick={resetFilter}>Reset</Button>
                                                        <Button type="primary" htmlType="submit">
                                                            Apply Filter
                                                        </Button>
                                                    </Space>
                                                </Col>
                                            </Row>
                                        </Form>
                                    ),
                                },
                            ]}
                        />
                    </Col>

                    {/* Table Section */}
                    <Col span={24}>
                        <Table
                            id="i18n-table"
                            bordered
                            columns={columns}
                            dataSource={filteredData}
                            size="small"
                            loading={loading}
                            pagination={{
                                showTotal: total => `Total ${total} items`,
                                showSizeChanger: true,
                                pageSizeOptions: ["10", "20", "50", "100"],
                            }}
                            rowKey="id"
                            // Add table-level filtering for quick search
                            onChange={(pagination, filters, sorter, extra) => {
                                // Example: filter by key or any language value
                                // You can customize this logic as needed
                                if (filters && filters.search) {
                                    const search = String(filters.search).toLowerCase();
                                    const filtered = filteredData.filter(
                                        item =>
                                            item.title.toLowerCase().includes(search) ||
                                            getAvailableLanguages().some(lang =>
                                                (item[lang] || "").toLowerCase().includes(search),
                                            ),
                                    );
                                    setFilteredData(filtered);
                                }
                            }}
                        />
                    </Col>
                </Row>
            </Card>

            {/* Edit/Add Modal */}
            <Modal
                title={currentRecord ? "Edit Translation" : "Add New Translation"}
                open={isModalOpen}
                onCancel={handleModalCancel}
                footer={[
                    <Button key="back" onClick={handleModalCancel}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleModalSubmit}>
                        {currentRecord ? "Update" : "Add"}
                    </Button>,
                ]}
            >
                <Form form={editForm} layout="vertical" name="editTranslationForm">
                    <Form.Item name="title" label="Key" rules={[{ required: true, message: "Please enter a key!" }]}>
                        <Input />
                    </Form.Item>

                    {getAvailableLanguages().map(lang => (
                        <Form.Item key={lang} name={lang} label={lang.toUpperCase()}>
                            <Input />
                        </Form.Item>
                    ))}
                </Form>
            </Modal>
        </App>
    );
};

// Wrap with App provider to provide message context
const I18nWithApp: FC = () => (
    <App>
        <I18n />
    </App>
);

export default I18nWithApp;
