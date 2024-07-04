import { useEffect, useRef } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { AZADI_TOWER_COORDINATES, SIGN_MESSAGE } from "@/core/constants";
import { MissionId } from "@/core/missions/mission-config";
import useMapStore from "@/store/engine-store/useMapStore";
import useMissionStore from "@/store/useMissionStore";
import useAlertStore from "@/store/gui-store/useAlertStore";
import { Input } from "@/components/ui/input";
import { Grid } from "@/components/ui/tags";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axios-instance";

const DEBUG = true;
const validationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required").min(3, "Username must be at least 3 characters").max(100, "Username must be less than 80 characters"),
});

export default function MissionAuthentication() {
  if (useMissionStore().selectedMission.id !== MissionId.Authentication) return;
  console.log("skiping authentication mission");
  useMissionStore().setSelectedMission(MissionId.SetNickname);
}
//   const { selectedMission, setSelectedMission } = useMissionStore();
//   const { mapbox, stopSpinGlobe, setIsFlying } = useMapStore();
//   const { openAlert, closeAlert } = useAlertStore();
//   const { address } = useAccount();
//   const { setNickname, nickname } = useAuthStore();
//   const { data: signatureData, signMessage } = useSignMessage();

//   const { data: isAuthenticated, isLoading: isCheckingAuth } = useCheckAuth(address);
//   const authenticateMutation = useAuthenticate();

//   const hasStartedFlyAnimation = useRef(false);
//   const shouldOpenNicknameAlert = useRef(false);

//   useEffect(() => {
//     if (selectedMission.id === MissionId.Authentication) {
//       DEBUG && console.log("Authentication state:", { isAuthenticated, isCheckingAuth, hasSignature: !!signatureData, hasAddress: !!address });
//       if (isAuthenticated && mapbox && !hasStartedFlyAnimation.current) {
//         DEBUG && console.log("User is authenticated, proceeding to mission");
//         proceedToMission();
//       } else if (!isCheckingAuth && !isAuthenticated && address && !signatureData) {
//         DEBUG && console.log("User is not authenticated, needs signature");
//         signMessage({ message: SIGN_MESSAGE });
//       }
//     }
//   }, [isAuthenticated, isCheckingAuth, address, signatureData, mapbox, selectedMission]);

//   useEffect(() => {
//     if (selectedMission.id === MissionId.Authentication) {
//       if (signatureData && address && !isAuthenticated && mapbox) {
//         DEBUG && console.log("Authenticating with backend");
//         authenticateMutation.mutate(
//           { address, signature: signatureData },
//           {
//             onSuccess: () => {
//               DEBUG && console.log("Authentication successful");
//               proceedToMission();
//             },
//             onError: (error) => {
//               console.error("Authentication error:", error);
//             },
//           }
//         );
//       }
//     }
//   }, [signatureData, address, isAuthenticated, mapbox, selectedMission]);

//   const proceedToMission = () => {
//     if (selectedMission.id === MissionId.Authentication && mapbox) {
//       axiosInstance.post("user/show").then((response) => {
//         const user = response.data.user;
//         if (user.current_mission === MissionId.Authentication) {
//           if (hasStartedFlyAnimation.current) {
//             DEBUG && console.log("Fly animation already started, opening nickname alert");
//             openChooseNicknameAlert();
//             return;
//           }

//           hasStartedFlyAnimation.current = true;
//           shouldOpenNicknameAlert.current = true;
//           stopSpinGlobe();
//           setIsFlying(true);
//           mapbox.flyTo({
//             center: AZADI_TOWER_COORDINATES,
//             zoom: 20,
//             bearing: 50,
//             pitch: 60,
//           });
//

//             setIsFlying(false);
//             DEBUG && console.log("Fly animation ended, shouldOpenNicknameAlert:", shouldOpenNicknameAlert.current);
//             if (shouldOpenNicknameAlert.current) {
//               DEBUG && console.log("Opening nickname alert after fly animation");
//               openChooseNicknameAlert();
//             } else {
//               DEBUG && console.log("Alert not opened after fly animation, flag not set");
//             }
//           });
//         } else {
//           setSelectedMission(user.current_mission);
//         }
//       });
//     }
//   };

//   const openChooseNicknameAlert = () => {
//     if (selectedMission.id === MissionId.Authentication) {
//       if (!hasStartedFlyAnimation.current) {
//         DEBUG && console.log("Fly animation not started yet, delaying nickname alert");
//         shouldOpenNicknameAlert.current = true;
//         return;
//       }

//       DEBUG && console.log("Opening choose nickname alert");
//       openAlert({
//         id: "nickname-alert",
//         title: "Choose your nickname",
//         description: (
//           <Formik
//             initialValues={{ username: "" }}
//             validationSchema={validationSchema}
//             onSubmit={(values, { setSubmitting }) => {
//               DEBUG && console.log("Nickname submitted:", values.username);
//               setNickname(values.username);
//               openCharacterDesignAlert();
//               closeAlert("nickname-alert");
//               setSubmitting(false);
//             }}
//           >
//             {({ errors, touched, isValid }) => (
//               <Form>
//                 <Grid className="gap-2">
//                   <div>What do you want to be called?</div>
//                   <Field name="username" as={Input} />
//                   {errors.username && touched.username && <small style={{ color: "#e46962" }}>{errors.username}</small>}
//                 </Grid>
//                 <Button className="mt-4 w-full" type="submit" disabled={!isValid}>
//                   Submit
//                 </Button>
//               </Form>
//             )}
//           </Formik>
//         ),
//       });
//     }
//   };

//   const openCharacterDesignAlert = () => {
//     if (selectedMission.id === MissionId.Authentication) {
//       DEBUG && console.log("Opening character design alert");
//       openAlert({
//         title: "Welcome to Metareal",
//         description: "It's time to design your character. Are you ready?",
//         buttons: [
//           {
//             label: "Let's do it",
//             onClick: () => {
//               axiosInstance
//                 .post("user/update", {
//                   nickname: nickname,
//                 })
//                 .then((response) => {
//                   console.log(response.data);
//                 })
//                 .catch((error) => {
//                   console.error(error);
//                 });
//               setSelectedMission(MissionId.CreateAvatar);
//             },
//           },
//         ],
//       });
//     }
//   };
