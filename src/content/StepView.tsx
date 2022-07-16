import React from "react";

type StepViewProps = {
    title: string
};

export const StepView = ({ children, title }: React.PropsWithChildren<StepViewProps>) => <div className="step-view">
    <h2>{title}</h2>
    {children}
</div>;