import useMissionStore from "@/store/useMissionStore";
import { MissionId } from "../mission-config";
import { useEffect, useState } from "react";
import useMapStore from "@/store/engine-store/useMapStore";
import { AZADI_TOWER_COORDINATES } from "@/core/constants";
import useAlertStore from "@/store/gui-store/useAlertStore";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { Grid } from "@/components/ui/tags";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/player-store/useUserStore";
import {} from "@/lib/api/user";

export default function MissionSetNickname() {
  const { updateUserNickname, applyReferralCode, updateCpAmount } = useUserStore.getState();
  const { mapbox, setIsFlying } = useMapStore.getState();
  const { selectedMission, setSelectedMission } = useMissionStore.getState();

  const { openAlert, closeAlert } = useAlertStore.getState();
  const [referralError, setReferralError] = useState("");

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters")
      .max(80, "Username must be less than 80 characters"),
    referralCode: Yup.string().nullable(),
  });
  const showReferralRewardAlert = () => {
    openAlert({
      title: "Referral Reward",
      picture: "/assets/images/tokens/cp.webp",
      description: (
        <>
          <div className="grid gap-2">Congratulations! You've received a referral reward.</div>
          <div className="bg-black-1000/20 mt-4 rounded-xl w-full pt-4 flex items-center justify-center">
            <div className="flex-col items-center h-32">
              <img className="!w-20 p-2 border rounded block" src="/assets/images/tokens/cp.webp" />
              <div className="text-xs break-words text-center mt-2">500 CP</div>
            </div>
          </div>
        </>
      ),
      buttons: [
        {
          label: "Claim",
          onClick: () => {
            updateCpAmount("add", 500)
              .then(() => {
                openCharacterDesignAlert();
              })
              .catch((error) => {
                console.error("Error updating CP amount:", error);
              });
          },
        },
      ],
    });
  };
  const openChooseNicknameAlert = () => {
    openAlert({
      id: "nickname-alert",
      title: "Choose your nickname",
      description: (
        <Formik
          initialValues={{ username: "", referralCode: "" }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, setFieldError }) => {
            setReferralError("");
            updateUserNickname(values.username)
              .then(() => {
                updateUserNickname(values.username);
                if (values.referralCode) {
                  return applyReferralCode(values.referralCode);
                }
              })
              .then((response: any) => {
                console.log("response", response);
                if (response && response.status == "success") {
                  showReferralRewardAlert();
                } else {
                  openCharacterDesignAlert();
                }
                closeAlert("nickname-alert");
                setSubmitting(false);
              })
              .catch((error) => {
                console.error("Error updating nickname or applying referral code:", error);
                if (error.response && error.response.data && error.response.data.error) {
                  setReferralError(error.response.data.error);
                  setFieldError("referralCode", error.response.data.error);
                } else {
                  setReferralError("An error occurred. Please try again.");
                  setFieldError("referralCode", "An error occurred. Please try again.");
                }
                setSubmitting(false);
              });
          }}
        >
          {({ errors, touched, isValid, isSubmitting }) => (
            <Form>
              <Grid className="gap-2">
                <div>What do you want to be called?</div>
                <Field name="username" as={Input} />
                {errors.username && touched.username && <small style={{ color: "#e46962" }}>{errors.username}</small>}

                <div>Do you have a referral code? (Optional)</div>
                <Field name="referralCode" as={Input} placeholder="Enter referral code" />
                {((errors.referralCode && touched.referralCode) || referralError) && (
                  <small style={{ color: "#e46962" }}>{errors.referralCode || referralError}</small>
                )}
              </Grid>
              <Button className="mt-4 w-full" type="submit" disabled={!isValid || isSubmitting || !!referralError}>
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      ),
    });
  };

  const openCharacterDesignAlert = () => {
    openAlert({
      title: "Welcome to Metareal",
      description: "It's time to design your character. Are you ready?",
      buttons: [
        {
          label: "Let's do it",
          onClick: () => {
            setSelectedMission(MissionId.CreateAvatar);
          },
        },
      ],
    });
  };

  useEffect(() => {
    if (selectedMission.id !== MissionId.SetNickname) return;
    console.log("Rendering set nickname mission");
    if (!mapbox) return;
    setIsFlying(true);
    mapbox.flyTo({ center: AZADI_TOWER_COORDINATES, zoom: 20, bearing: 50, pitch: 60, duration: 100 });
    mapbox.once("moveend", () => {
      setIsFlying(false);
      openChooseNicknameAlert();
    });
  }, [selectedMission]);

  return null;
}
