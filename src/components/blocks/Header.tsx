import Link from "next/link";
import NavLink from "../ui/nav-link";
import Image from "next/image";
import { mainNavItems, varsitySubnavItems } from "@/lib/navigation";

const Header = () => {
    return (
        <nav className="hidden md:block sticky top-0 z-[var(--z-header)]">
            <div className="text-white py-[10px] border-b-[3px] border-solid border-[var(--accent)] bg-[var(--primary)]">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex gap-x-[50px] items-center justify-start">
                        {/* Navigation Links */}
                        <Link href="/" className="text-white text-lg font-bold">
                            <Image className='h-14 md:h-20 w-auto' height={100} width={100}  src="/images/logo.png" alt="LS Lacrosse Team Logo" />
                        </Link>
                        <div className="flex flex-1 gap-x-8 items-center justify-between">
                            {mainNavItems.map((item) => {
                                // If it has sub-items, render dropdown
                                if (item.items) {
                                    return (
                                        <div key={item.title} className="relative group py-[10px]">
                                            <span className="text-white text-[12px] font-medium leading-[1.875em] tracking-[0.063rem] uppercase cursor-pointer relative heading-underline">
                                                {item.title}
                                            </span>
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[var(--z-dropdown)] ease-in-out">
                                                <div className="bg-[var(--primary)] text-white shadow-lg border-t-2 border-[var(--accent)] flex flex-col py-2">
                                                    {item.items.map((subItem) => (
                                                        <Link 
                                                            key={subItem.title} 
                                                            href={subItem.href || '#'} 
                                                            className="px-4 py-2 text-[12px] uppercase hover:text-[var(--accent)] transition-colors block text-center"
                                                        >
                                                            {subItem.title}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                
                                // Otherwise render standard link
                                return (
                                    <NavLink key={item.title} href={item.href || '#'}>
                                        {item.title}
                                    </NavLink>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            {/* Sub Navigation */}
            <div className="h-[3.75rem] flex bg-white shadow-md items-center">
                <div className="container">
                    <div className="flex col-gap-[3.5rem] gap-x-[3.5rem]">
                        <div>
                            <Link href="/" className="text-[var(--navy)] text-base font-bold tracking-wider uppercase no-underline relative group">
                                Varsity
                                <span className="absolute left-1/2 bottom-0 h-[1px] w-0 bg-[var(--primary)] transition-all duration-300 ease-in-out group-hover:w-full -translate-x-1/2"></span>
                            </Link>
                        </div>
                        <div className="flex gap-x-[2rem]">
                            {varsitySubnavItems.map((item) => (
                                <Link 
                                    key={item.title}
                                    href={item.href || '#'} 
                                    className="text-[var(--primary)] text-[15px] font-light no-underline relative group"
                                >
                                    {item.title}
                                    <span className="absolute left-1/2 bottom-0 h-[1px] w-0 bg-[var(--primary)] transition-all duration-300 ease-in-out group-hover:w-full -translate-x-1/2"></span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </nav >
    );
};

export default Header;
