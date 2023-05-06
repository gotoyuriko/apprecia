import Image from 'next/image';

export default function Logo() {
    return (
        <div className="flex items-center pb-2">
            <div className="h-12 w-12 relative">
                <Image
                    src="/logo.svg"
                    alt="Apprecia Logo"
                    className="dark:invert object-contain"
                    layout="responsive"
                    width={1}
                    height={2}
                    priority
                />
            </div>
            <h1 className="font-bold text-2xl mt-5 ml-2 hidden md:block">Apprecia</h1>
        </div>
    );
}
