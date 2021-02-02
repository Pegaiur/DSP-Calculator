import React from 'react';
import styles from './index.less';
import { testObject, ItemModel, sumReport, allItemNames } from '../main';
import ItemEntry from '../components/item';
import SumReportPanel from '../components/sumReport';

import { render } from 'react-dom';

let requiredYieldPerMin = 100;

const itemSelect = (
  <select name="物品">
    {allItemNames.map((name, index) => {
      return (
        <option value={name} key={index}>
          {name}
        </option>
      );
    })}{' '}
    s
  </select>
);

function calculate() {
  requiredYieldPerMin = 0;
}

export default function IndexPage() {
  return (
    <div>
      <h1>产量计算</h1>
      <h2>选择物品</h2>
      {itemSelect}
      <h2>输入期望产量</h2>
      <input type="text" />
      <button onClick={calculate}>计算</button>
      {/* <ItemEntry item={testObject} requiredYieldPerMin={requiredYieldPerMin} /> */}
      <SumReportPanel
        item={testObject}
        requiredYieldPerMin={requiredYieldPerMin}
      ></SumReportPanel>
    </div>
  );
}
