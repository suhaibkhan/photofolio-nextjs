export function innerWidth(elem: HTMLElement) {
    const computedContStyle = window.getComputedStyle(elem);
    let containerWidth = elem.clientWidth;
    containerWidth -=
        parseFloat(computedContStyle.paddingLeft) +
        parseFloat(computedContStyle.paddingRight);
    return containerWidth;
};

export function innerHeight(elem: HTMLElement) {
    const computedContStyle = getComputedStyle(elem);
    let containerHeight = elem.clientHeight;
    containerHeight -=
        parseFloat(computedContStyle.paddingTop) +
        parseFloat(computedContStyle.paddingBottom);
    return containerHeight;
}
