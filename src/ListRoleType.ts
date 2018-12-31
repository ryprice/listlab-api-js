enum ListRoleType {
  READ,
  WRITE
}

export const consumeListRoleType = (json: any): ListRoleType => {
  if (typeof json === 'string' || json instanceof String) {
    if (json.toLowerCase() === 'read') {
      return ListRoleType.READ;
    } else if (json.toLowerCase() === 'write'){
      return ListRoleType.WRITE;
    }
  }
  return null;
};

export const generateListRoleTypeJson = (type: ListRoleType) => {
  switch (type) {
    case ListRoleType.READ: return 'read';
    case ListRoleType.WRITE: return 'write';
  }
};

export default ListRoleType;
