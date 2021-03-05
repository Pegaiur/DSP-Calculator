import React from 'react';
import { Drawer, InputNumber, Button, Select, Switch } from 'antd';
import GlobalParameter, {
  defaultGlobalParameter,
} from '@/models/GlobalParameter';
import { CheckOutlined } from '@ant-design/icons';

const { Option } = Select;

interface IProps {
  globalParas: GlobalParameter;
  onChangeGlobalParas(globalparas: GlobalParameter): void;
}

interface IState {
  modifiedParas: GlobalParameter;
}

export default class GlobalParasPanel extends React.Component<IProps, IState> {
  constructor(props: IProps, state: IState) {
    super(props, state);

    this.state = {
      modifiedParas: defaultGlobalParameter,
    };
  }

  render() {
    return (
      <div>
        <div>
          "矿物利用"升级等级：
          <InputNumber
            min={0}
            max={100}
            precision={0}
            defaultValue={this.props.globalParas.veinsUtilizationLevel}
            value={this.state.modifiedParas.veinsUtilizationLevel}
            onChange={(value) => {
              this.state.modifiedParas.veinsUtilizationLevel = value;
              this.setState({ modifiedParas: this.state.modifiedParas });
            }}
            key="veinsUtilizationLevel"
          />
        </div>
        <br />
        <div>
          默认制造台等级：
          <Select
            defaultValue={this.props.globalParas.defaultBenchType}
            value={this.state.modifiedParas.defaultBenchType}
            style={{ width: 120 }}
            onChange={(value) => {
              this.state.modifiedParas.defaultBenchType = value;
              this.setState({ modifiedParas: this.state.modifiedParas });
            }}
          >
            <Option value="制造台MKI">制造台MKI</Option>
            <Option value="制造台MKII">制造台MKII</Option>
            <Option value="制造台MKIII">制造台MKIII</Option>
          </Select>
        </div>
        <br />
        <div>
          默认分馏塔传送带等级：
          <Select
            defaultValue="lucy"
            value={this.state.modifiedParas.defaultFractionBeltType}
            style={{ width: 120 }}
            onChange={(value) => {
              this.state.modifiedParas.defaultFractionBeltType = value;
              this.setState({ modifiedParas: this.state.modifiedParas });
            }}
          >
            <Option value="传送带">传送带</Option>
            <Option value="高速传送带">高速传送带</Option>
            <Option value="极速传送带">极速传送带</Option>
          </Select>
        </div>
        <br />
        <div>
          冰巨星 可燃冰 产量(每秒)：
          <InputNumber
            min={0.3}
            max={5}
            step={0.01}
            defaultValue={this.props.globalParas.defaultIceGaintYield['可燃冰']}
            value={this.state.modifiedParas.defaultIceGaintYield['可燃冰']}
            onChange={(value) => {
              this.state.modifiedParas.defaultIceGaintYield['可燃冰'] = value;
              this.setState({ modifiedParas: this.state.modifiedParas });
            }}
            key="veinsUtilizationLevel"
          />
        </div>
        <br />
        <div>
          冰巨星 氢 产量(每秒)：
          <InputNumber
            min={0.1}
            max={5}
            step={0.01}
            defaultValue={this.props.globalParas.defaultIceGaintYield['氢']}
            value={this.state.modifiedParas.defaultIceGaintYield['氢']}
            onChange={(value) => {
              this.state.modifiedParas.defaultIceGaintYield['氢'] = value;
              this.setState({ modifiedParas: this.state.modifiedParas });
            }}
            key="veinsUtilizationLevel"
          />
        </div>
        <br />
        <div>
          气巨星 重氢 产量(每秒)：
          <InputNumber
            min={0.01}
            max={5}
            step={0.01}
            defaultValue={this.props.globalParas.defaultGasGaintYield['重氢']}
            value={this.state.modifiedParas.defaultGasGaintYield['重氢']}
            onChange={(value) => {
              this.state.modifiedParas.defaultGasGaintYield['重氢'] = value;
              this.setState({ modifiedParas: this.state.modifiedParas });
            }}
            key="veinsUtilizationLevel"
          />
        </div>
        <br />
        <div>
          气巨星 氢 产量(每秒)：
          <InputNumber
            min={0.5}
            max={5}
            step={0.01}
            defaultValue={this.props.globalParas.defaultGasGaintYield['氢']}
            value={this.state.modifiedParas.defaultGasGaintYield['氢']}
            onChange={(value) => {
              this.state.modifiedParas.defaultGasGaintYield['氢'] = value;
              this.setState({ modifiedParas: this.state.modifiedParas });
            }}
            key="veinsUtilizationLevel"
          />
        </div>
        <br />
        启用副产物规避（测试版）:
        <div>
          <Switch
            defaultChecked={this.props.globalParas.avoidByproducts}
            onChange={(value) => {
              this.state.modifiedParas.avoidByproducts = value;
              this.setState({ modifiedParas: this.state.modifiedParas });
            }}
          />
        </div>
        <br />
        <Button
          type="primary"
          shape="round"
          size="large"
          icon={<CheckOutlined />}
          onClick={() =>
            this.props.onChangeGlobalParas(this.state.modifiedParas)
          }
        >
          确认修改
        </Button>
      </div>
    );
  }
}
