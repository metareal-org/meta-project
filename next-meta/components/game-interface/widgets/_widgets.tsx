import PanelBlWidgect from "@/components/game-interface/widgets/panel-bl-widget/_panel-bl-widget";
import PanelTlWidget from "@/components/game-interface/widgets/panel-tl-widget/_panel-tl-widget";
import PanelTrWidget from "@/components/game-interface/widgets/panel-tr-widget/_panel-tr-widget";
import PanelBrWidget from "@/components/game-interface/widgets/panel-br-widget/_panel-br-widget";
import PanelTcWidget from "@/components/game-interface/widgets/panel-tc-widget/_panel-tc-widget";

export default function Widgets() {
  return (
    <>
      <PanelTrWidget />
      <PanelTlWidget />
      <PanelTcWidget />
      <PanelBrWidget />
      <PanelBlWidgect />
    </>
  );
}
