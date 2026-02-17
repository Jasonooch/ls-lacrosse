import Link from "next/link";
import React from "react";

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => {
    return (
        <Link
            href={href}
            className="text-white relative text-[12px] font-medium leading-[1.875em] tracking-[0.063rem] uppercase no-underline group"
        >
            {children}
            <span className="absolute left-1/2 bottom-0 h-[1px] w-0 bg-[var(--accent)] transition-all duration-300 ease-in-out group-hover:w-full -translate-x-1/2"></span>
        </Link>
    );
};

export default NavLink;
