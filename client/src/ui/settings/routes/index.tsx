"use client";

import { Typography } from "antd";
import { FC } from "react";

import useTranslation from "@lib/i18n";
import "./index.css";
import { default as Nodes } from "./Node";
import useTree from "./useTree";

export interface ITree {}

const Tree: FC<ITree> = () => {
    const {
        position,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        containerRef,
        nodes,
        addNode,
        deleteNode,
        onHandleChangeForIsComponent,
        onHandleChangeForName,
        onHandleChangeForPath,
        onSubmit,
    } = useTree();

    const { locale, onClickChangeLanguage, translation } = useTranslation();

    return (
        <>
            <div className="tree-header">
                <Typography.Title level={4}>Visualize React App {translation.title}</Typography.Title>
                <button onClick={onClickChangeLanguage} type="button">
                    {locale === "en" ? "BN" : "EN"}
                </button>
                <button onClick={onSubmit} type="button">
                    Create Route
                </button>
            </div>
            <div
                style={{
                    cursor: "move",
                }}
            >
                <div
                    className="genealogy-body genealogy-scroll"
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    ref={containerRef}
                >
                    <div
                        className="genealogy-tree"
                        style={{
                            transform: `translate(${position.x}px, ${position.y}px) scale(${1})`,
                            transformOrigin: "0 0",
                        }}
                    >
                        <ul>
                            <Nodes
                                addNode={addNode}
                                deleteNode={deleteNode}
                                nodeId="1"
                                nodes={nodes}
                                onHandleChangeForIsComponent={onHandleChangeForIsComponent}
                                onHandleChangeForName={onHandleChangeForName}
                                onHandleChangeForPath={onHandleChangeForPath}
                            />
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Tree;
