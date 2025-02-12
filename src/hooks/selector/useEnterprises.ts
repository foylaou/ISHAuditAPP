//hooks/useEnterprises.ts

import {useEffect, useState} from "react";
import {enterpriseService} from "@/services/enterpriseService";
import type {EnterPrise} from "@/types/Selector/enterPrise";



// hooks/useEnterprises.ts
export const useEnterprises = () => {
  const [enterprises, setEnterprises] = useState<EnterPrise[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    enterpriseService.clearCache();
    setLoading(true);
    try {
      const data = await enterpriseService.getAllEnterprises();
      setEnterprises(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData().then(_data => {setLoading(false);console.log("企業完成載入");});
  }, []);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await enterpriseService.forceRefresh();
      setEnterprises(data);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  return { enterprises, loading, refresh };
};
