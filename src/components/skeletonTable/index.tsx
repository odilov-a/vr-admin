import { Skeleton, Table } from "antd";
import { useHooks } from "hooks";

interface ColumnConfig {
  title: string;
  className: string;
}

const SkeletonTable: React.FC = (columns: any) => {
  const { get } = useHooks()
  const cols = get(columns, "columns")

  const generateSkeletonDataSource = (
    configs: ColumnConfig[],
    rowCount: number = 5
  ) => {

    return Array.from({ length: rowCount }).map((_, index) => {
      const row: Record<string, JSX.Element> = {};

      configs.forEach(({ title }) => {
        row[title] = (
          <Skeleton.Input
            key={`${title}-${index}`}
            active
            size="small"
          />
        );
      });

      return { key: index, ...row };
    });
  };

  const skeletonData = generateSkeletonDataSource(cols, 5);

  return (
    <Table
      columns={cols.map((col: any) => ({
        title: col.title,
        dataIndex: col.title,
        key: col.title,
      }))}
      dataSource={skeletonData}
      pagination={false}
    />
  );
};

export default SkeletonTable;