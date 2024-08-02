import useLandStore from "@/store/world-store/useLandStore";
import { useEffect } from "react";
export default function ConsoleLogger() {
  const { currentLandDetails } = useLandStore();
  
  useEffect(() => {
    // currentLandDetails ?? console.log(currentLandDetails);
  }, [currentLandDetails]);


  return null;
}
