import React from 'react';
import styles from './PageTitle.module.css';

interface PageTitleProps {
    children: React.ReactNode;
    className?: string;
    headingClassName?: string;
    animateUnderline?: boolean;
}

const PageTitle: React.FC<PageTitleProps> = ({
    children,
    className,
    headingClassName,
    animateUnderline = false,
}) => {
    const wrapperClasses = [styles.headingWrapper, className].filter(Boolean).join(' ');
    const headingClasses = [
        styles.heading,
        animateUnderline ? styles.animateUnderline : '',
        headingClassName,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={wrapperClasses}>
            <h1 className={headingClasses}>
                {children}
            </h1>
        </div>
    );
};

export default PageTitle;
