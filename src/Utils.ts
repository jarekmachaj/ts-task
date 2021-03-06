/**
 * @description
 * Takes an Array<V>, and a grouping function,
 * and returns a Map of the array grouped by the grouping function.
 *
 * @param list An array of type V.
 * @param keyGetter A Function that takes the the Array type V as an input, and returns a value of type K.
 *                  K is generally intended to be a property key of V.
 *
 * @returns Map of the array grouped by the grouping function.
 */
 export function hasOneOf<T>(items : Set<T>, arrToCheck: T[]) : boolean {
    var result = false;

    arrToCheck.forEach(element => {
        if (items.has(element)) result = true;
    });
    
    return result;
}