export function child<T, U>(item: T, fieldPath: string[] | string): U {
  let output: any = item;
  fieldPath = 'string' === typeof fieldPath ? (<string>fieldPath).split('.') : fieldPath;

  for (let i = 0; output && i < fieldPath.length; i++) {
    output = output[fieldPath[i]];
  }

  return output;
}
