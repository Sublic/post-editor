import { FACTORY_ADDRESS } from "@/config";
import { client } from "./client";
import { PublicClient } from "viem";
import MediaFactoryAbi from "@/abi/MediaFactory";
import { SublicGroup } from "./types";

const PREFIX = "sublic-";
const AUTHORS_POSTFIX = "-authors";
const SUBSCRIBERS_POSTFIX = "-subscribers";

function getMediaName(group: Pick<SublicGroup, "name" | "type">): string {
  const unprefixedName = group.name.substring(PREFIX.length);
  if (group.type === "authors") {
    return unprefixedName.substring(
      0,
      unprefixedName.length - AUTHORS_POSTFIX.length
    );
  }
  return unprefixedName.substring(
    0,
    unprefixedName.length - SUBSCRIBERS_POSTFIX.length
  );
}

async function getMediaId(
  name: string,
  client: PublicClient
): Promise<`0x${string}`> {
  return client.readContract({
    address: FACTORY_ADDRESS,
    abi: MediaFactoryAbi,
    functionName: "mediaIds",
    args: [name],
  });
}

export async function getSublicGroups(
  user: `0x${string}`,
  context: { readClient: PublicClient }
): Promise<Array<SublicGroup>> {
  const allGroups = await client.sp.listUserGroups({ address: user });

  if (allGroups.body?.GfSpGetUserGroupsResponse.Groups == null) {
    throw new Error("Greenfield Groups fetch failed");
  }

  return Promise.all(
    allGroups.body.GfSpGetUserGroupsResponse.Groups.filter(
      (group) =>
        group.Group.GroupName.startsWith(PREFIX) &&
        group.Group.Owner.toLowerCase() === FACTORY_ADDRESS.toLowerCase()
    )
      .map((group) => ({
        name: group.Group.GroupName,
        id: group.Group.Id,
        type: group.Group.GroupName.endsWith(AUTHORS_POSTFIX)
          ? "authors"
          : ("subscribers" as SublicGroup["type"]),
      }))
      .map((g) => ({
        ...g,
        mediaName: getMediaName(g),
      }))
      .map(async (g) => ({
        ...g,
        mediaId: await getMediaId(g.mediaName, context.readClient),
      }))
  );
}
