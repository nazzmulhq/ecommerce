"use client";
import { FC, useState } from "react";
import { INode } from "./useTree";

export interface INodes {
    nodeId: string;
    nodes: INode;
    addNode: (nodeId: string) => void;
    deleteNode: (nodeId: string) => void;
    onHandleChangeForIsComponent: (nodeId: string) => void;
    onHandleChangeForName: (nodeId: string, name: string) => void;
    onHandleChangeForPath: (nodeId: string, path: string) => void;
}

const Nodes: FC<INodes> = ({
    nodes,
    nodeId,
    addNode,
    deleteNode,
    onHandleChangeForIsComponent,
    onHandleChangeForName,
    onHandleChangeForPath,
}) => {
    const [isVisible, setIsVisible] = useState(true);

    const node = nodes[nodeId];
    if (!node) {
        return null;
    }
    const handleClick = () => {
        if (node?.children?.length === 0) {
            return;
        }
        setIsVisible(!isVisible);
    };
    return (
        <li key={node.id}>
            <div className="member-view-box">
                <div
                    className={`head ${
                        node.isComponent ? " !bg-gray-400" : ""
                    }`}
                >
                    <input
                        className="mx-2"
                        disabled={node.id === "1"}
                        onChange={e =>
                            onHandleChangeForName(node.id, e.target.value)
                        }
                        style={{
                            cursor: node.id === "1" ? "not-allowed" : "text",
                        }}
                        type="text"
                        value={node.name}
                    />
                    <div>
                        <button onClick={() => addNode(node.id)} type="button">
                            +
                        </button>
                        <button
                            disabled={node.id === "1"}
                            onClick={() => deleteNode(node.id)}
                            style={{
                                cursor:
                                    node.id === "1" ? "not-allowed" : "pointer",
                            }}
                            type="button"
                        >
                            -
                        </button>
                    </div>
                </div>
                <div className="body">
                    <div>
                        <label className="link">Link:</label>
                        <input
                            disabled={node.id === "1"}
                            onChange={e =>
                                onHandleChangeForPath(node.id, e.target.value)
                            }
                            style={{
                                cursor:
                                    node.id === "1" ? "not-allowed" : "text",
                            }}
                            type="text"
                            value={node.id === "1" ? "/" : node.path}
                        />
                    </div>
                    {node.id !== "1" && (
                        <div className="is-component">
                            <label htmlFor={node.id}>Is Component </label>
                            <input
                                checked={node.isComponent}
                                disabled={node.id === "1"}
                                id={node.id}
                                onChange={() =>
                                    onHandleChangeForIsComponent(node.id)
                                }
                                style={{
                                    cursor:
                                        node.id === "1"
                                            ? "not-allowed"
                                            : "pointer",
                                }}
                                type="checkbox"
                            />
                        </div>
                    )}
                </div>
                <div className="footer">
                    <button
                        disabled={node.children.length === 0}
                        onClick={handleClick}
                        type="button"
                    >
                        {node.children.length}
                    </button>
                </div>
            </div>

            {isVisible && node.children.length > 0 ? (
                <ul className="active">
                    {node.children.map(childId => (
                        <Nodes
                            addNode={addNode}
                            deleteNode={deleteNode}
                            key={childId}
                            nodeId={childId}
                            nodes={nodes}
                            onHandleChangeForIsComponent={
                                onHandleChangeForIsComponent
                            }
                            onHandleChangeForName={onHandleChangeForName}
                            onHandleChangeForPath={onHandleChangeForPath}
                        />
                    ))}
                </ul>
            ) : (
                ""
            )}
        </li>
    );
};

export default Nodes;
