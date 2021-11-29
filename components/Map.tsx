import { useState } from "react";
import ReactMapGL from "react-map-gl";

const Map = ({ lat, long }) => {
    const [viewport, setViewport] = useState({
        width: "100vw",
        height: "100vh",
        latitude: lat,
        longitude: long,
        zoom: 5
    });

    return (
        <ReactMapGL 
            className="-z-1"
            {...viewport}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPS_API}
            onViewportChange={(viewport) => setViewport(viewport)}
        />
    );
};

export default Map;