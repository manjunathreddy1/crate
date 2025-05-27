import * as React from "react";
//import styles from './PageEditor.module.scss';
import type { IPageEditorProps } from "./IPageEditorProps";
//import { escape } from '@microsoft/sp-lodash-subset';
//import EditableSitePagesFolders from "./EditorDialog"; // Adjust the import path as needed
import TemplateSelectionDialog from "./TemplateSelector";

/*<EditableSitePagesFolders
          context={this.context}
        ></EditableSitePagesFolders>
        */

export default class PageEditor extends React.Component<IPageEditorProps> {
  public render(): React.ReactElement<IPageEditorProps> {
    return (
      <>
        <TemplateSelectionDialog></TemplateSelectionDialog>
      </>
    );
  }
}
