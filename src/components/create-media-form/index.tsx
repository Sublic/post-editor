"use client";
import { Space } from "antd";
import { useMemo, useState } from "react";
import { ContentOrPrompt } from "./content-or-prompt";
import { FormSteps } from "./steps";
import { Stages } from "./types";
import { BnbStep } from "./bnb-step";
import { GreenfieldStep } from "./greenfield-step";
import { DoneStep } from "./done-step";

type CreateMediaFormProps =
  | {
      initialStage: "bnb";
      mediaId: undefined;
      route: (url: string) => void;
    }
  | {
      initialStage: Exclude<Stages, "bnb">;
      mediaId: `0x${string}`;
      route: (url: string) => void;
    };

export function CreateMediaForm({
  initialStage: stage,
  mediaId,
  route,
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
      case "done":
        return (
          <DoneStep
            mediaId={mediaId!}
            toMediaEditor={() => route(`/editor/${mediaId!}`)}
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
      <FormSteps currentStage={newStage || stage} isLoading={isLoading} />

      <ContentOrPrompt>{children}</ContentOrPrompt>
    </Space>
  );
}
