import { Images } from "@/components/images";

export function embedImagesIntoMarkdown(
  markdown: string,
  imageUrls: NonNullable<Parameters<typeof Images>[0]["values"]>
): string {
  let replasedMarkdown = markdown;

  imageUrls.forEach((image, i) => {
    replasedMarkdown = replasedMarkdown.replaceAll(
      `src="images:${i}"`,
      `src="${image.url}"`
    );
  });

  return replasedMarkdown;
}
