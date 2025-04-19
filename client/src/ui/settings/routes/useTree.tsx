import API from "@lib/apiCall";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

// Define the Type enum
enum Type {
    Guest = "guest",
    Shared = "shared",
    Protected = "protected",
    DevOnly = "devOnly",
}
export interface INode {
    [key: string]: {
        id: string;
        type: Type;
        children: string[];
        parentId: string | null;
        name: string;
        path: string;
        isComponent: boolean;
        permissions: string[];
    };
}

const useTree = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const [initialMousePos, setInitialMousePos] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const [nodes, setNodes] = useState<INode>({
        "1": {
            id: "1",
            type: Type.Guest,
            children: [],
            parentId: null,
            name: "Demo",
            isComponent: false,
            path: "",
            permissions: [],
        },
    });

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        setDragging(true);
        setInitialMousePos({ x: event.clientX, y: event.clientY });
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (dragging) {
            setPosition(prevPos => ({
                x: prevPos.x + (event.clientX - initialMousePos.x),
                y: prevPos.y + (event.clientY - initialMousePos.y),
            }));
            setInitialMousePos({ x: event.clientX, y: event.clientY });
        }
    };

    const handleMouseUp = () => {
        setDragging(false);
    };
    const onSubmit = async () => {
        // Confirmation dialog
        const isConfirmed = window.confirm(
            "If you delete the node and children all node, you will lose the data.Are you sure you want to delete it?",
        );
        if (isConfirmed) {
            try {
                const response = await API.post<INode>("/routes", nodes);
                if (response.data) {
                    alert("Route created successfully.");
                } else {
                    alert("An error occurred while creating the route.");
                }
            } catch (error) {
                console.error("Error creating route:", error);
                alert("An error occurred while creating the route.");
            }
        }
    };

    const addNode = (nodeId: string) => {
        const newNodeId = uuidv4();

        const newNode = {
            id: newNodeId,
            type: Type.Guest,
            children: [],
            parentId: nodeId,
            name: "New Node",
            isComponent: nodes[nodeId].isComponent,
            path: nodes[nodeId].path + "/new-page",
            permissions: [],
        };
        setNodes({
            ...nodes,
            [newNodeId]: newNode,
            [nodeId]: {
                ...nodes[nodeId],
                children: [...nodes[nodeId].children, newNodeId],
            },
        });
    };

    const deleteNode = (nodeId: string) => {
        const parentId = nodes[nodeId].parentId;
        if (!parentId) {
            return;
        }
        const newNodes = { ...nodes };
        delete newNodes[nodeId];
        newNodes[parentId].children = newNodes[parentId].children.filter(childId => childId !== nodeId);
        setNodes(newNodes);
    };

    const onHandleChangeForIsComponent = (nodeId: string) => {
        const cloneNodes = JSON.parse(JSON.stringify(nodes)) as INode;
        const currentNode = cloneNodes[nodeId];
        cloneNodes[nodeId] = {
            ...currentNode,
            isComponent: !currentNode.isComponent,
        };
        const children = currentNode.children;
        children.forEach(childId => {
            cloneNodes[childId] = {
                ...cloneNodes[childId],
                isComponent: !currentNode.isComponent,
            };
        });

        setNodes(cloneNodes);
    };

    const onHandleChangeForPath = (nodeId: string, path: string) => {
        const clone = JSON.parse(JSON.stringify(nodes)) as INode;
        const foundNode = clone[nodeId];

        if (foundNode && foundNode.parentId) {
            const parent = clone[foundNode.parentId];
            const parentLink = parent.path.split("/");
            const correctLink = path.split("/");

            if (parentLink.length < correctLink.length) {
                foundNode.path = path.split(" ").join("-");
            } else if (parentLink.length > correctLink.length) {
                foundNode.path = parent.path + "/" + path.split(" ").join("-");
            } else if (parentLink.length === correctLink.length) {
                foundNode.path = parent.path !== "/" ? parent.path + "/" : "";
            }
            setNodes(prev => ({
                ...prev,
                [nodeId]: foundNode,
            }));
        }
    };

    const onHandleChangeForName = (nodeId: string, name: string) => {
        setNodes(prev => ({
            ...prev,
            [nodeId]: {
                ...prev[nodeId],
                name,
            },
        }));
    };

    useEffect(() => {
        let isMounted = false;
        const initialGetNodes = async () => {
            try {
                const response = await API.get<INode>("/routes", {}, data => {
                    return data?.data.reduce((acc: INode, node: any) => {
                        acc[node.id] = {
                            id: node.id,
                            type: node.type,
                            children: node.children ? node.children.map((child: any) => child.id) : [],
                            parentId: node.parentId,
                            name: node.name,
                            path: node.path || "",
                            isComponent: node.isComponent,
                            permissions: node.PermissionRoute.map((permission: any) => permission.Permission.id),
                        };
                        return acc;
                    }, {} as INode);
                });
                if (response.data) {
                    console.log(response);
                    if (isMounted) {
                        // setNodes(response.data);
                    }
                } else {
                    alert("An error occurred while getting the route.");
                }
            } catch (error) {
                console.log("Error getting route:", error);
                // alert("An error occurred while getting the route.");
            }
        };
        initialGetNodes();
        return () => {
            isMounted = true;
        };
    }, []);

    return {
        nodes,
        position,
        containerRef,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        onSubmit,
        addNode,
        deleteNode,
        onHandleChangeForIsComponent,
        onHandleChangeForPath,
        onHandleChangeForName,
    };
};

export default useTree;
