import { useParams } from 'react-router-dom';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';
import { ArrowLongRightIcon } from '@heroicons/react/24/outline';
import { ParsedMarkdown } from '../utils/custommarkdown';
import { findpathByID, f2 } from '../utils/usefilesystem';


function Navibar() {
    return (
        <div className='flex justify-between px-8  font-semibold text-neutral-400 text-xl *:cursor-pointer hover:*:text-neutral-900'>
            <div>prev
                <ArrowLongLeftIcon className="size-6 text-black -translate-y-3 -translate-x-[7px]" />
            </div>
            <div>next
                <ArrowLongRightIcon className="size-6 text-black -translate-y-3 translate-x-5" />
            </div>
        </div>
    );
}


const SingleBlog = () => {
    const { '*': id } = useParams<{ '*': string }>();
    if (!id) {
        return <div>id is not defined</div>;
    }

    const fullPath = `../public/Notes/${findpathByID(id, f2)}`;

    return (
        <>
            <Navibar />
            <div className='px-12 pb-12 markdown-content w-full max-w-screen-lg mx-auto'>
                <ParsedMarkdown url={fullPath!} />
            </div>
        </>
    );
}

export default SingleBlog;