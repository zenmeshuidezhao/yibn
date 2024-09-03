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

export const attemptFocus = (element: HTMLElement): boolean => {
    if (!isFocusable(element)) {
        return false;
    }

    element.focus?.();

    return document.activeElement === element;
}

export const triggerEvent = function (elm: HTMLElement, name: string, ...opts: Array<boolean>): HTMLElement {
    let eventName: string;

    if (name.includes('mouse') || name.includes('click')) {
        eventName = 'MouseEvents';
    } else if (name.includes('key')) {
        eventName = 'KeyboardEvent';
    } else {
        eventName = 'HTMLEvents';
    }

    const evt = document.createEvent(eventName);

    evt.initEvent(name, ...opts);
    elm.dispatchEvent(evt);

    return elm;
}

export const isLeaf = (el: HTMLElement) => !el.getAttribute('aria-owns');

export const getSibling = (el: HTMLElement, distance: number, elClass: string) => {
    const { parentNode } = el;

    if (!parentNode) return null;

    const siblings = parentNode.querySelectorAll(elClass);
    const index = Array.prototype.indexOf.call(siblings, el);

    return siblings[index + distance] || null;
}

export const focusNode = (el: HTMLElement) => {
    if (!el) return;
    el.focus();
    !isLeaf(el) && el.click();
}
