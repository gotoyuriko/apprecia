import Image from 'next/image';

export default function Logo() {
    return (
        <div className="flex items-center pb-2">
            <div className="h-12 w-12 relative">
                <Image
                    src="/logo.svg"
                    alt="Apprecia Logo"
                    className="object-contain"
                    fill
                    priority
                />
            </div>
            <h1 className="font-bold text-2xl mt-2 ml-2 hidden md:block">Apprecia</h1>
        </div>
    );
}
