import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const SNIPPET_LENGTH_IDEAL: number = 30;
const SNIPPET_TERMINATING_CHARACTERS: Array<string> = ['.', '!', '?', ':'];

// TODO(dnguyen0304): Maybe refactor to reduce duplicated code with getElement.
export async function getElementAll(selector: string): Promise<Element[]> {
    return new Promise(resolve => {
        const elements = document.querySelectorAll(selector);
        if (elements) {
            return resolve(Array.from(elements));
        }
        const observer = new MutationObserver(mutations => {
            const elements = document.querySelectorAll(selector);
            if (elements) {
                resolve(Array.from(elements));
                observer.disconnect();
            }
        });
        observer.observe(
            document.body,
            {
                childList: true,
                subtree: true
            },
        );
    });
};

export function getViewportHeight(): number {
    if (!ExecutionEnvironment.canUseDOM) {
        return 0;
    }
    return Math.max(
        document.documentElement.clientHeight || 0,
        window.innerHeight || 0,
    );
};

interface SubsetHTMLElement extends Pick<
    HTMLElement,
    'innerText' | 'textContent'
> { };

// TODO(dnguyen0304): Investigate refactoring to text-overflow: ellipsis style.
export const getSnippet = (element: SubsetHTMLElement): string => {
    const text = element.innerText || element.textContent;
    if (!text) {
        return '';
    }
    const words = text.split(' ');
    const snippetWords: Array<string> = [];

    let wordCount = 0;
    for (const word of words) {
        if (wordCount + word.length > SNIPPET_LENGTH_IDEAL) {
            if (!snippetWords.length) {
                break;
            }
            const lastSnippetWord = snippetWords[snippetWords.length - 1];
            // TODO(dnguyen0304): Investigate if this is possible.
            if (!lastSnippetWord.length) {
                break;
            }
            const lastSnippetCharacter =
                lastSnippetWord[lastSnippetWord.length - 1];
            if (SNIPPET_TERMINATING_CHARACTERS.includes(lastSnippetCharacter)) {
                break;
            }
            snippetWords.push('...');
            break
        }
        snippetWords.push(word);
        wordCount += word.length;
    }
    return snippetWords.join(' ');
};
