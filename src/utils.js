export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}
export function extendSingle(target, source) {
    for (var key in source) {
        target[key] = is.arr(source[key]) ? source[key].slice(0) : source[key]
    }
    return target
}
export function extend(target, source) {
    if (!target) target = {}
    for (var i = 1; i < arguments.length; i++) {
        extendSingle(target, arguments[i])
    }
    return target
}

export function randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}