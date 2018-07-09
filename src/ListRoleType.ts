enum ListRoleType {
  READ,
  WRITE
}

export const consumeListRoleType = (json: any): ListRoleType => {
  if (json === 'read') {
    return ListRoleType.READ;
  } else if (json === 'write'){
    return ListRoleType.WRITE;
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
