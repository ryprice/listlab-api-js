import CRDTOrderDoc from 'listlab-api/CRDTOrderDoc';

export default interface TaskParentOrderTuple {
  taskId: number;
  doc: CRDTOrderDoc<number>;
}
