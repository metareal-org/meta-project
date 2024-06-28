// components/game-interface/alerts/_alert.tsx
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Flex } from "@/components/ui/tags";
import useAlertStore, { AlertStore } from "@/store/gui-store/useAlertStore";

export default function Alert() {
  const { alertConfigs, closeAlert }: AlertStore = useAlertStore();

  return (
    <>
      {alertConfigs.map((alertConfig) => (
        <Dialog key={alertConfig.id} open={true} onOpenChange={() => closeAlert(alertConfig.id!)}>
          <DialogContent>
            <DialogHeader>{alertConfig.title && <DialogTitle className="text-primary">{alertConfig.title}</DialogTitle>}</DialogHeader>
            <div>
              <Flex className="flex-col w-full gap-3">
                {alertConfig.picture && <img src={alertConfig.picture} className="rounded-lg w-full h-60 object-cover" />}
                <div>{alertConfig.description}</div>
              </Flex>
            </div>
            {alertConfig.buttons && (
              <DialogFooter>
                <Flex className="flex w-full items-center justify-center gap-2">
                  {alertConfig.buttons.map((button, buttonIndex) => (
                    <Button
                      disabled={button.disabled}
                      className="w-full"
                      key={buttonIndex}
                      variant={button.variant || "default"}
                      onClick={() => {
                        button.onClick?.();
                        closeAlert(alertConfig.id!);
                      }}
                    >
                      {button.label}
                    </Button>
                  ))}
                </Flex>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      ))}
    </>
  );
}
