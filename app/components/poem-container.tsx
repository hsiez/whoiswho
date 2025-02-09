import { Suspense } from 'react';
import CopyCode from './copy-code';

async function getPoem() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/poem`, {
        cache: 'no-store'
    });
    const data = await response.json();
    return data.poem;
}

export default async function PoemContainer({ setIsCopied, isCopied }: { setIsCopied: (isCopied: boolean) => void, isCopied: boolean }) {
    const poem = await getPoem();
    
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CopyCode poem={poem} setIsCopied={setIsCopied} isCopied={isCopied} />
        </Suspense>
    );
} 