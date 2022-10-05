import {useEffect, useRef, useState} from "react";

export function usePrevIfUndefined<T>(value: T[] | undefined): T[] {
    // The ref object is a generic container whose current property is mutable ...
    // ... and can hold any value, similar to an instance property on a class
    // @ts-ignore
    const [ref, setRef] = useState<T[]>([]);
    // Store current value in ref
    if(value) {
        setRef(value);
        return value;
    } else {
        return ref;
    }
}
