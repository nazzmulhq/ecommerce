"use client";
import Icons from "@components/common/Icons";
import { FC } from "react";

export interface IComponent {}

const Component: FC<IComponent> = () => {
    return (
        <>
            <h1>Page</h1>
            <Icons className="text-red-500" name="AiFillApi" size={100} />
        </>
    );
};

export default Component;
