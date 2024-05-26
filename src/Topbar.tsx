import { useEffect } from "react";

function TopBar() {
    // const [isDarkMode, setIsDarkMode] = useState(() => {
    //     const darkMode = localStorage.getItem('darkMode');
    //     if (darkMode === 'enabled') {
    //         return true;
    //     } else if (darkMode === 'disabled') {
    //         return false;
    //     } else {
    //         return window.matchMedia('(prefers-color-scheme: dark)').matches;
    //     }
    // });

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
        <div className="transition duration-500 uppercase absolute top-0 w-screen h-10 xl:h-12 border-black flex px-3 xl:px-6 xl:text-bse items-center justify-between xl:justify-normal">
            <a href={`/`} className="hover:text-neutral-400 cursor-pointer xl:w-1/6">CHQYY4</a>
            <div className="flex gap-4 hover:*:text-neutral-400 *:cursor-pointer xl:w-1/2">
                <a href={`/graphics`}>Graphics</a>
                <a href={`/courses`}>Courses</a>
                <a href={`/photography`}>Photography</a>
                <a href={`/blogs`}>Blog</a>
                {/* <a href={`/single`}>SingleBlog</a> */}
            </div>
            <div className="flex items-center w-max">
                {/* <Switch onClick={toggleDarkMode} id="airplane-mode" className="-translate-x-5 border border-foreground" /> */}
                <a href={`/about`} className="hover:text-neutral-400 cursor-pointer -translate-x-2 xl:ml-auto">About</a>
            </div>
        </div>
    );
}

export default TopBar;