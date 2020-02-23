import {expect} from 'chai';
import 'mocha';

import CRDTOrderDoc, {CRDTOrderNode} from '../src/CRDTOrderDoc';

const simpleComparator = <T>(a: T, b: T) => a === b;

const sampleObjDoc1: CRDTOrderNode<number>[] = [
  {key: 'b', prev: null, next: 'f', value: 2},
  {key: 'l', prev: 'f', next: null, value: 12},
  {key: 'f', prev: 'b', next: 'l', value: 6},
];
let sampleDoc1 = CRDTOrderDoc.create<number>(
  JSON.stringify(sampleObjDoc1),
  simpleComparator
);

describe('CRDTOrderDoc', () => {
  it ('construct, insert, remove', () => {
    let doc = sampleDoc1;
    expect(doc.values()).to.eql([2,6,12]);

    doc = doc.moveAfter(13, 'l');
    expect(doc.values()).to.eql([2,6,12,13]);

    doc = doc.moveBefore(5, 'f');
    expect(doc.values()).to.eql([2,5,6,12,13]);

    doc = doc.remove('l');
    expect(doc.values()).to.eql([2,5,6,13]);
  });

  it ('insert first', () => {
    const objDoc: CRDTOrderNode<number>[] = [
      {key: 'b', prev: null, next: null, value: 2},
    ];
    let doc = CRDTOrderDoc.create<number>(JSON.stringify(objDoc), simpleComparator);
    doc = doc.moveBefore(1, 'b');
    expect(doc.values()).to.eql([1,2]);
  });

  it ('insert last', () => {
    const objDoc: CRDTOrderNode<number>[] = [
      {key: 'b', prev: null, next: null, value: 2},
    ];
    let doc = CRDTOrderDoc.create<number>(JSON.stringify(objDoc), simpleComparator);
    doc = doc.moveAfter(3, 'b');
    expect(doc.values()).to.eql([2,3]);
  });

  it ('create empty', () => {
    const objDoc: CRDTOrderNode<number>[] = [];
    let doc = CRDTOrderDoc.create<number>(JSON.stringify(objDoc), simpleComparator);
    expect(doc.values()).to.eql([]);
    doc = doc.append(1);
    expect(doc.values()).to.eql([1]);
  });

  it ('findValue', () => {
    expect(sampleDoc1.findValue(12)).to.eql('l');
  });

  it ('findValue doesnt exist', () => {
    const objDoc: CRDTOrderNode<number>[] = [];
    let doc = CRDTOrderDoc.create<number>(JSON.stringify(objDoc), simpleComparator);
    expect(doc.findValue(-1)).to.eql(null);
  });
});