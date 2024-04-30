import { MapContainer, TileLayer, useMap, Marker } from 'react-leaflet';
import L from 'leaflet';
import { IpQuery } from '../App';
import useIpData from '../hooks/useIpData';
import { useEffect } from 'react';

import marker from '../assets/icon-location.svg';

export interface IpQueryProp {
  ipQuery: IpQuery;
}

const myIcon = new L.Icon({
  iconUrl: marker,
  iconRetinaUrl: marker,
  popupAnchor: [-0, -0],
  iconSize: [32, 45],
});

const Map = ({ ipQuery }: IpQueryProp) => {
  const { center } = useIpData(ipQuery);

  const RecenterAutomatically = () => {
    const map = useMap();
    useEffect(() => {
      if (center) {
        map.setView(center);
      }
    }, [center]);
    return null;
  };

  if (!center) return <p>Loading...</p>; // Optional fallback message

  return (
    <div className="h-[60%] w-full absolute bottom-0 z-0">
      <MapContainer center={center} zoom={13} scrollWheelZoom={true}>
        <TileLayer
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center} icon={myIcon} />
        <RecenterAutomatically />
      </MapContainer>
    </div>
  );
};

export default Map;

