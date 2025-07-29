import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import useGetInfiniteScroll from 'hooks/useScrollGet'
import { useHooks, useDebounce } from "hooks";


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
  const [searchQuery, setSearch] = useState("")

  const { data, hasNextPage, fetchNextPage, isLoading, refetch } = useGetInfiniteScroll({
    url: url,
    name: name,
    params: params,
    search: searchQuery,
    queryOptions: {
      enabled: false,
    },
  })

  const items: any[] | undefined = get(data, 'pages', [])?.map(item => get(item, dataKey)).flat(1)

  const newData =
    items.map(item => {
      return {
        ...item,
        label: typeof get(item, optionLabel) === 'function' ? optionLabel(item) : get(item, optionLabel),
        value: get(item, optionValue),
      }
    })

  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    refetch();
  }, [debouncedSearch]);

  return (
    <div className={rootClassName + ' input relative my-asyncselect-wrapper'}>
      {label ? <p className="font-[500] py-[6px] inline-block mb-[8px]">{label}</p> : null}
      <Select
        onMenuOpen={() => {
          refetch()
        }}
        required={required}
        value={get(values, name)}
        getOptionLabel={option => typeof optionLabel === "function" ? optionLabel(option) : option[optionLabel]}
        getOptionValue={option => option[optionValue]}
        key={name}
        onInputChange={(newValue, { action }) => {
          if (action === "input-change") {
            setSearch(newValue);
          }
        }}
        //@ts-ignore
        options={newData}
        filterOption={filterOption}
        placeholder={placeholder}
        className={"my-asyncselect " + className}
        // onMenuScrollToBottom={() => { hasNextPage && (fetchNextPage()) }}
        onMenuScrollToBottom={() => { fetchNextPage() }}
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