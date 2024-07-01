import { useEffect, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { DEFAULT_UNIT_COORDINATE, SERVER, SIGN_MESSAGE } from "@/core/constants";
import Cookies from "js-cookie";
import axios from "axios";
import axiosInstance from "@/lib/axios-instance";
import { useUserStore } from "@/store/player-store/useUserStore";
import useAvatarStore from "@/store/objects-store/useAvatarStore";
import useMissionStore from "@/store/useMissionStore";
import { MissionId } from "../mission-config";
import useUnitStore from "@/store/world-store/useUnitStore";
const DEBUG = false;
export default function MissionInitialize() {
  const [isAuthValid, setIsAuthValid] = useState(false);
  const { address, status } = useAccount();
  const { data: signedSignature, signMessage } = useSignMessage();


  
  useEffect(() => {
    const authenticate = async () => {
      if (!address) {
        setIsAuthValid(false);
        return;
      }
      const token = Cookies.get("token");
      if (!token) {
        signMessage({ message: SIGN_MESSAGE });
      } else {
        try {
          const response = await axios.post(
            `${SERVER}/user/authenticate`,
            { address },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          DEBUG && console.log("Authentication successful", response.data);
          setIsAuthValid(true);
        } catch (error) {
          console.error("Authentication failed", error);
          Cookies.remove("token");
          signMessage({ message: SIGN_MESSAGE });
        }
      }
    };
    authenticate();
  }, [address, status, signMessage]);
  useEffect(() => {
    if (!signedSignature || !address) return;
    const createToken = async () => {
      try {
        const response = await axios.post(`${SERVER}/user/authenticate`, {
          address,
          message: SIGN_MESSAGE,
          signature: signedSignature,
        });
        Cookies.set("token", response.data.access_token);
        setIsAuthValid(true);
      } catch (error) {
        console.error("Token creation failed", error);
      }
    };
    createToken();
  }, [signedSignature, address]);

  useEffect(() => {
    console.log("here");
    if (isAuthValid) {
      axiosInstance.post("user/show").then((response) => {
        const user = response.data.user;
        console.log(JSON.parse(user.coordinates));
        useUserStore.getState().setUser(user);
        useUserStore.getState().setNickname(user.nickname || "");
        useAvatarStore.getState().setAvatarUrl(user.avatar_url || "");
        useUnitStore.getState().setUnitCoordinates(JSON.parse(user.coordinates) || DEFAULT_UNIT_COORDINATE);
        useMissionStore.getState().setSelectedMission(user.current_mission || MissionId.SetNickname);
      });
    }
  }, [isAuthValid]);

  return null;
}
