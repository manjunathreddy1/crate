import * as React from "react";
import { useEffect, useState } from "react";
import { getEditableSitePagesFolders } from "./PermChecker";
import "@pnp/sp/folders";
import { PrimaryButton } from "@fluentui/react";
import { createPageFromTemplate } from "./PermCreator";
import { getPageTemplate } from "./TemplateGenerator";

const EditableSitePagesFolders: React.FC<{ context: any }> = ({ context }) => {
  const [folders, setFolders] = useState<FolderInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  interface FolderInfo {
    name: string;
    serverRelativeUrl: string;
  }

  const createPage = async () => {
    createPageFromTemplate(context);
  };

  const getCanvasContent = async () => {
    getPageTemplate();
  };

  useEffect(() => {
    getCanvasContent();
    const loadFolders = async () => {
      setLoading(true);
      try {
        const editableFolders = await getEditableSitePagesFolders(context);
        setFolders(editableFolders);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    loadFolders();
  }, [context]);

  if (loading) return <div>Loading folders...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div>
      <h3>Editable Folders in Site Pages</h3>
      <ul>
        {folders.map((folder) => (
          <li key={folder.serverRelativeUrl}>
            {folder.name} - <code>{folder.serverRelativeUrl}</code>
          </li>
        ))}
      </ul>
      <PrimaryButton
        type="button"
        text={"Create"}
        onClick={() => createPage()}
      />
    </div>
  );
};

export default EditableSitePagesFolders;
