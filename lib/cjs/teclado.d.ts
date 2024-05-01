type CustomPreset = string[][];
type DefaultPreset = keyof typeof presets;
type Preset = DefaultPreset | CustomPreset;
type TecladoOptions = {
    contentClass?: string;
    keyClass?: string;
    keySymbols?: {
        Backspace?: string;
        Enter?: string;
        Shift?: string;
        Tab?: string;
    };
    preset?: Preset;
    disablePhisicalKeyboard?: boolean;
    theme?: 'light' | 'dark';
    withHeader?: boolean;
    onSubmit?: () => void;
};
declare let presets: {
    alphabet: string[][][];
    numeric: string[][][];
    numpad: string[][][];
    symbol: string[][][];
};
export declare function teclado(options?: TecladoOptions): {
    showKeyboard: typeof showKeyboard;
    hideKeyboard: typeof hideKeyboard;
    on(elmentId: string, changeCallback: (value?: string) => void): () => void;
};
declare function showKeyboard(): void;
declare function hideKeyboard(): void;
export {};
