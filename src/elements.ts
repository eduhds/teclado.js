export type KeyboardTheme = {
  // Container
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  // Variants Content
  variantsBackgroundColor?: string;
  // Keys
  keyBoxShadowColor?: string;
  keyBoxShadowColorOn?: string;
};

export const lightTheme: KeyboardTheme = {
  backgroundColor: '#fff',
  textColor: '#000',
  borderColor: '#ccc',
  variantsBackgroundColor: 'rgba(255, 255, 255, 0.8)',
  keyBoxShadowColor: 'rgba(0, 0, 0, 0.2)',
  keyBoxShadowColorOn: 'rgba(0, 0, 0, 0.4)'
};

export const darkTheme: KeyboardTheme = {
  backgroundColor: '#333',
  textColor: '#fff',
  borderColor: '#666',
  variantsBackgroundColor: 'rgba(51, 51, 51, 0.8)',
  keyBoxShadowColor: 'rgba(255, 255, 255, 0.2)',
  keyBoxShadowColorOn: 'rgba(255, 255, 255, 0.4)'
};

export function containerDiv(id: string, theme: KeyboardTheme = lightTheme) {
  const container = document.createElement('div');

  container.id = id;

  container.style.position = 'fixed';
  container.style.bottom = '0px';
  container.style.left = '0px';
  container.style.right = '0px';
  container.style.display = 'none';
  container.style.zIndex = '9999';
  container.style.width = '100%';
  container.style.userSelect = 'none';

  container.style.background = theme.backgroundColor;
  container.style.color = theme.textColor;
  container.style.border = `1px solid ${theme.borderColor}`;

  return container;
}

export function contentDiv(id: string) {
  const content = document.createElement('div');

  content.id = id;

  content.style.display = 'flex';
  content.style.flexDirection = 'column';
  content.style.justifyContent = 'center';
  content.style.gap = '10px';
  content.style.paddingTop = '10px';
  content.style.paddingBottom = '10px';
  content.style.width = '100%';

  return content;
}

export function panelDiv(id: string, theme: KeyboardTheme = lightTheme) {
  const panel = document.createElement('div');

  panel.id = id;

  panel.style.display = 'flex';
  panel.style.paddingLeft = '10px';
  panel.style.paddingRight = '10px';
  panel.style.justifyContent = 'center';
  panel.style.alignItems = 'center';
  panel.style.fontSize = '1rem';
  panel.style.height = '1.5rem';

  panel.style.color = theme.textColor;

  return panel;
}

export function lineDiv() {
  const line = document.createElement('div');

  line.style.display = 'flex';
  line.style.gap = '6px';
  line.style.justifyContent = 'center';
  line.style.paddingLeft = '10px';
  line.style.paddingRight = '10px';

  return line;
}

export function keyButton(id: string, theme: KeyboardTheme = lightTheme) {
  const button = document.createElement('button');

  button.id = id;

  button.style.width = '4rem';
  button.style.height = '3rem';
  button.style.fontSize = '1.5rem';
  button.style.borderRadius = '5px';
  button.style.display = 'flex';
  button.style.alignItems = 'center';
  button.style.justifyContent = 'center';
  button.style.cursor = 'pointer';

  button.style.background = theme.backgroundColor;
  button.style.color = theme.textColor;
  button.style.border = `1px solid ${theme.borderColor}`;
  button.style.boxShadow = `0 2px 4px ${theme.keyBoxShadowColor}`;
  button.style.transition = 'box-shadow 0.3s ease';

  return button;
}

export function variantsContentDiv(theme: KeyboardTheme = lightTheme) {
  const variantsContent = document.createElement('div');

  variantsContent.style.position = 'absolute';
  variantsContent.style.top = '0';
  variantsContent.style.left = '0';
  variantsContent.style.width = '100%';
  variantsContent.style.height = '100%';
  variantsContent.style.zIndex = '9999';
  variantsContent.style.display = 'flex';
  variantsContent.style.justifyContent = 'center';
  variantsContent.style.alignItems = 'center';
  variantsContent.style.flexWrap = 'wrap';
  variantsContent.style.gap = '10px';

  if (theme.variantsBackgroundColor) {
    variantsContent.style.backgroundColor = theme.variantsBackgroundColor;
  }

  return variantsContent;
}

export function variantKeyButton(theme: KeyboardTheme = lightTheme) {
  const variantButton = document.createElement('button');

  variantButton.style.width = '3rem';
  variantButton.style.height = '3rem';
  variantButton.style.fontSize = '1.5rem';
  variantButton.style.borderRadius = '5px';
  variantButton.style.display = 'flex';
  variantButton.style.alignItems = 'center';
  variantButton.style.justifyContent = 'center';
  variantButton.style.cursor = 'pointer';

  variantButton.style.background = theme.backgroundColor;
  variantButton.style.color = theme.textColor;
  variantButton.style.border = `1px solid ${theme.borderColor}`;

  return variantButton;
}

export function dotIndicatorDiv(theme: KeyboardTheme = lightTheme) {
  const dotIndicator = document.createElement('div');

  dotIndicator.id = 'dot-indicator';
  dotIndicator.style.width = '0.5rem';
  dotIndicator.style.height = '0.5rem';
  dotIndicator.style.borderRadius = '50%';
  dotIndicator.style.position = 'absolute';
  dotIndicator.style.top = '0.25rem';
  dotIndicator.style.right = '0.25rem';

  dotIndicator.style.backgroundColor = theme.textColor;

  return dotIndicator;
}
