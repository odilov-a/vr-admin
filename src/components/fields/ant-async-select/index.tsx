import React, { useState } from 'react';
import Select from 'react-select';
import { useGet, useHooks } from 'hooks';
import useGetInfiniteScroll from 'hooks/useScrollGet'

interface DataItem {
  id: number;
  name: string;
}

const AsyncSelect: React.FC = (props: any) => {


  const {
    url,
    params,
    filterParams,
    dataKey = 'data',
    onChange = () => { },
    search = () => { },
    extraOptions = [],
    loadOptions,
    isSearchable = true,
    disableOptions = [],
    isClearable = false,
    isDisabled = false,
    required = false,
    placeholder = 'Выберите...',
    optionLabel,
    optionValue,
    rootClassName,
    filterOption,
    label,
    isMulti,
    field: { name },
    form: { errors, setFieldValue, setFieldTouched, touched, values, },
    className,
  } = props

  const { get } = useHooks()
  const [searchedName, setSearch] = useState()


  // const { data: searchedData } = useGet({
  //   name: name,
  //   url: url,
  //   params: {
  //     filter: { name: searchedName }
  //   }
  // });


  const { data, hasNextPage, fetchNextPage, isLoading, refetch } = useGetInfiniteScroll({
    url: url,
    name: name,
    params: params,
    queryOptions: {
      enabled: false,
    },
  })

  const items: any[] | undefined = get(data, 'pages', [])?.map(item => get(item, dataKey)).flat(1)

  const newData =
    // searchedName ? get(searchedData, "data", []).map((item: any) => {
    //   return {
    //     ...item,
    //     label: typeof get(item, optionLabel) === 'function' ? optionLabel(item) : get(item, optionLabel),
    //     value: get(item, optionValue),
    //   }
    // }) :
    items.map(item => {
      return {
        ...item,
        label: typeof get(item, optionLabel) === 'function' ? optionLabel(item) : get(item, optionLabel),
        value: get(item, optionValue),
      }
    })

  return (
    <div className={rootClassName + ' input relative'}>
      {label ? <p className="text-[#9EA3B5] px-[12px] py-[6px] bg-[#E6ECFE] rounded-[6px] inline-block mb-[12px] dark:bg-[#454d70]">{label}</p> : null}
      <Select
        onMenuOpen={() => {
          refetch()
        }}
        required={required}
        value={get(values, name)}
        getOptionLabel={option => typeof optionLabel === "function" ? optionLabel(option) : option[optionLabel]}
        getOptionValue={option => option[optionValue]}
        key={name}
        onInputChange={(e: any) => (setSearch(e))}
        //@ts-ignore
        options={newData}
        filterOption={filterOption}
        placeholder={placeholder}
        className={className}
        onMenuScrollToBottom={() => { hasNextPage && (fetchNextPage()) }}
        onChange={option => {
          if (onChange) {
            setFieldValue(name, option)
            onChange(option)
          } else {
            setFieldValue(name, option)
          }
        }}
        isDisabled={isDisabled}
        isSearchable={isSearchable}
        isClearable={isClearable}
        isMulti={isMulti}
      />
      <p className="mt-[5px] text-[#ff4d4f]">
        {errors[name] && touched[name] ? (
          <span>{errors[name]?.toString() ?? "Error"}</span>
        ) : null}
      </p>
    </div>
  );
};

export default AsyncSelect;