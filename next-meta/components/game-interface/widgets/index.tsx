import PanelBlWidgect from "@/components/game-interface/widgets/panel-bl-widget";
import PanelTlWidget from "@/components/game-interface/widgets/panel-tl-widget";
import PanelTrWidget from "@/components/game-interface/widgets/panel-tr-widget";
import PanelBrWidget from "@/components/game-interface/widgets/panel-br-widget";

export default function Widgets() {
  return (
    <>
      <PanelTrWidget />
      <PanelTlWidget />
      <PanelBrWidget />
      <PanelBlWidgect />
    </>
  );
}
