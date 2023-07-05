import Link from "next/link";

export default function SignInUpBtn({ device }) {
    return (
        <>
            <Link passHref href="/users/signin" className={`${device ? "text-lg mr-5 md:hidden" : "md:mr-5"}`}>Sign In</Link>
            <Link passHref href="/users/signup" className={`${device ? "text-lg p-3 bg-black font-bold text-white rounded-lg md:hidden" : 'p-3 bg-black font-bold text-white rounded-lg hidden md:inline-block'}`}>
                Sign Up
            </Link >
        </>
    );
}