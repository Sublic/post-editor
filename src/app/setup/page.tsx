"use client";
import { CreateMediaForm } from "@/components/create-media-form";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <CreateMediaForm
      initialStage="bnb"
      mediaId={undefined}
      route={(url) => router.push(url)}
    />
  );
}
