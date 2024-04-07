import GoogleMapReact from "google-map-react"
import {useEffect, useState} from "react";

const Map = ({latlng, zoom, onClick=undefined, moveable=false}) => {
    const [key] = useState(API_KRY); // Please input your own API key here to activate the service of Google Map.
    const [inLatlng, setLatlng] = useState(latlng);
    const [inZoom, setZoom] = useState(zoom);

    useEffect(()=>{
        setLatlng(latlng);
        // console.log(latlng)
    }, [latlng]);

    const handleOnClick = ({x, y, lat, lng, event}) => {
        if (moveable) {
            setLatlng({lat: lat, lng: lng});
        }
        if (onClick) {
            onClick(lat, lng);
        }
    };

    return (
        <div style={{height: '300px'}}>
            <GoogleMapReact
                onClick={handleOnClick}
                bootstrapURLKeys={{key}}
                defaultCenter={inLatlng}
                center={inLatlng}
                defaultZoom={inZoom}
            >
                <ReactMapPointComponent
                    lat={inLatlng.lat}
                    lng={inLatlng.lng}
                    text={"My Marker"}
                ></ReactMapPointComponent>
            </GoogleMapReact>
        </div>
    );
}

const ReactMapPointComponent = () => {
    const markerStyle = {
        border: '1px solid white',
        borderRadius: '50%',
        height: 10,
        width: 10,
        backgroundColor: 'red',
        cursor: 'point',
        zIndex: 10,
    };
    return (
        <div style={markerStyle}>

        </div>
    );
}

export default Map;
