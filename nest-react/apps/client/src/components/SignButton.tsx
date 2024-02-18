import { useSDK } from "@metamask/sdk-react-ui";
import { Button } from "@chakra-ui/react";
import { Buffer } from 'buffer';
import { useState } from "react";
import { EthereumTransactionParams, ethereumRequest, requestAccounts } from "@/lib/utils";

export const SignButton = () => {
  const { connected } = useSDK();
  const [signed, setSigned] = useState(false);

  const handleConnectAndSign = async () => {
    const [from] = await requestAccounts();
    const exampleMessage = `Welcome to NFTLend  
      This message proves you own this wallet address : ${from} 
      
      By signing this message you agree to our terms and conditions, available at: 
      https://nftlendexample.com/terms-and-conditions/ 
      https://nftlendexample.com/terms-of-use/ 
      
      Nonce : 98237982739`
    const msg = `0x${Buffer.from(exampleMessage, "utf8").toString("hex")}`;
    const sign = await ethereumRequest({
      method: "personal_sign",
      params: [msg, from] as EthereumTransactionParams,
    }) as string;
    sign && setSigned(true);
    window.alert("signedMessage: " + sign);
  };

  return (
    <div>
      <Button onClick={handleConnectAndSign} isDisabled={!connected || signed}>Sign Legal Term</Button>
    </div>
  )
}

