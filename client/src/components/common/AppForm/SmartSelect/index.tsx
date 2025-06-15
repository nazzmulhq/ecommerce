import { Select, Spin } from "antd";
import React, { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { fetchSelectOptions, fetchSelectOptionsByIds } from "./action";

// Debounce utility function
const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    const debouncedFunction = (...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
    debouncedFunction.cancel = () => clearTimeout(timeoutId);
    return debouncedFunction;
};

interface SelectOption {
    value: any;
    label: string;
    data?: any;
}

interface SmartSelectProps {
    url?: string;
    value?: any;
    onChange?: (value: any, option?: SelectOption) => void;
    placeholder?: string;
    searchParam?: string;
    valueField?: string;
    labelField?: string;
    debounceMs?: number;
    pageSize?: number;
    mode?: "multiple" | "tags";
    disabled?: boolean;
    allowClear?: boolean;
    style?: React.CSSProperties;
    className?: string;
    size?: "small" | "middle" | "large";
    [key: string]: any;
}

const SmartSelect: React.FC<SmartSelectProps> = ({
    url,
    value,
    onChange,
    placeholder = "Select an option",
    searchParam = "search",
    valueField = "id",
    labelField = "name",
    debounceMs = 300,
    pageSize = 50,
    ...props
}) => {
    const [options, setOptions] = useState<SelectOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [recentOptions, setRecentOptions] = useState<SelectOption[]>([]);
    const [isPending, startTransition] = useTransition();
    const fetchRef = useRef<AbortController | null>(null);
    const initialLoadRef = useRef(false);

    // Storage keys for recent options
    const storageKey = `smart_select_recent_${url?.replace(/[^a-zA-Z0-9]/g, "_") || "default"}`;

    // Load recent options from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored) {
                const parsedOptions = JSON.parse(stored);
                setRecentOptions(Array.isArray(parsedOptions) ? parsedOptions : []);
            }
        } catch (error) {
            console.warn("Failed to load recent options:", error);
        }
    }, [storageKey]);

    // Save recent options to localStorage
    const saveRecentOptions = useCallback(
        (newRecent: SelectOption[]) => {
            try {
                localStorage.setItem(storageKey, JSON.stringify(newRecent));
            } catch (error) {
                console.warn("Failed to save recent options:", error);
            }
        },
        [storageKey],
    );

    // Fetch options using server action
    const fetchOptionsData = useCallback(
        async (search = "", isInitial = false) => {
            if (!url) return;

            // Cancel previous request
            if (fetchRef.current) {
                fetchRef.current.abort();
            }

            const controller = new AbortController();
            fetchRef.current = controller;

            try {
                setLoading(true);

                startTransition(async () => {
                    const formattedOptions = await fetchSelectOptions({
                        url,
                        searchTerm: search,
                        searchParam,
                        valueField,
                        labelField,
                        pageSize,
                    });

                    if (controller.signal.aborted) return;

                    if (isInitial && !search) {
                        // Merge with recent options for initial load
                        const mergedOptions = [...recentOptions];
                        formattedOptions.forEach(option => {
                            if (!mergedOptions.find(r => r.value === option.value)) {
                                mergedOptions.push(option);
                            }
                        });
                        setOptions(mergedOptions);
                    } else {
                        setOptions(formattedOptions);
                    }
                });
            } catch (error: any) {
                if (error.name !== "AbortError") {
                    console.error("Error fetching options:", error);
                }
            } finally {
                setLoading(false);
                fetchRef.current = null;
            }
        },
        [url, searchParam, valueField, labelField, pageSize, recentOptions],
    );

    // Debounced search function
    const debouncedFetch = useCallback(
        debounce((search: string) => fetchOptionsData(search), debounceMs),
        [fetchOptionsData, debounceMs],
    );

    // Initial load
    useEffect(() => {
        if (!initialLoadRef.current) {
            initialLoadRef.current = true;
            fetchOptionsData("", true);
        }
    }, [fetchOptionsData]);

    // Fetch missing options when value is set but not in options
    useEffect(() => {
        if (value !== undefined && value !== null && value !== "") {
            const valuesToCheck = Array.isArray(value) ? value : [value];
            const missingValues = valuesToCheck.filter(val => !options.find(opt => opt.value === val));

            if (missingValues.length > 0) {
                fetchMissingOptions(missingValues);
            }
        }
    }, [value, options]);

    // Fetch missing options using server action
    const fetchMissingOptions = async (missingValues: any[]) => {
        if (!url || !missingValues.length) return;

        try {
            setLoading(true);

            startTransition(async () => {
                const fetchedOptions = await fetchSelectOptionsByIds({
                    url,
                    optionIds: missingValues,
                    valueField,
                    labelField,
                });

                setOptions(prev => {
                    const newOptions = [...prev];
                    fetchedOptions.forEach(option => {
                        if (!newOptions.find(opt => opt.value === option.value)) {
                            newOptions.unshift(option); // Add to beginning for priority
                        }
                    });
                    return newOptions;
                });
            });
        } catch (error) {
            console.error("Error fetching missing options:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle option selection
    const handleChange = (selectedValue: any, option: any) => {
        // Update recent options for single selection
        if (selectedValue !== undefined && selectedValue !== null && option && !Array.isArray(selectedValue)) {
            const newRecent = [
                { value: selectedValue, label: option.children || option.label, data: option.data },
                ...recentOptions.filter(r => r.value !== selectedValue),
            ].slice(0, 10); // Keep only 10 recent items

            setRecentOptions(newRecent);
            saveRecentOptions(newRecent);
        }

        // Update recent options for multiple selection
        if (Array.isArray(selectedValue) && Array.isArray(option)) {
            const newSelections = option.map(opt => ({
                value: opt.value,
                label: opt.children || opt.label,
                data: opt.data,
            }));

            const newRecent = [
                ...newSelections,
                ...recentOptions.filter(r => !newSelections.find(ns => ns.value === r.value)),
            ].slice(0, 10);

            setRecentOptions(newRecent);
            saveRecentOptions(newRecent);
        }

        if (onChange) {
            onChange(selectedValue, option);
        }
    };

    // Handle search
    const handleSearch = (search: string) => {
        setSearchValue(search);
        if (search) {
            debouncedFetch(search);
        } else {
            // Show recent options when search is cleared
            setOptions(prev => {
                const merged = [...recentOptions];
                prev.forEach(option => {
                    if (!merged.find(r => r.value === option.value)) {
                        merged.push(option);
                    }
                });
                return merged;
            });
        }
    };

    // Get display options with recent items highlighted
    const displayOptions = options.map(option => {
        const isRecent = recentOptions.some(r => r.value === option.value);
        return {
            ...option,
            label: isRecent ? `${option.label} (Recent)` : option.label,
        };
    });

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (fetchRef.current) {
                fetchRef.current.abort();
            }
            debouncedFetch.cancel();
        };
    }, [debouncedFetch]);

    return (
        <Select
            showSearch
            value={value}
            placeholder={placeholder}
            onSearch={handleSearch}
            onChange={handleChange}
            loading={loading || isPending}
            notFoundContent={loading || isPending ? <Spin size="small" /> : "No data"}
            filterOption={false}
            searchValue={searchValue}
            style={{ width: "100%" }}
            allowClear
            {...props}
        >
            {displayOptions.map(option => (
                <Select.Option key={option.value} value={option.value} data={option.data}>
                    {option.label}
                </Select.Option>
            ))}
        </Select>
    );
};

export default SmartSelect;

// Export types for use in other components
export type { SelectOption, SmartSelectProps };
