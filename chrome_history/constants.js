export const activeTabs = new Map();

export function printMap(map) {
    map.forEach((value, key) => {
        console.log(`Key: ${key}, Value: ${value}`);
    });
}