import { Editor } from "@/components/editor";

export default function Page({ params }: { params: { id: `0x${string}` } }) {
  return <Editor mediaId={params.id} />;
}
