import { useState } from "react";
import ReactMapGL, { Source, Layer } from "react-map-gl";


const layerStyle: any = {
    id: "route",
    type: "line",
    layout: {
        "line-join": "round",
        "line-cap": "round",
    },
    paint: {
        "line-color": "#3887be",
        "line-width": 5,
        "line-opacity": 0.75,
    },
};

const Map = ({ lat, long, route }) => {
    const [viewport, setViewport] = useState({
        width: "100vw",
        height: "100vh",
        latitude: lat,
        longitude: long,
        zoom: 4,
    });

    return (
        <ReactMapGL
            {...viewport}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPS_API}
            onViewportChange={(viewport) => setViewport(viewport)}
        >
            <Source id="route-data" type="geojson" data={route}>
                <Layer {...layerStyle} />
            </Source>
        </ReactMapGL>
    );
};

export default Map;
