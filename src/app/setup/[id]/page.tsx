"use client";
import { CreateMediaForm } from "@/components/create-media-form";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: { id: `0x${string}` } }) {
  const router = useRouter();
  return (
    <CreateMediaForm
      initialStage="greenfield"
      mediaId={params.id}
      route={(url) => router.push(url)}
    />
  );
}
