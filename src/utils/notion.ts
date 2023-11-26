//import { Client } from "@notionhq/client";
import {ListBlockChildrenParameters, ListBlockChildrenResponse} from "@notionhq/client/build/src/api-endpoints";
import { ListBlockChildrenResponseResults } from "../types";

export interface Client {
    getBlockChildren: (args: ListBlockChildrenParameters) => Promise<ListBlockChildrenResponse>;
}

export type {
  ListBlockChildrenParameters,
  ListBlockChildrenResponse,
};

export const getBlockChildren = async (
  notionClient: Client,
  block_id: string,
  totalPage: number | null
) => {
  let result: ListBlockChildrenResponseResults = [];
  let pageCount = 0;
  let start_cursor = undefined;

  do {
    const response = (await notionClient.getBlockChildren({
      start_cursor: start_cursor,
      block_id: block_id,
    })) as ListBlockChildrenResponse;
    result.push(...response.results);

    start_cursor = response?.next_cursor;
    pageCount += 1;
  } while (
    start_cursor != null &&
    (totalPage == null || pageCount < totalPage)
  );

  modifyNumberedListObject(result);
  return result;
};

export const modifyNumberedListObject = (
  blocks: ListBlockChildrenResponseResults
) => {
  let numberedListIndex = 0;

  for (const block of blocks) {
    if ("type" in block && block.type === "numbered_list_item") {
      // add numbers
      // @ts-ignore
      block.numbered_list_item.number = ++numberedListIndex;
    } else {
      numberedListIndex = 0;
    }
  }
};
