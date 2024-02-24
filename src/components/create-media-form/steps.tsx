"use client";

import { StepProps, Steps } from "antd";
import { Stages } from "./types";
import { LoadingOutlined } from "@ant-design/icons";

const stagesOrder: Array<Stages> = ["bnb", "greenfield", "done"];

function derriveStepProps(
  stepStage: Stages,
  currentStage: Stages,
  isLoading: boolean
): Pick<StepProps, "icon" | "status" | "disabled"> {
  if (currentStage === "done") {
    return {
      status: "finish",
    };
  }

  if (
    stagesOrder.findIndex((s) => s === currentStage) >
    stagesOrder.findIndex((s) => s === stepStage)
  ) {
    return {
      status: "finish",
    };
  } else {
    if (isLoading && currentStage === stepStage) {
      return {
        status: "process",
        icon: <LoadingOutlined />,
      };
    }
    return {
      status: "wait",
    };
  }
}

interface FormStepsProps {
  currentStage: Stages;
  isLoading: boolean;
}

export function FormSteps({ currentStage, isLoading }: FormStepsProps) {
  return (
    <Steps
      items={[
        {
          title: "BNB",
          ...derriveStepProps("bnb", currentStage, isLoading),
        },
        {
          title: "Greenfield",
          ...derriveStepProps("greenfield", currentStage, isLoading),
        },
        {
          title: "Done",
          ...derriveStepProps("done", currentStage, isLoading),
        },
      ]}
    />
  );
}
