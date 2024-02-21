"use client";
import { Row, Space } from "antd";
import { useMemo, useState } from "react";
import { ConnectKitButton } from "connectkit";
import { ContentOrPrompt } from "./content-or-prompt";
import { FormSteps } from "./steps";
import { Stages } from "./types";
import { BnbStep } from "./bnb-step";
import { GreenfieldStep } from "./greenfield-step";

type CreateMediaFormProps =
  | {
      initialStage: "bnb";
      mediaId: undefined;
    }
  | {
      initialStage: Exclude<Stages, "bnb">;
      mediaId: `0x${string}`;
    };

export function CreateMediaForm({
  initialStage: stage,
  mediaId,
}: CreateMediaFormProps) {
  const [isLoading, setIsloading] = useState(false);
  const [newStage, setNewStage] = useState<null | Stages>(null);

  const children = useMemo(() => {
    const currentStage = newStage || stage;

    switch (currentStage) {
      case "bnb":
        return <BnbStep setIsLoading={setIsloading} />;
      case "greenfield":
        return (
          <GreenfieldStep
            setIsLoading={setIsloading}
            nextStage={setNewStage}
            mediaId={mediaId!}
          />
        );
      default:
        return <></>;
    }
  }, [stage, newStage, mediaId]);

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
