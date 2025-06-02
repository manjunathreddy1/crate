import * as React from "react";
import {
  FluentProvider,
  webLightTheme,
  Input,
  Label,
  Button,
} from "@fluentui/react-components";

const TwoColumnForm: React.FC = () => {
  return (
    <FluentProvider theme={webLightTheme}>
      <form style={formStyle}>
        <div style={formRow}>
          <div style={formColumn}>
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" />
          </div>
          <div style={formColumn}>
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" />
          </div>
        </div>

        <div style={formRow}>
          <div style={formColumn}>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" />
          </div>
          <div style={formColumn}>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" />
          </div>
        </div>

        <div style={{ marginTop: "1rem" }}>
          <Button appearance="primary" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </FluentProvider>
  );
};

// 🧱 Inline styles for layout
const formStyle: React.CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
};

const formRow: React.CSSProperties = {
  display: "flex",
  gap: "1rem",
  marginBottom: "1rem",
  flexWrap: "wrap", // responsive
};

const formColumn: React.CSSProperties = {
  flex: 1,
  minWidth: "200px",
};

export default TwoColumnForm;
