import { Entity } from "aframe-react";
import { useEffect } from "react";

export default function Panel({ panoramaImages, setSelectPanel, setOpenModalArt }) {

    useEffect(() => {
        // Unregister the component if it has already been registered
        if (AFRAME.components["artwork-click"]) {
            delete AFRAME.components["artwork-click"];
        }

        const handleClickEvent = (data) => {
            event.preventDefault();
            setSelectPanel(
                panoramaImages.filter((artwork) => {
                    return artwork.artworkId === data.id;
                })
            );
            setOpenModalArt(true);
        };

        AFRAME.registerComponent("artwork-click", {
            schema: {
                src: { type: "string" },
                id: { type: "number" },
            },
            init: function () {
                this.el.addEventListener("click", () => handleClickEvent(this.data));
            },
            remove: function () {
                this.el.removeEventListener("click", () => handleClickEvent(this.data));
            },
        });
    }, [panoramaImages, setOpenModalArt, setSelectPanel]);

    if (!panoramaImages) return null;

    return panoramaImages.map((item, index) =>
        item.src === "" ? (
            <Entity
                key={index}
                geometry="primitive: plane;"
                material="src: /360panorama/default.jpg; color:#2f2f2f; side: double;"
                rotation={item.rotation}
                position={item.position}
                artwork-click={`src:${item.src}; id:${item.artworkId}`}
                class="clickable"
            >
                <Entity
                    text={{
                        value: "Select your Artwork",
                        color: "#ffffff",
                        align: "center",
                    }}
                    position="0 0 0"
                    scale="1.5 1.5 1.5"
                />
            </Entity>
        ) : (
            <Entity
                key={index}
                geometry="primitive: plane;"
                material={`src: ${item.src}; color: #cccccc; side: double;`}
                rotation={item.rotation}
                position={item.position}
                artwork-click
                class="clickable"
            />
        )
    );
}
