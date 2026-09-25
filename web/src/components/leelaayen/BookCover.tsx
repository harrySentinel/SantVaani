export const coverShadow = 'shadow-[0_24px_48px_-16px_rgba(36,26,18,0.45)]';

// Typeset "paper" cover for books that don't have cover artwork yet.
export default function BookCover({ title, author, small = false }: { title: string; author: string; small?: boolean }) {
  return (
    <div
      className={`w-full aspect-[2/3] rounded-md bg-[#f1e7d8] border border-[#e4d6c1] flex flex-col justify-between text-center ${
        small ? 'px-2 py-3 shadow-md' : `px-5 py-8 ${coverShadow}`
      }`}
    >
      <span className={`font-tiro text-[#c2410c] ${small ? 'text-xs' : 'text-lg'}`}>ॐ</span>
      <div className={small ? 'space-y-1.5' : 'space-y-4'}>
        <div className={`h-px bg-[#241a12]/25 mx-auto ${small ? 'w-5' : 'w-10'}`} />
        <p className={`font-tiro leading-tight text-[#241a12] ${small ? 'text-sm' : 'text-[1.7rem]'}`}>{title}</p>
        <div className={`h-px bg-[#241a12]/25 mx-auto ${small ? 'w-5' : 'w-10'}`} />
      </div>
      <p className={`tracking-wide text-[#241a12]/60 ${small ? 'text-[9px]' : 'text-xs'}`}>{author}</p>
    </div>
  );
}
