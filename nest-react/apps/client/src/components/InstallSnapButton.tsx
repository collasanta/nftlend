import { useSDK } from "@metamask/sdk-react-ui";
import { Button } from "./ui/button";

export const InstallSnapButton = () => {
  const { provider, connected } = useSDK();

  const installSnap = async () => {
    try {
      const install = await provider?.request({
        "method": "wallet_requestSnaps",
        "params":
        {
          "npm:@pushprotocol/snap": {},
        }
      });
      window.alert(install);
    } catch (err) {
      window.alert((err as Error).message);
    }
  };

  return (
    <div>
      <Button onClick={installSnap} disabled={!connected}>Enable Notifications</Button>
    </div>
  )
}

