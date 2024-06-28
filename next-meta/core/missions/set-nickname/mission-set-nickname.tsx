import useMissionStore from "@/store/useMissionStore";
import { MissionId } from "../mission-config";
import { useEffect } from "react";
import useMapStore from "@/store/engine-store/useMapStore";
import { AZADI_TOWER_COORDINATES } from "@/core/constants";
import useAlertStore from "@/store/gui-store/useAlertStore";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { Grid } from "@/components/ui/tags";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/lib/axios-instance";
import { useUserStore } from "@/store/player-store/useUserStore";

export default function MissionSetNickname() {
  const { mapbox, setIsFlying } = useMapStore.getState();
  const { selectedMission, setSelectedMission } = useMissionStore.getState();
  const { setNickname, nickname } = useUserStore.getState();
  const { openAlert, closeAlert } = useAlertStore.getState();
  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters")
      .max(100, "Username must be less than 80 characters"),
  });
  const openChooseNicknameAlert = () => {
    openAlert({
      id: "nickname-alert",
      title: "Choose your nickname",
      description: (
        <Formik
          initialValues={{ username: "" }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            axiosInstance
              .post("user/update", {
                nickname: values.username,
              })
              .then(() => {
                setNickname(values.username);
                openCharacterDesignAlert();
                closeAlert("nickname-alert");
                setSubmitting(false);
              });
          }}
        >
          {({ errors, touched, isValid }) => (
            <Form>
              <Grid className="gap-2">
                <div>What do you want to be called?</div>
                <Field name="username" as={Input} />
                {errors.username && touched.username && <small style={{ color: "#e46962" }}>{errors.username}</small>}
              </Grid>
              <Button className="mt-4 w-full" type="submit" disabled={!isValid}>
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
            axiosInstance
              .post("user/update", {
                nickname: nickname,
              })
              .then((response) => {
                console.log(response.data);
              })
              .catch((error) => {
                console.error(error);
              });
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
}
