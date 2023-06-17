import { Accordion, AccordionItem } from '@szhsin/react-accordion';
import Footer from '@/components/Footer';
import Navbar from '@/components/Nav/Navbar';
import { faqList } from '@/data/data';
import { useAuth } from '@/firebase/auth/AuthContext';

export default function Faq() {
    const { currentUser } = useAuth();
    return (
        <div className="w-full">
            <Navbar user={currentUser} />
            <div className='px-8 lg:px-32 pt-10 pb-12 md:pb-32'>
                <h1 className='text-4xl md:text-5xl text-center py-3'>
                    Apprecia FAQs
                </h1>
                <Accordion
                    transition
                    transitionTimeout={250}
                    className="w-full px-2 md:px-28 pt-8 md:pt-12 text-left space-y-4 md:space-y-4"
                >
                    {faqList.map((item, index) => (
                        <div key={index}>
                            <AccordionItem

                                header={
                                    <div>
                                        <h1 className='font-bold md:text-xl text-left'>{item.q}</h1>
                                    </div>
                                }
                            >
                                <div className='text-sm lg:text-lg text-justify'>
                                    <p>{item.a}</p>
                                </div>

                            </AccordionItem>
                            <hr className="h-px my-8 bg-gray-600 border-0" />
                        </div>
                    ))}
                </Accordion>
            </div>
            <Footer />
        </div>
    );
}
