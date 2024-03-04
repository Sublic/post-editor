"use client";
import { App, Button, Form, Input } from "antd";
import { useAccount } from "wagmi";
import { isAddress } from "viem";
import {
  LoadingOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useInitMediaResource } from "@/hooks/useInitMediaResource";
import { useEffect } from "react";
import { BnbSubmitButton } from "./bnb-submit-button";
import { redirect } from "next/navigation";
import { BnbWaitPropmt } from "./bnb-wait-prompt";

interface BnbStepProps {
  setIsLoading(v: boolean): void;
}

type FormData = {
  resourceName: string;
  tokenName: string;
  tokenSymbol: string;
  authors: Array<`0x${string}`>;
};

const { Item, List, ErrorList } = Form;

export function BnbStep({ setIsLoading }: BnbStepProps) {
  const { address } = useAccount();
  const { notification } = App.useApp();

  const { isPending, isSuccess, isError, error, mutate, data } =
    useInitMediaResource();

  useEffect(() => setIsLoading(isPending || false), [setIsLoading, isPending]);

  if (isSuccess) {
    redirect(`/setup/${data}`);
  }

  useEffect(() => {
    if (isError) {
      notification.error({
        message: "Onchain creation error",
        description: String(error),
      });
    }
  }, [notification, isError, error]);

  const onFinish = ({ resourceName, tokenName, tokenSymbol, authors }: FormData) => {
    if (mutate) {
      mutate({
        name: resourceName,
        tokenName: tokenName,
        tokenSymbol: tokenSymbol,
        authors,
      });
    }
  };

  if (isPending) {
    return <BnbWaitPropmt />;
  }

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Item label="Name" name="resourceName">
        <Input minLength={5} maxLength={50} />
      </Item>
      <Item label="Token Name" name="tokenName">
        <Input minLength={2} maxLength={50} />
      </Item>
      <Item label="Token Symbol" name="tokenSymbol">
        <Input minLength={2} maxLength={50} />
      </Item>
      <List name="authors" initialValue={[address!]}>
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <Item
                label={index === 0 ? "Authors" : ""}
                required={false}
                key={field.key}
              >
                <Item
                  {...field}
                  key={field.key}
                  validateTrigger={["onChange", "onBlur"]}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message:
                        "Please input author's address or delete this field.",
                    },
                    {
                      validator(_, value, _1) {
                        return isAddress(value)
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error("Not an ethereum address")
                            );
                      },
                    },
                  ]}
                  noStyle
                >
                  <Input placeholder="Eth address" style={{ width: "60%" }} />
                </Item>
                {fields.length > 1 ? (
                  <MinusCircleOutlined
                    className="dynamic-delete-button"
                    onClick={() => remove(field.name)}
                  />
                ) : null}
              </Item>
            ))}
            <Item>
              <Button
                type="dashed"
                onClick={() => add()}
                style={{ width: "60%" }}
                icon={<PlusOutlined />}
              >
                Add author
              </Button>
              <ErrorList errors={errors} />
            </Item>
          </>
        )}
      </List>
      <Item>
        <BnbSubmitButton type="primary" htmlType="submit">
          Create
        </BnbSubmitButton>
      </Item>
    </Form>
  );
}
