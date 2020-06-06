export const restParseInt = (data: any) => {
  return data != null ? parseInt(data) : null;
};

export const restParseIntArr = (data: any): number[] => {
  if (Array.isArray(data)) {
    /* tslint:disable-next-line:no-unnecessary-callback-wrapper */
    return data.map(d => parseInt(d));
  }
  return [parseInt(data)];
};

export const restParseBool = (data: any): boolean => {
  if (typeof data === 'boolean') {
    return data;
  }
  if (data === 'true' || data === 'TRUE') {
    return true;
  } else if (data === 'false' || data === 'FALSE') {
    return false;
  }
  return null;
};

export const restParseDate = (data: any): Date => {
  if (data) {
    return new Date(data);
  }
  return null;
};

export const restParseString = (data: any): string => {
  if (data != null) {
    return `${data}`;
  }
  return null;
};