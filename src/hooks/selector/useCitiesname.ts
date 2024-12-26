//hooks/useCitiesname.ts

import {useEffect, useState} from "react";
import {citiesnameService} from "@/services/citiesnameService";
import {CityInfo} from "@/types/Selector/citiesName";


export const useCitiesname = () => {
  const [Citiesname, setCitiesname] = useState<CityInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await citiesnameService.getAllCityInfo();
      setCitiesname(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refresh = async () => {
    setLoading(true);
          citiesnameService.clearCache();
    try {

      const data = await citiesnameService.forceRefresh();
      setCitiesname(data);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };



  return { Citiesname, loading, refresh };
};
