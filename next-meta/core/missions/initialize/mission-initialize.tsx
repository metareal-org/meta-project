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
export default function MissionInitialize() {
  const [isAuthValid, setIsAuthValid] = useState(false);
  const { address, status } = useAccount();
  const { data: signedSignature, signMessage } = useSignMessage();
  const { selectedMission } = useMissionStore();
  const AUTH_ROUTE = `${SERVER}/user/authenticate/`;
  useEffect(() => {
    if (selectedMission.id != MissionId.Initialize) return;
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
            AUTH_ROUTE,
            { address },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
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
        const response = await axios.post(AUTH_ROUTE, {
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
      axiosInstance.get("user/show/").then((response) => {
        const user = response.data.user;
        console.log(user);
        useUserStore.getState().setUser(user);
        useUserStore.getState().setNickname(user.nickname || "");
        useUserStore.getState().setCpExact(user.cp_amount_free || 0);
        useUserStore.getState().setMetaExact(user.meta_amount_free || 0);
        useAvatarStore.getState().setAvatarUrl(user.avatar_url || "");
        useUnitStore.getState().setUnitCoordinates(JSON.parse(user.coordinates) || DEFAULT_UNIT_COORDINATE);
        useMissionStore.getState().setSelectedMission(Number(user.current_mission) || MissionId.SetNickname);
      });
    }
  }, [isAuthValid]);
  return null;
}
