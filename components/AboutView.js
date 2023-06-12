import { aboutFeatures } from '@/data/data';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import AboutCard from './AboutCard';
import Footer from './Footer';
import { motion } from "framer-motion"
import { useRef } from 'react';

const AboutView = () => {
    const scrollRef = useRef(null);
    return (
        <>
            <Parallax pages={3} className="w-full h-full relative top-0 left-0">
                <ParallaxLayer offset={0} speed={-0.25}>
                    <div className="fixed -top-[20vh] md:-top-[10vh] lg:top-0 bg-center bg-contain bg-no-repeat w-full h-full opacity-60" id="artworks"></div>
                </ParallaxLayer>
                <ParallaxLayer offset={0} speed={-0.1}>
                    <div className="fixed md:top-[30vh] lg:top-[60vh] bg-center bg-contain bg-no-repeat w-full h-full" id="people"></div>
                </ParallaxLayer>
                <ParallaxLayer offset={0} speed={0.3}>
                    <h1 className='text-center fixed top-[30vh] md:top-[40vh] lg:top-[50vh] font-bold text-black text-3xl md:text-3xl lg:text-5xl px-10 md:px-0 lg:text-5xl left-0 right-0 m-auto w-full h-full'>
                        Discover the World of Art with Apprecia
                    </h1>
                </ParallaxLayer>
                <ParallaxLayer offset={1} speed={0.3}>
                    <div className='h-screen relative bg-[#d6d6d6] lg:top-[40vh] flex justify-center items-center'>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ root: scrollRef }}
                            transition={{ delay: 0.2 }}
                            className='w-4/5 md:w-3/5 xl:w-2/5'>
                            <p className='text-justify text-xl'>
                                Apprecia was born out of a deep appreciation for art and a desire to create a platform that truly celebrates the talent and creativity of artists from around the world.
                                We understand the challenges artists face in finding suitable spaces to exhibit their work and reaching a wider audience.
                                That&rsquo;s why we built <b>Apprecia</b> - to provide a digital space that empowers artists to showcase their artwork in an engaging and accessible manner.
                            </p>
                        </motion.div>
                    </div>
                </ParallaxLayer>
                <ParallaxLayer offset={2} speed={0.2}>
                    {/* Features */}
                    <div className='h-screen relative flex flex-col justify-center items-center'>
                        <div className='flex flex-col'>
                            <h2 className='text-3xl font-bold text-center'>Key Features of Apprecia</h2>
                            <div className='flex flex-col md:flex-row px-5 lg:px-0'>
                                {
                                    aboutFeatures.map((item, index) => {
                                        return (
                                            <motion.div key={index}
                                                initial={{ opacity: 0, y: 30 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ root: scrollRef }}
                                                transition={{ delay: (0.3 * (index + 1)) }} >
                                                <AboutCard title={item.featureTitle} des={item.featureDescription} src={item.src} alt={item.alt} />
                                            </motion.div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                        <div className='w-full h-[55px] absolute  bottom-0'>
                            <Footer />
                        </div>
                    </div>
                </ParallaxLayer>
                <ParallaxLayer offset={0} speed={0.25}>
                    <div className="fixed top-[20vh] md:top-[50vh] lg:top-[100vh] -right-1 md:-right-5 lg:-right-64 bg-center bg-contain bg-no-repeat w-full h-full" id="blockgray"></div>
                </ParallaxLayer>
                <ParallaxLayer offset={0} speed={0.2}>
                    <div className="fixed top-[20vh] md:top-[50vh] lg:top-[100vh] -left-1 md:-left-48 lg:-left-64 bg-center bg-contain bg-no-repeat w-full h-full" id="blockwhite"></div>
                </ParallaxLayer>
            </Parallax>
        </>
    );
};

export default AboutView;
