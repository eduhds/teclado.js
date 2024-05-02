type Preset = Array<Array<string>>;
type KeyboardType = keyof typeof presets;
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
    setKeyboardType: typeof setKeyboardType;
    on(elmentId: string, changeCallback: (value?: string) => void, submitCallback?: () => void): () => void;
};
declare function showKeyboard(): void;
declare function hideKeyboard(): void;
declare function setKeyboardType(type: KeyboardType): void;
export {};
