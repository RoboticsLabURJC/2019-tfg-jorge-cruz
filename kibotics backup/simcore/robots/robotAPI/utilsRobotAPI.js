export function sleep(s) {
    var ms = s*1000;
    return new Promise(resolve => setTimeout(resolve, ms));
}