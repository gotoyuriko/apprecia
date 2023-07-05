import Link from "next/link";

export default function NavItem({ menuList, device }) {
    return (
        <>
            {menuList && menuList.map((item, index) => (
                <li key={index} className={`${device ? "mt-10" : "py-2 md:mr-6 cursor-pointer"}`} >
                    <Link passHref href={`${item.link}`} className={`${device ? "text-2xl" : "text-xl"}`}>
                        {item.name}
                    </Link>
                </li >
            ))
            }
        </>

    );
}