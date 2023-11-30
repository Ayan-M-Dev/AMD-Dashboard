import { lusitana } from '@/app/ui/fonts';

export default function Logo() {
 return (
    <div className={`${lusitana.className} flex flex-row justify-items items-center leading-none text-white`}>
      <p className="text-[30px]">A-M-D Dashboard</p>
    </div>
 );
}

