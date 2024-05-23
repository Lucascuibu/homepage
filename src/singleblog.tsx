import TopBar from './Topbar';
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline'
import { ArrowLongRightIcon } from '@heroicons/react/24/outline'
import { ParsedMarkdown } from './custommarkdown';

// function ParseLatex({ latex }: { latex: string }) {
//     return <div>{parse(latex)}</div>
// }

function Navibar(){
    return (
        <div className='flex justify-between px-8 pt-3 font-semibold text-neutral-400 text-xl *:cursor-pointer hover:*:text-neutral-900'>
            <div>prev
                <ArrowLongLeftIcon className="size-6 text-black -translate-y-3 -translate-x-[7px]" />
            </div>
            <div>next
                <ArrowLongRightIcon className="size-6 text-black -translate-y-3 translate-x-5" />
            </div>

        </div>
    )
}
function SingleBlog() {
    return (
        <div className="h-screen text-xs font-normal pt-10 relative ">
            <TopBar />
            <Navibar />
            <div className='px-12 pb-12 markdown-content'>
                <ParsedMarkdown url="/tst.md" />
            </div>
        </div>
    );
}

export default SingleBlog;