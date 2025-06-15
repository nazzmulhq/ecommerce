"use server";

import { getCookie } from "@lib/actions";

interface SelectOption {
    value: any;
    label: string;
    data?: any;
}

interface FetchOptionsParams {
    url: string;
    searchTerm?: string;
    searchParam?: string;
    valueField?: string;
    labelField?: string;
    pageSize?: number;
}

export async function fetchSelectOptions({
    url,
    searchTerm = "",
    searchParam = "search",
    valueField = "id",
    labelField = "name",
    pageSize = 50,
}: FetchOptionsParams): Promise<SelectOption[]> {
    try {
        // Get auth token
        const token = await getCookie("token");

        // Build API URL with proper base URL
        const baseUrl = `${process.env.API_URL}${url}`;
        const searchParams = new URLSearchParams();

        if (searchTerm) {
            searchParams.append(searchParam, searchTerm);
        }
        searchParams.append("page", "1");
        searchParams.append("pageSize", pageSize.toString());

        const apiUrl = `${baseUrl}?${searchParams.toString()}`;

        const response = await fetch(apiUrl, {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            next: { tags: ["permissions"] }, // Cache for 1 minute
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Handle different response formats
        const items = Array.isArray(result.data.list) ? result.data.list : [];

        const formattedOptions: SelectOption[] = items.map((item: any) => ({
            value: item[valueField],
            label: item[labelField],
            data: item,
        }));

        return formattedOptions;
    } catch (error: any) {
        console.error("Error fetching select options:", error);
        return [];
    }
}

export async function fetchSelectOptionById({
    url,
    optionId,
    valueField = "id",
    labelField = "name",
}: {
    url: string;
    optionId: any;
    valueField?: string;
    labelField?: string;
}): Promise<SelectOption | null> {
    try {
        if (!url || optionId === undefined || optionId === null) return null;

        const token = await getCookie("token");
        const apiUrl = `${process.env.API_URL}${url}/${optionId}`;

        const response = await fetch(apiUrl, {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            next: { tags: ["permissions"] }, // Cache for 5 minutes
        });

        if (response.ok) {
            const result = await response.json();
            const item = result.data || result;

            const option: SelectOption = {
                value: item[valueField],
                label: item[labelField],
                data: item,
            };

            return option;
        }

        return null;
    } catch (error) {
        console.error("Error fetching select option by ID:", error);
        // Return a fallback item to show something instead of breaking
        return {
            value: optionId,
            label: `Item ${optionId}`,
            data: null,
        };
    }
}

// Batch fetch multiple options by IDs
export async function fetchSelectOptionsByIds({
    url,
    optionIds,
    valueField = "id",
    labelField = "name",
}: {
    url: string;
    optionIds: any[];
    valueField?: string;
    labelField?: string;
}): Promise<SelectOption[]> {
    try {
        if (!url || !optionIds.length) return [];

        // Fetch all options in parallel
        const fetchPromises = optionIds.map(id => fetchSelectOptionById({ url, optionId: id, valueField, labelField }));

        const results = await Promise.allSettled(fetchPromises);

        return results
            .filter(
                (result): result is PromiseFulfilledResult<SelectOption> =>
                    result.status === "fulfilled" && result.value !== null,
            )
            .map(result => result.value);
    } catch (error) {
        console.error("Error fetching select options by IDs:", error);
        return [];
    }
}
