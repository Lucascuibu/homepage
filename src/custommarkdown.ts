import { marked } from 'marked';
import parse from 'html-react-parser';
import { useEffect, useState } from "react";
import 'katex/dist/katex.min.css';
import markedKatex from "marked-katex-extension";


// const renderer = {
    // heading(text: string, level: number) {
    //     const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

    //     return `
    //             <h${level}>
    //                 <a name="${escapedText}" class="anchor" href="#${escapedText}">
    //                     <span class="header-link"></span>
    //                 </a>
    //                 ${text}
    //             </h${level}>`;
    // }
// };

// const tokenizer = {
    // codespan(src: string) {
    //     const match = src.match(/^\$+([^\\$\n]+?)\$+/);
    //     if (match) {
    //         return {
    //             type: 'codespan',
    //             raw: match[0],
    //             text: match[1].trim()
    //         };
    //     }

    //     // return false to use original codespan tokenizer
    //     return false;
    // }
// };
// const walkTokens = (token: Token) => {
//     if (token.type === 'heading') {
//         token.depth += 1;
//     }
// };



export const ParsedMarkdown = ({ url }: { url: string }) => {
    const options = {
        throwOnError: false
    };
    marked.use(markedKatex(options));

    const [htmlContent, setHtmlContent] = useState("");

    useEffect(() => {
        const fetchMarkdown = async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Error fetching markdown: ${response.statusText}`);
                }
                const text = await response.text();
                const parsedContent = marked.parse(text);
                setHtmlContent(parsedContent.toString());
            } catch (error) {
                console.error("Error fetching markdown:", error);
            }
        };

        fetchMarkdown();
    }, [url]);
    return parse(htmlContent);
};