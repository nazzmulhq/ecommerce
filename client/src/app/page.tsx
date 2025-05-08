"use client";

import { FC } from "react";

export interface IComponent {}

const Component: FC<IComponent> = () => {
    return (
        <>
            {[...Array(50)].map((_, index) => (
                <div
                    key={index}
                    style={{
                        height: "100px",
                        backgroundColor: index % 2 === 0 ? "lightblue" : "lightgreen",
                        margin: "5px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "50%",
                    }}
                >
                    Item {index + 1}
                </div>
            ))}
        </>
    );
};

export default Component;
