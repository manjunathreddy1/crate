import * as React from "react";
import {
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  TableColumnDefinition,
  createTableColumn,
  Button,
  Toolbar,
  ToolbarButton,
} from "@fluentui/react-components";
import { TableRowId } from "@fluentui/react-components";
import { spfi, SPFI } from "@pnp/sp";
import { getSP } from "./pnpjsConfig";
import { Caching } from "@pnp/queryable";

interface PageItem {
  id: string;
  fileName: string;
  title: string;
  created: string;
  modified: string;
}

class AsyncPager<T> {
  private iterator: AsyncIterator<T>;

  constructor(
    iterable: AsyncIterable<T>,
    private pages: T[] = [],
    public pagePointer = -1,
    public isDone = false
  ) {
    this.iterator = iterable[Symbol.asyncIterator]();
  }

  /**
   * Provides access to the current page of values
   */
  async current(): Promise<T> {
    if (this.pagePointer < 0) {
      return this.next();
    }
    let count = this.pages.length;
    console.log(count);
    // return the current page
    return this.pages[this.pagePointer];
  }

  /**
   * Access the next page, either from the local cache or make a request to load it
   */
  async next(): Promise<T> {
    // does the page exist?
    let page = this.pages[++this.pagePointer];

    let pageCount = this.pages.length;
    console.log(pageCount);

    if (typeof page === "undefined") {
      if (this.isDone) {
        // if we are already done make sure we don't make any more requests
        // and return the last page
        --this.pagePointer;
      } else {
        // get the next page of links
        const next = await this.iterator.next();

        if (next.done) {
          this.isDone = true;
        } else {
          this.pages.push(next.value);
        }
      }
    }

    return this.pages[this.pagePointer];
  }

  async prev(): Promise<T> {
    if (this.pagePointer < 1) {
      return this.pages[0];
    }
    return this.pages[--this.pagePointer];
  }
}

const GridWithActionAndCommand = () => {
  const [items, setItems] = React.useState<PageItem[]>([]);
  const listPager = React.useMemo(() => initializePager2(), []);
  //const totalPages = Math.ceil(items.length / pageSize);
  const [selectedIds, setSelectedIds] = React.useState<Set<TableRowId>>(
    new Set()
  );

  function initializePager2(): AsyncPager<PageItem[]> {
    let _sp: SPFI;
    _sp = getSP();
    const spCache = spfi(_sp).using(Caching({ store: "session" }));

    const folderPaths = [
      "/sites/Cadence/SitePages",
      //"/sites/Cadence/SitePages",
    ];

    const folderFilter2 = buildFolderFilter2(folderPaths);
    const pager = new AsyncPager(
      spCache.web.lists
        .getByTitle("Site Pages")
        .items.filter(folderFilter2)
        .top(2)
    );

    return pager;
  }

  const initializePager = (): AsyncPager<PageItem[]> => {
    let _sp: SPFI;
    _sp = getSP();
    const spCache = spfi(_sp).using(Caching({ store: "session" }));

    const folderPaths = [
      "/sites/Cadence/SitePages/Templates",
      //"/sites/Cadence/SitePages",
    ];

    const folderFilter2 = buildFolderFilter2(folderPaths);
    const pager = new AsyncPager(
      spCache.web.lists
        .getByTitle("Site Pages")
        .items.filter(folderFilter2)
        .top(2)
    );

    return pager;
  };

  React.useEffect(() => {
    initializePager();
  }, []);
  function buildFolderFilter2(folders: string[]): string {
    return folders
      .map((folder) => `FileDirRef eq '${folder.replace(/'/g, "''")}'`)
      .join(" or ");
  }

  const loadNextPage = async () => {
    const result = await listPager.next();
    const mapped: PageItem[] = result.map((item: any) => ({
      id: item.Id.toString(),
      fileName: item.FileLeafRef,
      title: item.Title,
      created: new Date(item.Created).toLocaleString(),
      modified: new Date(item.Modified).toLocaleString(),
    }));

    setItems(mapped);
  };
  const loadPrevPage = async () => {};

  const handleCommandClick = () => {
    console.log("Selected IDs:", Array.from(selectedIds));
  };

  const columns: TableColumnDefinition<PageItem>[] = [
    createTableColumn<PageItem>({
      columnId: "fileName",
      renderHeaderCell: () => "File Name",
      renderCell: (item) => item.fileName,
    }),
    createTableColumn<PageItem>({
      columnId: "title",
      renderHeaderCell: () => "Title",
      renderCell: (item) => item.title,
    }),
    createTableColumn<PageItem>({
      columnId: "created",
      renderHeaderCell: () => "Created",
      renderCell: (item) => item.created,
    }),
    createTableColumn<PageItem>({
      columnId: "modified",
      renderHeaderCell: () => "Modified",
      renderCell: (item) => item.modified,
    }),
    createTableColumn<PageItem>({
      columnId: "actions",
      renderHeaderCell: () => "Actions",
      renderCell: (item) => (
        <Button
          onClick={(event) => {
            event.stopPropagation();
            console.log("Clicked ID:", item.id);
          }}
          size="small"
        >
          Click Me
        </Button>
      ),
    }),
  ];

  return (
    <>
      <Toolbar>
        <ToolbarButton
          onClick={handleCommandClick}
          disabled={selectedIds.size === 0}
        >
          Get Selected IDs
        </ToolbarButton>
        <ToolbarButton
          onClick={handleCommandClick}
          disabled={selectedIds.size === 0}
        >
          Approve
        </ToolbarButton>
      </Toolbar>

      <DataGrid
        items={items}
        columns={columns}
        selectionMode="multiselect"
        selectionAppearance="neutral"
        selectedItems={selectedIds}
        getRowId={(item: PageItem) => item.id}
        onSelectionChange={(e, data) => setSelectedIds(data.selectedItems)}
      >
        <DataGridHeader>
          <DataGridRow
            selectionCell={{
              checkboxIndicator: { "aria-label": "Select all rows" },
            }}
          >
            {({ renderHeaderCell }) => (
              <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
            )}
          </DataGridRow>
        </DataGridHeader>
        <DataGridBody<PageItem>>
          {({ item, rowId }) => (
            <DataGridRow<PageItem>
              key={rowId}
              selectionCell={{
                checkboxIndicator: { "aria-label": "Select row" },
              }}
            >
              {({ renderCell }) => (
                <DataGridCell>{renderCell(item)}</DataGridCell>
              )}
            </DataGridRow>
          )}
        </DataGridBody>
      </DataGrid>

      <div
        style={{
          marginTop: 16,
          display: "flex",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <Button onClick={loadPrevPage} disabled={listPager.pagePointer == 0}>
          Previous
        </Button>
        <Button
          onClick={loadNextPage}
          disabled={listPager.isDone ? true : false}
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default GridWithActionAndCommand;
