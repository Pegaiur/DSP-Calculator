import React from 'react';
import styles from './index.less';
import { testObject, ItemModel, sumReport } from '../main';
import { ItemEntry } from '../components/item';

let requiredYieldPerMin = 100;

export default function IndexPage() {
  return (
    <div>
      <h1>列表</h1>
      <ItemEntry item={testObject} requiredYieldPerMin={requiredYieldPerMin} />
      <h1>总计</h1>
      {JSON.stringify(sumReport(testObject, requiredYieldPerMin))}
    </div>
  );
}
