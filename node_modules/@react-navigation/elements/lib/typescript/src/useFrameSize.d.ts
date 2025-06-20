import * as React from 'react';
type Size = {
    width: number;
    height: number;
};
export declare function useFrameSize<T>(selector: (size: Size) => T, debounce?: boolean): T;
export declare function FrameSizeProvider({ children }: {
    children: React.ReactNode;
}): string | number | bigint | boolean | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | import("react/jsx-runtime").JSX.Element | null | undefined;
export {};
//# sourceMappingURL=useFrameSize.d.ts.map