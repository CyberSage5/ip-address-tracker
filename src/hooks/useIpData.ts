import axios, { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import { IpQuery } from '../App';
import { LatLngTuple } from 'leaflet';

interface IpDataFetch {
  ip: string;
  city: string;
  region: string;
  region_code: string;
  country_name: string;
  country_code: string;
  latitude: number;
  longitude: number;
  postal: string | null;
  asn: {
    asn: string;
    name: string;
    domain: string | null;
  };
  time_zone: {
    name: string;
    abbr: string;
    offset: string;
  };
}

const useIpData = (ipQuery: IpQuery) => {
  const [data, setData] = useState<IpDataFetch>({} as IpDataFetch);
  const [isLoading, setIsLoading] = useState(true);
  const [center, setCenter] = useState<LatLngTuple>();
  const [error, setError] = useState(null); // Consider a more robust error handling

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get<IpDataFetch>(
        `https://api.ipdata.co/${ipQuery.ip || ''}?api-key=5487fe827551d1c9bfba54537f7d2b3a3b93ae4c1fa946dea43a417b`,
        {
          signal: controller.signal,
          params: {
            ip: ipQuery?.ip,
            domain: ipQuery?.domain,
          },
        }
      )
      .then(({ data }) => {
        setData(data);
        setIsLoading(false);
        setCenter([data.latitude, data.longitude]);
      })
      .catch((err) => {
        if (err.message !== 'canceled') {
          // Implement more robust error handling (e.g., setError(err))
          console.error('Error fetching IP data:', err);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      if (ipQuery) {
        controller.abort();
      }
    };
  }, [ipQuery]);

  return { data, center, isLoading, error }; // Include error state in return
};

export default useIpData;

