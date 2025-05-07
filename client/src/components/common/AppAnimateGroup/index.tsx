import React from "react";
// import '../../../src/types/velocity-react.d';
// import { VelocityTransitionGroup } from 'velocity-react';
// import 'velocity-animate/velocity.ui';

// const enterAnimationDefaults = {
//   animation: 'transition.fadeIn',
//   stagger: 50,
//   duration: 200,
//   display: null,
//   visibility: 'visible',
//   delay: 0,
// };

// const leaveAnimationDefaults = {
//   animation: 'transition.slideUpOut',
//   backwards: 150,
//   duration: 200,
//   display: null,
//   visibility: 'visible',
//   delay: 0,
// };

type AppAnimateGroupProps = {
    children: React.ReactNode;
    [x: string]: any;
};

const AppAnimateGroup: React.FC<AppAnimateGroupProps> = props => {
    return <div {...props}>{props.children}</div>;
};

export default AppAnimateGroup;
