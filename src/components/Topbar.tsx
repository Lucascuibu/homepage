import { useEffect, useState } from "react";
import {
    Bars3Icon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'



function TopBar() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

        const applyDarkMode = () => {
            document.documentElement.classList.add('dark');
        };

        const removeDarkMode = () => {
            document.documentElement.classList.remove('dark');
        };

        const updateTheme = () => {
            const darkMode = localStorage.getItem('darkMode');
            if (darkMode === 'enabled') {
                applyDarkMode();
            } else if (darkMode === 'disabled') {
                removeDarkMode();
            } else if (prefersDarkScheme.matches) {
                applyDarkMode();
            } else {
                removeDarkMode();
            }
        };

        updateTheme();

        const handleChange = (e: MediaQueryListEvent) => {
            if (e.matches) {
                applyDarkMode();
                localStorage.setItem('darkMode', 'enabled');
            } else {
                removeDarkMode();
                localStorage.setItem('darkMode', 'disabled');
            }
        };

        prefersDarkScheme.addEventListener('change', handleChange);

        return () => {
            prefersDarkScheme.removeEventListener('change', handleChange);
        };
    }, []);

    // const toggleDarkMode = () => {
    //     if (isDarkMode) {
    //         setIsDarkMode(false);
    //         localStorage.setItem('darkMode', 'disabled');
    //         document.documentElement.classList.remove('dark');
    //     } else {
    //         setIsDarkMode(true);
    //         localStorage.setItem('darkMode', 'enabled');
    //         document.documentElement.classList.add('dark');
    //     }
    // };

    return (
        <>
            <Transition show={sidebarOpen}>
                <Dialog className="relative z-50 md:hidden" onClose={setSidebarOpen}>
                    <TransitionChild
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-900/80" />
                    </TransitionChild>

                    <div className="fixed inset-0 flex flex-row-reverse">
                        <TransitionChild
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="translate-x-full"
                            enterTo="-translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="-translate-x-0"
                            leaveTo="translate-x-full"
                        >
                            <DialogPanel className="relative flex w-full">
                                <div className="flex grow flex-col overflow-y-auto bg-background px-3">
                                    <div className=" top-0 flex w-16 justify-center pt-2 absolute right-0">
                                        <button type="button" className="" onClick={() => setSidebarOpen(false)}>
                                            <span className="sr-only">Close sidebar</span>
                                            <XMarkIcon className="size-6 text-foreground" aria-hidden="true" />
                                        </button>
                                    </div>
                                    <div className="flex h-12 shrink-0 items-center uppercase">
                                        chqyy4
                                    </div>
                                    {/* <Divider component="li" /> */}
                                    <div className="border-[0.25px] border-black border-0.5 mb-2 "></div>
                                    <nav className="flex flex-1 flex-col">
                                        <ul role="list" className="flex flex-1 flex-col gap-y-3 hover:*:cursor-pointer hover:*:text-neutral-300">
                                            <li>
                                                <a href={`/graphics`}>Graphics</a>
                                            </li>
                                            <li>
                                                <a href={`/courses`}>Courses</a>
                                            </li>
                                            <li>
                                                <a href={`/photography`}>Photography</a>
                                            </li>

                                            <li>
                                                <a href={`/blogs`}>Blog</a>
                                            </li>
                                            <li>
                                                <a href={`/about`}>About</a>
                                            </li>


                                        </ul>
                                    </nav>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </Dialog>
            </Transition>
            <div className=" sticky z-40 transition duration-500 uppercase top-0 w-screen h-12 xl:h-14 bg-background border-black flex px-3 xl:px-6 xl:text-bse items-center justify-between xl:justify-normal">
                <a href={`/`} className="hover:text-neutral-400 cursor-pointer xl:w-1/6">CHQYY4</a>
                <div className="md:flex gap-3 md:gap-4 hover:*:text-neutral-400 *:cursor-pointer xl:w-1/2 overflow-auto hidden ">
                    <a href={`/graphics`}>Graphics</a>
                    <a href={`/courses`}>Courses</a>
                    <a href={`/photography`}>Photography</a>
                    <a href={`/blogs`}>Blog</a>
                    {/* <a href={`/single`}>SingleBlog</a> */}
                </div>
                <div className="flex items-center w-max">
                    {/* <Switch onClick={toggleDarkMode} id="airplane-mode" className="-translate-x-5 border border-foreground" /> */}
                    <a href={`/about`} className="hover:text-neutral-400 cursor-pointer -translate-x-2 xl:ml-auto hidden md:flex">About</a>
                </div>
                <button type="button" className="-m-2.5 p-2.5 text-foreground md:hidden" onClick={() => setSidebarOpen(true)}>
                    <span className="sr-only">Open sidebar</span>
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>
            </div>
        </>
    );
}

export default TopBar;