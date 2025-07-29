import React, { useCallback, useState } from 'react';
import { Pagination, Space, Table, Tag } from 'antd';
import type { PaginationProps, TableColumnsType } from 'antd';
import { TMeta } from 'services/types';
import { useHooks } from 'hooks';

interface IProps {
  items: any[]
  columns: TableColumnsType<any>,
  hasPagination?: boolean
  meta?: TMeta
  isLoading?: boolean
}

const TableComponent = (props: IProps) => {
  const { columns, items, hasPagination = true, isLoading, meta } = props
  const { get, query, navigate, qs } = useHooks()
  const [current, setCurrent] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const onChange = useCallback(
    (pagination: PaginationProps) => {
      navigate({
        search: qs.stringify({
          ...query,
          page: pagination.current,
          limit: pagination.pageSize,
        }),
      });
    },
    [navigate, query]
  );

  return (
    <>
      <Table
        columns={columns}
        dataSource={items}
        rowKey={'id'}
        onChange={(page: any) => {
          if (meta) {
            onChange(page)
          } else {
            setCurrent(page.current)
          }
        }}
        loading={isLoading}
      />
      {meta && meta.perPage && (
        <div className="pt-[20px] flex justify-end">
          <Pagination
            current={meta.currentPage}
            pageSize={meta.perPage}
            total={meta.totalCount}
            onChange={setPage}
          />
        </div>
      )}
    </>
  )
};

export default TableComponent;
