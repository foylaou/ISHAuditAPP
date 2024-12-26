//hooks/useSuggestcategory.ts

import {useEffect, useState} from "react";
import {SuggestCategory} from "@/types/Selector/suggestCategory";
import {suggestcategoryService} from "@/services/suggestcategoryService";



// hooks/useEnterprises.ts
export const useSuggestcategory = () => {
  const [suggestcategory, setSuggestcategory] = useState<SuggestCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    await suggestcategoryService.clearCache()
    setLoading(true);
    try {
      const data = await suggestcategoryService.getAllSuggestCategor();
      setSuggestcategory(data);
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
    try {
      const data = await suggestcategoryService.forceRefresh();
      setSuggestcategory(data);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  return { suggestcategory, loading, refresh };
};