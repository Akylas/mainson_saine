// export {}; // ensure this is a module
// interface LodashMixins {
//     remove<T extends object, K extends keyof T>(object: T, key?: K, defaultValue?: T[K]): T[K];
//     getKeyByValue(object, value);
//     mapIfDefined(array, func);
//     mod(n, m);
//     move(array, oldIndex, newIndex);
//     pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K>;
// }
// declare global {
//     const _: _.LoDashStatic & LodashMixins;
// }

export interface LodashMixins {
    remove<T extends object, K extends keyof T>(object: T, key?: K, defaultValue?: T[K]): T[K];
    getKeyByValue(object, value);
    mapIfDefined(array, func);
    mod(n, m);
    move(array, oldIndex, newIndex);
    pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K>;
}

export function load() {
    var oldRemove = _.remove;
    _.mixin({
        remove: function(array, predicate, thisArg) {
            if (_.isPlainObject(array)) {
                var result = array.hasOwnProperty(predicate) ? array[predicate] : thisArg;
                delete array[predicate];
                return result;
            } else {
                oldRemove(array, predicate);
            }
        },
        getKeyByValue: function(object, value) {
            for (var prop in object) {
                if (this.hasOwnProperty(prop)) {
                    if (object[prop] === value) return prop;
                }
            }
        },
        mapIfDefined: function(array, func) {
            return _.reduce(
                array,
                function(memo, value, key) {
                    var item = func(value, key);
                    if (item) {
                        memo.push(item);
                    }
                    return memo;
                },
                []
            );
        },
        mod: function(n, m) {
            return (n % m + m) % m;
        },
        move: function(array, oldIndex, newIndex) {
            array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
        }
    });
}
