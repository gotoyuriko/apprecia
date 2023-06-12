import { Parallax, ParallaxLayer } from '@react-spring/parallax';

const AboutView = () => {
    return (
        <>
            <Parallax pages={2} className="w-full h-full relative top-0 left-0">
                <ParallaxLayer offset={0} speed={0.25}>
                    <div className="fixed -top-[20vh] md:-top-[10vh] lg:top-0 bg-center bg-contain bg-no-repeat w-full h-full" id="artworks"></div>
                </ParallaxLayer>
                <ParallaxLayer offset={0} speed={0.3}>
                    <div className="fixed md:top-[30vh] lg:top-[60vh] bg-center bg-contain bg-no-repeat w-full h-full" id="people"></div>
                </ParallaxLayer>
                <ParallaxLayer offset={0} speed={0.1}>
                    <div className="fixed top-[20vh] md:top-[50vh] lg:top-[100vh] -right-1 md:-right-5 bg-center bg-contain bg-no-repeat w-full h-full" id="blockgray"></div>
                </ParallaxLayer>
                <ParallaxLayer offset={0} speed={0.2}>
                    <div className="fixed top-[20vh] md:top-[50vh] lg:top-[100vh] -left-1 md:-left-48 lg:-left-64 bg-center bg-contain bg-no-repeat w-full h-full" id="blockwhite"></div>
                </ParallaxLayer>
                {/* <ParallaxLayer offset={1} speed={0.25}>

                </ParallaxLayer> */}
            </Parallax>
        </>
    );
};

export default AboutView;
