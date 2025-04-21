"use client";
import React, { FC } from "react";

export interface IComponent {}

const Component: FC<IComponent> = () => {
    return (
        <>
            {" "}
            <p>long content</p>
            {
                // indicates very long content
                Array.from({ length: 100 }, (_, index) => (
                    <React.Fragment key={index}>
                        {index % 20 === 0 && index ? "more" : "..."}
                        <br />
                    </React.Fragment>
                ))
            }
        </>
    );
};

export default Component;
