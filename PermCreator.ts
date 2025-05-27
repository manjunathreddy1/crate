import { spfi, SPFI } from "@pnp/sp";
import { Caching } from "@pnp/queryable";
import "@pnp/sp/webs";
import "@pnp/sp/files";
import { getSP } from "./pnpjsConfig";
import "@pnp/sp/webs";
import {
  ClientsidePageFromFile,
  IClientsidePage,
} from "@pnp/sp/clientside-pages";
import "@pnp/sp/comments/clientside-page";
import "@pnp/sp/site-users";

export interface FolderInfo {
  name: string;
  serverRelativeUrl: string;
}
interface IPageItem {
  ID: number;
}

export async function createPageFromTemplate(context: any): Promise<void> {
  let _sp: SPFI;
  _sp = getSP();
  const spCache = spfi(_sp).using(Caching({ store: "session" }));
  const web = await spCache.web();
  web;
  const webURL = web.ServerRelativeUrl;
  const sourceFileUrl = `/${webURL}/SitePages/Templates/Page-template.aspx`;
  const now = new Date();
  const formattedDate = now.toISOString().slice(0, 10).replace(/-/g, "");
  const formattedTime = now.toTimeString().slice(0, 8).replace(/:/g, "");
  const timestamp = `${formattedDate}${formattedTime}`;
  const destinationFileUrl = `${webURL}/SitePages/${timestamp}.aspx`;
  const breakingNewsContentTypeID =
    "0x0101009D1CB255DA76424F860D91F20E6C4118001D549379FAB4BE4D824A0B24720DB30D009E4B44061B3C4C4BA87CF3A6FE8E7D01";

  try {
    await spCache.web
      .getFileByServerRelativePath(sourceFileUrl)
      .copyTo(destinationFileUrl, true);
    const page: IClientsidePage = await ClientsidePageFromFile(
      spCache.web.getFileByServerRelativePath(destinationFileUrl)
    );
    const pageItem: IPageItem = await spCache.web
      .getFileByServerRelativePath(destinationFileUrl)
      .getItem();
    await page.disableComments();
    const currentUser = await spCache.web.currentUser();
    try {
      await page.setAuthorByLoginName(
        "i:0#.f|membership|" + currentUser.LoginName
      );
      await page.save(false);
      await spCache.web.lists
        .getByTitle("Site Pages")
        .items.getById(pageItem.ID)
        .validateUpdateListItem([
          {
            FieldName: "Author",
            FieldValue: JSON.stringify([
              {
                Key: "i:0#.f|membership|" + context.pageContext.user.loginName,
              },
            ]),
          },
          {
            FieldName: "Editor",
            FieldValue: JSON.stringify([
              {
                Key: "i:0#.f|membership|" + context.pageContext.user.loginName,
              },
            ]),
          },
        ]);

      await spCache.web.lists
        .getByTitle("Site Pages")
        .items.getById(pageItem.ID)
        .update({
          ContentTypeId: breakingNewsContentTypeID,
        });
    } catch (error) {
      console.error("Error change author: ", error);
    }
  } catch (error) {
    console.error("Error copying file:", error);
  }
}
