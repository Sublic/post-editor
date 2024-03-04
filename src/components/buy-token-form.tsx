import { useAccount } from "@/hooks/useAccount";
import { useApproveToken } from "@/hooks/useApproveToken";
import { useBuyToken } from "@/hooks/useBuyToken";
import { useMediaTokenAddress } from "@/hooks/useMediaTokenAddress";
import { useUSDCBalance } from "@/hooks/useUSDCBalance";
import {
  App,
  Button,
  Form,
  InputNumber,
  Skeleton,
  Spin,
  Typography,
} from "antd";
import BigNumber from "bignumber.js";
import { useEffect, useState } from "react";

interface BuyTokenFormProps {
  mediaId: `0x${string}`;
}

export function BuyTokenForm({ mediaId }: BuyTokenFormProps) {
  const [amountToBuy, setAmountToBuy] = useState(BigNumber(0));

  const { tokenAddress, isLoading } = useMediaTokenAddress(mediaId);
  const { address } = useAccount();

  const {
    value,
    usdcAddress,
    decimals,
    isLoading: isUsdcLoading,
    allowance,
  } = useUSDCBalance(address);

  const { buy: writeBuy, ...buyStatus } = useBuyToken(tokenAddress);

  const { approve: writeApprove, ...approveStatus } =
    useApproveToken(usdcAddress);

  const { notification } = App.useApp();

  const printableAmount =
    (value || BigInt(0)) / BigInt(Math.pow(10, decimals || 6));

  const isButtonDisabled =
    isLoading ||
    buyStatus.isPending ||
    approveStatus.isPending ||
    (value != null &&
      (BigNumber(value.toString()).lt(amountToBuy) || amountToBuy.lte(0))) ||
    buyStatus.isSuccess;

  const isButtonLoading = buyStatus.isPending || approveStatus.isPending;

  const isApproveRequired = BigNumber(allowance?.toString() || 0).lte(
    amountToBuy
  );

  useEffect(() => {
    if (buyStatus.isError) {
      notification.error({
        message: "Buy tx failed",
        description: buyStatus.error ? String(buyStatus.error) : undefined,
      });
    }
  }, [notification, buyStatus.isError, buyStatus.error]);

  useEffect(() => {
    if (approveStatus.isError) {
      notification.error({
        message: "Approve tx failed",
        description: approveStatus.error
          ? String(approveStatus.error)
          : undefined,
      });
    }
  }, [notification, approveStatus.isError, approveStatus.error]);

  const buy = () => {
    writeBuy(amountToBuy.multipliedBy(BigNumber(10).pow(decimals || 6)));
  };

  const approve = () => {
    writeApprove(amountToBuy.multipliedBy(BigNumber(10).pow(decimals || 6)));
  };

  return (
    <Form layout="vertical">
      <Form.Item label="USDC amount to buy">
        <InputNumber
          value={amountToBuy.toString()}
          onChange={(e) => setAmountToBuy(BigNumber(e || 0))}
          suffix="USDC"
          className="min-w-[200px]"
        />
      </Form.Item>
      <Form.Item label="You have">
        {isUsdcLoading ? (
          <Skeleton.Input />
        ) : (
          <Typography.Text strong>
            {printableAmount.toString()} USDC
          </Typography.Text>
        )}
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          onClick={isApproveRequired ? approve : buy}
          disabled={isButtonDisabled}
        >
          {isButtonLoading ? <Spin /> : isApproveRequired ? "Approve" : "Buy"}
        </Button>
      </Form.Item>
    </Form>
  );
}
