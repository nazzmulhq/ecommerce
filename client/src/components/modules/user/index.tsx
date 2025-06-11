"use client";

import QuickUI from "@components/common/AppCRUDOperation";
import { FormSchema } from "@components/common/AppForm/form.type";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const UserCRUD = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [users, setUsers] = useState([
        {
            id: "1",
            firstName: "John",
            lastName: "Doe",
            email: "n@gmail.com",
            phone: "123-456-7890",
            role: "user",
        },
    ]);

    // Parse current route
    const pathSegments = pathname.split("/").filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];
    const secondLastSegment = pathSegments[pathSegments.length - 2];

    let currentAction: "list" | "create" | "edit" | "view" = "list";
    let currentRecordId: string | undefined;

    if (lastSegment === "create") {
        currentAction = "create";
    } else if (lastSegment === "edit") {
        currentAction = "edit";
        currentRecordId = secondLastSegment;
    } else if (lastSegment !== "users" && lastSegment !== "create") {
        currentAction = "view";
        currentRecordId = lastSegment;
    }

    // Permission system
    const checkPermission = (permission: string | string[]): boolean => {
        return true;
    };

    // Form schema
    const userSchema: FormSchema = {
        layout: "vertical",
        sections: [
            {
                title: "Personal Information",
                fields: [
                    { name: "firstName", label: "First Name", type: "input", required: true },
                    { name: "lastName", label: "Last Name", type: "input", required: true },
                    { name: "email", label: "Email", type: "input", required: true, filterable: true },
                    { name: "phone", label: "Phone", type: "input" },
                ],
            },
            {
                title: "Account Settings",
                fields: [
                    {
                        name: "role",
                        label: "Role",
                        type: "select",
                        options: [
                            { value: "user", label: "User" },
                            { value: "admin", label: "Administrator" },
                            { value: "moderator", label: "Moderator" },
                        ],
                        filterable: true,
                    },
                    { name: "active", label: "Active", type: "switch", defaultValue: true },
                    { name: "department", label: "Department", type: "select", options: [], filterable: true },
                ],
            },
        ],
    };

    return (
        <QuickUI
            title="User Management"
            formSchema={userSchema}
            crudType="route"
            // Route configuration
            routeConfig={{
                basePath: "/configuration/users",
                createPath: "/dashboard/users/create",
                editPath: "/dashboard/users/[id]/edit",
                viewPath: "/dashboard/users/[id]",
                listPath: "/configuration/users",
                paramName: "id",
            }}
            currentAction={currentAction}
            currentRecordId={currentRecordId}
            // Permissions
            permissions={{
                view: "users.view",
                create: "users.create",
                edit: ["users.edit", "users.admin"],
                delete: "users.delete",
                filter: "users.filter",
            }}
            checkPermission={checkPermission}
            // Navigation
            onNavigate={path => router.push(path)}
            // CRUD handlers
            onRecordCreate={async userData => {
                const response = await fetch("/api/users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userData),
                });
                const newUser = await response.json();
                // setUsers(prev => [...prev, newUser]);
                return newUser;
            }}
            onRecordUpdate={async userData => {
                const response = await fetch(`/api/users/${userData.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userData),
                });
                const updatedUser = await response.json();
                // setUsers(prev => prev.map(u => u.id === userData.id ? updatedUser : u));
                return updatedUser;
            }}
            onRecordFilter={async (data, filter) => {
                console.log("Filtering data:", { data, filter });
                return data.filter(user => {
                    return Object.keys(filter).every(key => {
                        if (key === "firstName" && filter.firstName) {
                            return user.firstName.toLowerCase().includes(filter.firstName.toLowerCase());
                        }
                        if (key === "lastName" && filter.lastName) {
                            return user.lastName.toLowerCase().includes(filter.lastName.toLowerCase());
                        }
                        if (key === "email" && filter.email) {
                            return user.email.toLowerCase().includes(filter.email.toLowerCase());
                        }
                        if (key === "role" && filter.role) {
                            return user.role === filter.role;
                        }
                        return true;
                    });
                });
            }}
        />
    );
};

export default UserCRUD;
