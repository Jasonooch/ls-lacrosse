'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, ChevronDown, ChevronUp } from "lucide-react"; // Add X for close button and ChevronDown/Up for dropdown
import { mainNavItems, varsitySubnavItems } from "@/lib/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import styles from './MobileNav.module.css';

const MobileNavHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubNavOpen, setIsSubNavOpen] = useState(false);
  const pathname = usePathname();

  const handleLinkClick = () => {
    setIsOpen(false);
    setIsSubNavOpen(false);
  };

  // Close submenu when hamburger menu opens
  useEffect(() => {
    if (isOpen) {
      setIsSubNavOpen(false);
    }
  }, [isOpen]);

  // Close submenu when route changes
  useEffect(() => {
    setIsSubNavOpen(false);
  }, [pathname]);

  return (
    <div className={`md:hidden ${styles.navrows}`}> {/* Replace your outer styles.navBar if needed */}
      <div className={`bg-[var(--primary)] py-4 px-6 flex justify-between items-center ${styles.mainNav}`}> {/* Adjust to match your header */}
        <Link href="/">
          <Image 
            src="/images/logo.png" 
            alt="Lacrosse Logo" 
            width={66}
            height={66}
            className="h-16 w-auto"
          />
        </Link>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-transparent">
              <Menu className="h-8 w-8" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>

          {/* Full-screen mobile menu matching your mockup */}
          <SheetContent 
            side="left" 
            className="w-full max-w-full p-8 bg-white flex flex-col z-[var(--z-modal)]"
            closeClassName="text-red-600 top-8 right-8 [&>svg]:size-8"
          >
            {/* Main Navigation - Bold, Large, Uppercase */}
            <nav className="flex-1 px-10 pb-10 pt-15 flex flex-col justify-start gap-10 text-3xl font-bold uppercase tracking-wider">
              {/* Flat top-level links */}
              {mainNavItems
                .filter((item) => item.href && !item.items)
                .map((item) => (
                  <div key={item.title}>
                    <SheetClose asChild>
                      <Link 
                        href={item.href!} 
                        onClick={handleLinkClick}
                        className="text-gray-900 hover:text-red-600 transition-colors"
                      >
                        {item.title}
                      </Link>
                    </SheetClose>
                    <hr className="border-t-2 border-red-600 -mx-10 mt-10" />
                  </div>
                ))}

              {/* Accordion sections with sub-items */}
              <Accordion type="single" collapsible className="w-full flex flex-col gap-10">
                {mainNavItems
                  .filter((item) => item.items)
                  .map((item, index, array) => (
                    <div key={item.title}>
                      <AccordionItem value={item.title} className="border-b-0 w-full">
                        <AccordionTrigger 
                          className="pt-0 pb-10 text-3xl font-bold uppercase text-gray-900 hover:text-red-600 hover:no-underline data-[state=open]:text-red-600 transition-colors w-full justify-between items-center [&>svg]:translate-y-0 [&>svg]:size-6"
                        >
                          {item.title}
                        </AccordionTrigger>
                        <AccordionContent className="pb-8 pt-2 w-full">
                          <div className="flex flex-col gap-5 pl-8 text-[1rem] leading-[2.25rem] font-normal text-gray-700">
                            {item.items!.map((subItem) => (
                              <SheetClose asChild key={subItem.title}>
                                <Link 
                                  href={subItem.href!} 
                                  onClick={handleLinkClick}
                                  className="hover:text-red-600 transition-colors"
                                >
                                  {subItem.title}
                                </Link>
                              </SheetClose>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      {/* Red separator after each accordion except possibly the last */}
                      {index < array.length - 1 && (
                        <hr className="border-t-2 border-red-600 -mx-10" />
                      )}
                    </div>
                  ))}
              </Accordion>
            </nav>
            {/* Logo at the bottom */}
            <div className="flex justify-center pb-8 pt-4">
              <Image 
                src="/images/WematinLogo.png" 
                alt="Wematin" 
                width={150} 
                height={50} 
                className="h-12 w-auto object-contain"
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* SubNav (Varsity + Menu accordion) */}
      <div className="bg-white border-t border-gray-200 relative">
        <div className="px-6 py-4 flex justify-between items-center">
          <Link 
            href="/" 
            className="text-[16px] font-bold text-[var(--primary)]"
            onClick={() => setIsSubNavOpen(false)}
          >
            VARSITY
          </Link>
          <Button 
            variant="ghost" 
            className="text-[var(--primary)] hover:text-red-600 p-0 hover:bg-transparent"
            onClick={() => setIsSubNavOpen(!isSubNavOpen)}
          >
            <span className="mr-2 font-thin text-[15px]">Menu</span>
            {isSubNavOpen ? (
              <ChevronUp className="h-6 w-6" />
            ) : (
              <ChevronDown className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Collapsible Content */}
        {isSubNavOpen && (
          <div 
            className="absolute top-full left-0 w-full bg-white px-8 pb-6 pt-4 flex flex-col gap-4 animate-in slide-in-from-top-2 border-b border-gray-200 shadow-lg z-[var(--z-dropdown)]"
            style={{ borderTop: '1px solid var(--accent)' }}
          >
            {varsitySubnavItems.map((item) => (
              <Link 
                key={item.title}
                href={item.href!}
                className="text-lg text-gray-700 hover:text-red-600 pl-2"
                onClick={() => setIsSubNavOpen(false)}
              >
                {item.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileNavHeader;