import * as React from 'react';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { RendererProvider, createDOMRenderer } from '@griffel/react';

const renderer = createDOMRenderer();

export const MyWebPartRoot = () => (
<RendererProvider renderer={renderer}>
<FluentProvider theme={webLightTheme}>
{/* Your component here */}
</FluentProvider>
</RendererProvider>
);
