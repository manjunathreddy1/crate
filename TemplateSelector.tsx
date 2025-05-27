import * as React from "react";
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardPreview,
  Button,
} from "@fluentui/react-components";

import { Text } from "@fluentui/react-components";
import styles from "./PageEditor.module.scss";
import { getPageTemplate } from "./TemplateGenerator";
/*interface Template {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
}*/

/*interface TemplateSelectionDialogProps {
  isOpen: boolean;
  onDismiss: () => void;
  onCreate: (selectedTemplate: Template) => void;
  templates: Template[];
}*/

const TemplateSelectionDialog: React.FC = () => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );

  const [content, setContent] = useState<string>("");

  const getCanvasContent = async () => {
    getPageTemplate();
  };

  const fetchHtml = async () => {
    try {
      const response = await fetch(
        "https://testspdomain.sharepoint.com/sites/cadence/_api/web/getfilebyserverrelativeurl('/sites/cadence/sitepages/templates/page-template.aspx')/$value",
        {
          headers: {
            Accept: "text/html",
            "odata-version": "",
          },
          credentials: "include", // Ensures cookies are sent
        }
      );

      const htmlText = await response.text();

      // Parse the HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, "text/html");

      // Extract the desired element by ID or class
      const element = doc.querySelector("#spPageCanvasContent"); // or '.your-class'

      if (element) {
        setContent(element.innerHTML);
      } else {
        setContent("<p>Could not find the element.</p>");
      }
    } catch (error) {
      console.error("Error fetching page HTML:", error);
      setContent("<p>Error loading content.</p>");
    }
  };

  useEffect(() => {
    getCanvasContent();
    fetchHtml();
  });

  const toggleSelection = (templateId: string) => {
    setSelectedTemplateId((prevId) =>
      prevId === templateId ? null : templateId
    );
  };

  const handleToggleSelection = (templateId?: string) => {
    if (selectedTemplateId === templateId) {
      setSelectedTemplateId(null);
    } else if (templateId) {
      setSelectedTemplateId(templateId);
    }
  };

  return (
    <>
      <h1>test</h1>
      <div className={styles["template-grid"]}>
        <Card
          key={"template.id1"}
          onClick={() => toggleSelection("template.id1")}
          className={`${styles["template-card"]} ${
            selectedTemplateId === "template.id1" ? styles.selected : ""
          }`}
          appearance="outline"
        >
          <CardPreview style={{ height: 100 }}>
            <img
              src={"template.imageUrl"}
              alt={"template.title"}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </CardPreview>
          <CardHeader
            header={<Text weight="semibold">{"template.title"}</Text>}
            description={<Text size={200}>{"template.description"}</Text>}
          />
        </Card>

        <Card
          key={"template.id2"}
          onClick={() => toggleSelection("template.id2")}
          className={`${styles["template-card"]} ${
            selectedTemplateId === "template.id2" ? styles.selected : ""
          }`}
          appearance="outline"
        >
          <CardPreview style={{ height: 100 }}>
            <img
              src={"template.imageUrl"}
              alt={"template.title"}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </CardPreview>
          <CardHeader
            header={<Text weight="semibold">{"template.title"}</Text>}
            description={<Text size={200}>{"template.description"}</Text>}
          />
        </Card>

        <Button appearance="secondary" onClick={() => handleToggleSelection()}>
          {selectedTemplateId ? "Unselect" : "Select First"}
        </Button>

        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </>
  );
};

export default TemplateSelectionDialog;
