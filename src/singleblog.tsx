import { useParams } from 'react-router-dom';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';
import { ArrowLongRightIcon } from '@heroicons/react/24/outline';
import { ParsedMarkdown } from './custommarkdown';
import f2 from './usefilesystem';


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


function findpathByID(id: string) {
    for (const item of f2) {
        if (item.id === id) {
            return item.path;
        }
    }
    return undefined;

}
const SingleBlog = () => {
    const { '*': id } = useParams<{ '*': string }>();
    if (!id) {
        return <div>id is not defined</div>;
    }
    const fullPath = `/${findpathByID(id)}`;
    return (
        <>
            <Navibar />
            <div className='px-12 pb-12 markdown-content w-full max-w-screen-lg mx-auto'>
                <ParsedMarkdown url={fullPath} />
            </div>
        </>

    );
}

export default SingleBlog;