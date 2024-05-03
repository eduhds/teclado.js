export type KeyboardPreset = Array<Array<string | string[]>>;
export type KeyboardType = keyof typeof presets;
export type InputConfig = {
    keyboardType?: KeyboardType;
    onChange: (value?: string) => void;
    onSubmit?: () => void;
};
export type TecladoOptions = {
    contentClass?: string;
    keyClass?: string;
    keySymbols?: {
        Backspace?: string;
        Enter?: string;
        Shift?: string;
        Tab?: string;
    };
    preset?: KeyboardPreset;
    disablePhisicalKeyboard?: boolean;
    theme?: 'light' | 'dark';
    withHeader?: boolean;
};
declare let presets: {
    default: string[][][];
    numeric: string[][][];
    numpad: string[][][];
    symbol: string[][][];
};
export declare function teclado(options?: TecladoOptions): {
    showKeyboard: typeof showKeyboard;
    hideKeyboard: typeof hideKeyboard;
    on(inputId: string, config: InputConfig): () => void;
};
declare function showKeyboard(): void;
declare function hideKeyboard(): void;
export {};
