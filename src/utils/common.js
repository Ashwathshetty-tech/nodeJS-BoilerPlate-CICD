export function sanitizeObj(obj, allowNull = false) {
    Object.keys(obj).forEach((key) => {
      const val = obj[key];
      if (typeof val !== 'boolean') {
        /** val === '' added if blank update needs to be done */
        if (val || val === '' || val === 0 || (allowNull && val === null)) {
          obj[key] = val;
        } else {
          delete obj[key];
        }
      }
    });
    return obj;
}