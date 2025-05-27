import { spfi, SPFI } from "@pnp/sp";
import { Caching } from "@pnp/queryable";
import "@pnp/sp/folders";
import "@pnp/sp/items";
import "@pnp/sp/lists";
import "@pnp/sp/webs";
import "@pnp/sp/security";
import { PermissionKind } from "@pnp/sp/security";
import { getSP } from "./pnpjsConfig";

export interface FolderInfo {
  name: string;
  serverRelativeUrl: string;
}

export async function getEditableSitePagesFolders(
  context: any
): Promise<FolderInfo[]> {
  let _sp: SPFI;
  _sp = getSP();
  const spCache = spfi(_sp).using(Caching({ store: "session" }));
  const listRootFolder = await spCache.web.lists
    .getByTitle("Site Pages")
    .rootFolder();
  const folderItems = await spCache.web
    .getFolderByServerRelativePath(listRootFolder.ServerRelativeUrl)
    .folders();
  const editableFolders: FolderInfo[] = [];
  for (const folder of folderItems) {
    if (folder.Name !== "Forms") {
      const folderObj = spCache.web.getFolderByServerRelativePath(
        folder.ServerRelativeUrl
      );
      const folderItem = await folderObj.getItem();
      const effectivePermissions =
        await folderItem.getCurrentUserEffectivePermissions();
      const canEdit = spCache.web.hasPermissions(
        effectivePermissions,
        PermissionKind.EditListItems
      );

      if (canEdit) {
        editableFolders.push({
          name: folder.Name,
          serverRelativeUrl: folder.ServerRelativeUrl,
        });
      }
    }
  }
  return editableFolders;
}
