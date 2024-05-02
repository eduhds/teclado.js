type Preset = Array<Array<string>>;
export type KeyboardType = keyof typeof presets;
type InputConfig = {
    keyboardType?: KeyboardType;
    onChange: (value?: string) => void;
    onSubmit?: () => void;
};
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
    on(elmentId: string, config: InputConfig): () => void;
};
declare function showKeyboard(): void;
declare function hideKeyboard(): void;
declare function setKeyboardType(type: KeyboardType): void;
export {};
