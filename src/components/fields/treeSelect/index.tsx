import React, { FC, useState } from 'react';
import Select from 'react-select';
import get from 'lodash/get';

interface OptionType {
  label: string;
  value: string;
  options?: OptionType[];
}

const convertMenusToOptions = (menus: any[]): OptionType[] => {
  return menus.map((i) => (
    get(i, "children", []).length > 0 ? {
      label: i.title,
      value: i.key,
      options: get(i, "children", []).map((child: any) => ({
        label: child.title,
        value: child.key,
      }))
    } : {
      label: i.title,
      value: i.key,
    }
  ));
};

interface TreeSelectProps {
  options: OptionType[];
  onChange: (selectedOption: OptionType | null) => void;
  value: OptionType | null;
}

const TreeSelect: FC<TreeSelectProps> = ({ options, onChange, value }) => {
  return (
    <Select
      options={options}
      onChange={onChange}
      value={value}
      isMulti={false}
      closeMenuOnSelect={true}
    />
  );
};

const App: React.FC = () => {
  // Sample menus data
  // const menus = helpers.menuItems.map((i) => (
  //   get(i, "children", []).length > 0 ? {
  //     key: i.key,
  //     value: i.key,
  //     title: i.label,
  //     children: get(i, "children", []).map((i) => (
  //       {
  //         key: i.key,
  //         value: i.key,
  //         title: i.label,
  //       }
  //     ))
  //   } : {
  //     key: i.key,
  //     value: i.key,
  //     title: i.label,
  //   }
  // ));

  // const options = convertMenusToOptions(menus);

  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);

  const handleChange = (option: OptionType | null) => {
    setSelectedOption(option);
  };

  return (
    <div>
      <h1>Tree Select Example</h1>
      {/* <TreeSelect options={options} onChange={handleChange} value={selectedOption} /> */}
    </div>
  );
};

export default App;