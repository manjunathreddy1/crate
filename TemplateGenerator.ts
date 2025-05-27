import { spfi, SPFI } from "@pnp/sp";
import { Caching } from "@pnp/queryable";
import "@pnp/sp/webs";
import "@pnp/sp/files";
import { getSP } from "./pnpjsConfig";
import "@pnp/sp/webs";
import "@pnp/sp/comments/clientside-page";
import "@pnp/sp/site-users";
import "@pnp/sp/presets/all";

export async function getPageTemplate(): Promise<void> {
  let _sp: SPFI;
  _sp = getSP();
  const spCache = spfi(_sp).using(Caching({ store: "session" }));
  const template = await spCache.web.lists
    .getByTitle("Site Pages")
    .items.getById(11)
    .select("Title", "BannerImageUrl")();

  const contentHtml = template.CanvasContent1;
  console.log(contentHtml);

  const page = await spCache.web.loadClientsidePage(
    "/sites/Cadence/SitePages/Templates/Page-template.aspx"
  );

  let url = page.thumbnailUrl;
  console.log(url);
}
