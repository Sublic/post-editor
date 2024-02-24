"use client";
import { CreateMediaForm } from "@/components/create-media-form";

export default function Page({ params }: { params: { id: `0x${string}` } }) {
  return <CreateMediaForm initialStage="greenfield" mediaId={params.id} />;
}
