import CreateTitleText from '@/components/VirtualTour/CreateTitleText';
import GetArtwork from '@/firebase/artworks/GetArtwork';
import GetUser from '@/firebase/users/GetUser';
import { useEffect, useState } from 'react';

const VirtualTour = () => {
    const uid = 'dfqbciDedkY1YuNH0xBcXPe6iNG2';
    const [userData, setUserData] = useState('');
    const [artworkData, setArtworkData] = useState([]);
    const [firstArtwork, setFirstArtwork] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await GetUser(uid);
                setUserData(data);
            } catch (error) {
                console.error("Error getting user:", error);
            }

            try {
                const data = await GetArtwork();
                setArtworkData(data);
            } catch (error) {
                console.error("Error getting artwork:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const filteredArtworks = artworkData?.filter(
            (artwork) => artwork.user_id === userData?.user_id
        );

        const firstArtworkUrl = filteredArtworks?.[0]?.project_imageUrls[0] || '';

        setFirstArtwork(firstArtworkUrl);
    }, [artworkData, userData?.user_id]);

    return (
        <>
            <CreateTitleText />
            <a-scene>
                <a-image src={firstArtwork} position='0 1.8 -2' ></a-image>
                <a-sky src='/360panorama/room01.png'></a-sky>
            </a-scene>
        </>
    );
};

export default VirtualTour;
