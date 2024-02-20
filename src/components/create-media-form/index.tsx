"use client";
import { Row, Space } from "antd";
import { useMemo, useState } from "react";
import { ConnectKitButton } from "connectkit";
import { ContentOrPrompt } from "./content-or-prompt";
import { FormSteps } from "./steps";
import { Stages } from "./types";
import { BnbStep } from "./bnb-step";
import { redirect } from "next/navigation";

interface CreateMediaFormProps {
  initialStage: Stages;
}

export function CreateMediaForm({ initialStage: stage }: CreateMediaFormProps) {
  const [isLoading, setIsloading] = useState(false);
  const [newStage, setNewStage] = useState<null | Stages>(null);

  const children = useMemo(() => {
    const currentStage = newStage || stage;

    switch (currentStage) {
      case "bnb":
        return <BnbStep setIsLoading={setIsloading} />;
      default:
        return <></>;
    }
  }, [stage, newStage]);

  return (
    <Space
      className="w-full"
      classNames={{ item: "mx-10" }}
      direction="vertical"
      size="large"
    >
      <Row justify="center" className="my-10">
        <ConnectKitButton />
      </Row>
      <FormSteps currentStage={newStage || stage} isLoading={isLoading} />

      <ContentOrPrompt>{children}</ContentOrPrompt>
    </Space>
  );
}
