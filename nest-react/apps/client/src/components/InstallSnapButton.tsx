import { useSDK } from "@metamask/sdk-react-ui";
import { Button } from "./ui/button";
import { useState } from "react";

export const InstallSnapButton = () => {
  const { provider, connected } = useSDK();
  const [installed, setInstalled] = useState(false);

  const installSnap = async () => {
    try {
      const install = await provider?.request({
        "method": "wallet_requestSnaps",
        "params":
        {
          "npm:@pushprotocol/snap": {},
        }
      }) as Record<string, { enabled: boolean }>;

      if (install && install['npm:@pushprotocol/snap']?.enabled) {
        setInstalled(true);
        window.alert("snap installed");
      }

    } catch (err) {
      window.alert((err as Error).message);
    }
  };

  return (
    <div>
      <Button onClick={installSnap} disabled={!connected || installed}>Enable Notifications</Button>
    </div>
  )
}

