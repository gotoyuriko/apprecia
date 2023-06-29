import { BiUserCircle, BiX } from "react-icons/bi";
import { motion } from "framer-motion";
import { AiOutlinePaperClip } from "react-icons/ai";
import Link from "next/link";
import Image from "next/image";

export default function ArtworkModal({ showDesc, setOpen, open, userData, user }) {
    return (
        open ? (
            <motion.div
                initial={{ x: -100 }}
                animate={{ x: 0 }}
                exit={{ x: -100 }}
                transition={{ ease: "easeOut", duration: 0.4 }}
                className="z-20 absolute left-0 top-0 w-full  lg:w-1/4 h-full bg-white shadow overflow-y-scroll"
            >
                <BiX
                    className="absolute top-2 right-2 w-10 h-10 text-black cursor-pointer"
                    onClick={() => setOpen(false)}
                />
                <div className="p-10">
                    {showDesc?.map((artwork, index) => (
                        <div key={index}>
                            <h1 className="text-4xl font-bold">{artwork.project_title}</h1>
                            <p className="text-justify mt-5">{artwork.project_description}</p>
                        </div>
                    ))}
                </div>
                <div className="px-10">
                    <p className="font-bold">Tags</p>
                    {showDesc?.map((artwork) =>
                        artwork?.project_tags?.map((tag, index) => (
                            <span
                                key={index}
                                className="text-sm text-white p-1.5 rounded"
                                style={{
                                    backgroundColor: tag.color ? tag.color : "#aaa",
                                }}
                            >
                                {tag.label}
                            </span>
                        ))
                    )}
                </div>
                <div className="px-10 mt-5">
                    <p className="font-bold">Skills</p>
                    {showDesc?.map((artwork) =>
                        artwork?.project_skills?.map((skill, index) => (
                            <span
                                key={index}
                                className="text-sm text-white p-1.5 rounded"
                                style={{
                                    backgroundColor: skill.color ? skill.color : "#aaa",
                                }}
                            >
                                {skill.label}
                            </span>
                        ))
                    )}
                </div>
                <div className="px-10 mt-5">
                    {showDesc?.map((artwork) => {
                        if (artwork?.project_link !== '' && artwork?.project_link !== null) {
                            return (
                                <div key={artwork?.project_link}>
                                    <p className="font-bold">Links</p>
                                    <Link className="flex items-center underline" href={artwork?.project_link} target="_blank">
                                        <AiOutlinePaperClip className="h-6 w-6" />
                                        {artwork?.project_link.replace(/(^\w+:|^)\/\/(www\.)?/i, "").slice(0, 20)}...
                                    </Link>
                                </div>
                            );
                        } else {
                            return null;
                        }
                    })}
                </div>

                <hr className="my-4" />
                <div className="flex items-center px-8 mt-4">
                    {userData?.user_photoURL ? (
                        <Link href={`/profiles/${userData?.user_id}`}>
                            <Image
                                src={userData.user_photoURL}
                                alt="Profile"
                                width={50}
                                height={50}
                                className="w-16 h-16 rounded-full drop-shadow-md border-2"
                                priority
                            />
                        </Link>
                    ) : (
                        <BiUserCircle className="w-16 h-16" />
                    )}
                    <div className="flex flex-col ml-3">
                        <p className="font-medium text-gray-700">created by</p>
                        {userData?.user_name && (
                            <Link
                                href={`/profiles/${userData?.user_id}`}
                                className="text-sm font-normal text-gray-400"
                            >
                                {userData.user_name}
                            </Link>
                        )}
                    </div>
                </div>
            </motion.div>
        ) : null
    );
}
