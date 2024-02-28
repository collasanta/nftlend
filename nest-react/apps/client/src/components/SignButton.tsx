import { useSDK } from "@metamask/sdk-react-ui";
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
      <button className={`mt-3 p-2 min-w-[100px] text-[14px]  ${!connected || signed ? "bg-gray-200 cursor-not-allowed" : "bg-orange-400"} shadow-sm text-white rounded-lg`} onClick={handleConnectAndSign} disabled={!connected || signed}>Sign Legal Term</button>
    </div>
  )
}

