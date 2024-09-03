const FOCUSABLE_ELEMENT_SELECTORS = `a[href],button:not([disabled]),button:not([hidden]),:not([tabindex="-1"]),input:not([disabled]),input:not([type="hidden"]),select:not([disabled]),textarea:not([disabled])`;

export const isVisible = (element: HTMLElement) => {
    if (process.env.NODE_ENV === 'test') {
        return true;
    }

    const computed = getComputedStyle(element);

    return computed.position === 'fixed' ? false : element.offsetParent !== null;
}

export const obtainAllFocusableElements = (element: HTMLElement): HTMLElement[] => {
    return Array.from(element.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENT_SELECTORS)).filter((item: HTMLElement) => {
        return isFocusable(item) && isVisible(item);
    });
}

export const isFocusable = (element: HTMLElement): boolean => {
    if (element.tabIndex > 0 || (element.tabIndex === 0 && element.getAttribute('tabIndex') !== null)) {
        return true;
    }

    if ((element as HTMLButtonElement).disabled) {
        return false;
    }

    switch (element.nodeName) {
        case 'A': {
            return (!!(element as HTMLAnchorElement).href && (element as HTMLAnchorElement).rel !== 'ignore')
        };
        case 'INPUT': {
            return !((element as HTMLInputElement).type === 'hidden' || (element as HTMLInputElement).type === 'file');
        };
        case 'BUTTON':
        case 'SELECT':
        case 'TEXTAREA': {
            return true;
        };
        default: {
            return false;
        }
    }
}
