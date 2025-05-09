import { StyledLayoutLoadingSkeleton } from "@components/common/AppLoader";

export default function Loading() {
    return (
        <>
            <StyledLayoutLoadingSkeleton>
                <div className="header">
                    <div className="group">
                        <div className="avatar"></div>
                        <div className="logo"></div>
                    </div>
                    <div className="group">
                        <div className="logo"></div>
                        <div className="avatar"></div>
                        <div className="avatar"></div>
                    </div>
                </div>

                <div className="content">
                    <div className="sidebar">
                        {Array.from({ length: 20 }).map((_, idx) => (
                            <div className="sidebar-item" key={idx}></div>
                        ))}
                    </div>

                    <div className="main">
                        {/* {Array.from({ length: 8 }).map((_, idx) => (
                                            <div className="content-block" key={idx}></div>
                                        ))} */}
                    </div>
                </div>
            </StyledLayoutLoadingSkeleton>
        </>
    );
}
