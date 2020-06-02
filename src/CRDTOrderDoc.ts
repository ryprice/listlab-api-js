import {Map} from 'immutable';

export type CRDTOrderNode<T> = {
  readonly key: string;
  readonly prev: string;
  readonly next: string;
  readonly value: T;
};

export default class CRDTOrderDoc<T> {
  readonly doc: Map<string, CRDTOrderNode<T>>;
  readonly equal: (a: T, b: T) => boolean;
  readonly first: string;
  readonly last: string;

  private constructor(
    doc: Map<string, CRDTOrderNode<T>>,
    equal: (a: T, b: T) => boolean,
    first: string,
    last: string
  ) {
    this.doc = doc;
    this.equal = equal;
    this.first = first;
    this.last = last;
  }

  public remove(key: string) {
    let innerDoc = this.doc;
    const removeNode = this.doc.get(key);
    innerDoc = innerDoc.set(key, {
      ...removeNode,
      value: null,
    });
    return new CRDTOrderDoc(innerDoc, this.equal, this.first, this.last);
  }

  public append(value: T) {
    const insertKey = Math.random() + '';
    const moveNode = this.doc.find(v => this.equal(v.value, value));
    if (this.doc.size < 1) {
      const innerDoc = this.doc.set(insertKey, {
        key: insertKey,
        prev: null,
        next: null,
        value
      });
      return new CRDTOrderDoc(innerDoc, this.equal, insertKey, insertKey);
    } else if (moveNode != null) {
      return this.remove(moveNode.key).insertAfter(value, this.last);
    } else {
      return this.insertAfter(value, this.last);
    }
  }

  public prepend(value: T) {
    const insertKey = Math.random() + '';
    const moveNode = this.doc.find(v => this.equal(v.value, value));
    if (this.doc.size < 1) {
      const innerDoc = this.doc.set(insertKey, {
        key: insertKey,
        prev: null,
        next: null,
        value
      });
      return new CRDTOrderDoc(innerDoc, this.equal, insertKey, insertKey);
    } else if (moveNode != null) {
      return this.remove(moveNode.key).insertBefore(value, this.first);
    } else {
      return this.insertBefore(value, this.first);
    }
  }

  private insertBefore(value: T, before: string) {
    let updatedDoc = this.doc;
    const nextKey = before;
    const nextNode = updatedDoc.get(nextKey);
    const prevKey = nextNode.prev;
    const prevNode = prevKey !== null ? updatedDoc.get(prevKey) : null;
    const insertKey = Math.random() + '';

    if (prevNode !== null) {
      updatedDoc = updatedDoc.set(prevKey, {
        ...prevNode,
        next: insertKey,
      });
    }
    updatedDoc = updatedDoc.set(insertKey, {
      key: insertKey,
      prev: prevKey,
      next: nextKey,
      value
    });
    updatedDoc = updatedDoc.set(nextKey, {
      ...nextNode,
      prev: insertKey,
    });

    const first = prevNode === null ? insertKey : this.first;
    return new CRDTOrderDoc(updatedDoc, this.equal, first, this.last);
  }

  private insertAfter(value: T, after: string) {
    let updatedDoc = this.doc;
    const prevKey = after;
    const prevNode = updatedDoc.get(prevKey);
    const nextKey = prevNode.next;
    const nextNode = nextKey !== null ? updatedDoc.get(nextKey) : null;
    const insertKey = Math.random() + '';

    updatedDoc = updatedDoc.set(prevKey, {
      ...prevNode,
      next: insertKey,
    });
    updatedDoc = updatedDoc.set(insertKey, {
      key: insertKey,
      prev: prevKey,
      next: nextKey,
      value
    });
    if (nextNode !== null) {
      updatedDoc = updatedDoc.set(nextKey, {
        ...nextNode,
        prev: insertKey,
      });
    }

    const last = nextNode === null ? insertKey : this.last;
    return new CRDTOrderDoc(updatedDoc, this.equal, this.first, last);
  }

  public moveBefore(value: T, before: string) {
    const moveNode = this.doc.find(v => this.equal(v.value, value));
    if (moveNode == null) {
      return this.insertBefore(value, before);
    } else {
      return this.remove(moveNode.key).insertBefore(value, before);
    }
  }

  public moveAfter(value: T, after: string) {
    const moveNode = this.doc.find(v => this.equal(v.value, value));
    if (moveNode == null) {
      return this.insertAfter(value, after);
    } else {
      return this.remove(moveNode.key).insertAfter(value, after);
    }
  }

  public toJS() {
    return this.doc.valueSeq().toJS();
  }

  public stringify() {
    return JSON.stringify(this.toJS());
  }

  public static create<T>(strDoc: string, equal: (a: T, b: T) => boolean) {
    const objDoc = JSON.parse(strDoc) as CRDTOrderNode<T>[];
    const doc = Map<string, CRDTOrderNode<T>>().withMutations(mutableDoc => {
      objDoc.forEach(n => {
        mutableDoc.set(n.key, n);
      });
    });
    const firstNode = doc.find(n => n.prev === null);
    const firstKey = firstNode != null ? firstNode.key : null;
    const lastNode = doc.find(n => n.next === null);
    const lastKey = lastNode != null ? lastNode.key : null;
    return new CRDTOrderDoc(doc, equal, firstKey, lastKey);
  }

  public findValue(value: T) {
    const node = this.doc.find(v => this.equal(v.value, value));
    return node ? node.key : null;
  }

  public values() {
    if (this.doc.size < 1) {
      return [];
    }
    const acc: T[] = [];
    let next = this.doc.get(this.first);
    let i = 0; // safety for cycles
    while (i < this.doc.size) {
      i++;
      if (next.value !== null) {
        acc.push(next.value);
      }
      if (next.next === null) {
        next = null;
        break;
      }
      next = this.doc.get(next.next);
    }
    if (next !== null) {
      throw 'Cycle in CRDTOrderDoc';
    }
    return acc;
  }
}