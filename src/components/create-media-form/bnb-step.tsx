"use client";
import { App, Button, Form, Input } from "antd";
import { useAccount } from "wagmi";
import { isAddress } from "viem";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Stages } from "./types";
import { useInitMediaResource } from "@/hooks/useInitMediaResource";
import { useEffect } from "react";
import { BnbSubmitButton } from "./bnb-submit-button";

interface BnbStepProps {
  setIsLoading(v: boolean): void;
  setNewStage(v: Stages): void;
}

type FormData = {
  resourceName: string;
  authors: Array<`0x${string}`>;
};

const { Item, List, ErrorList } = Form;

export function BnbStep({ setIsLoading, setNewStage }: BnbStepProps) {
  const { address } = useAccount();
  const { notification } = App.useApp();

  const { isPending, isSuccess, isError, error, mutate } =
    useInitMediaResource();

  useEffect(() => setIsLoading(isPending || false), [setIsLoading, isPending]);

  if (isSuccess) {
    setNewStage("greenfield");
  }

  useEffect(() => {
    if (isError) {
      notification.error({
        message: "Onchain creation error",
        description: String(error),
      });
    }
  }, [notification, isError, error]);

  const onFinish = ({ resourceName, authors }: FormData) => {
    if (mutate) {
      mutate({
        name: resourceName,
        authors,
      });
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Item label="Name" name="resourceName">
        <Input minLength={5} maxLength={50} />
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
