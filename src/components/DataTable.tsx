type Column<T> = {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T]) => React.ReactNode;
};

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  alternative: string;
};

export default function DataTable<T extends { id: number }>({
  data,
  columns,
  alternative,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[900px]">
        <TableHeader columns={columns} />
        <tbody>
          {data.length > 0 ? (
            data.map((row) => (
              <TableRow key={row.id} row={row} columns={columns} />
            ))
          ) : (
            <tr>
              <td className="p-2">{alternative}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

type TableHeaderProps<T> = {
  columns: Column<T>[];
};

function TableHeader<T>({ columns }: TableHeaderProps<T>) {
  return (
    <thead>
      <tr className="border-b border-border">
        {columns.map((column) => (
          <th key={String(column.key)} className="p-2 text-right">
            {column.header}
          </th>
        ))}
      </tr>
    </thead>
  );
}

type TableRowProps<T> = {
  row: T;
  columns: Column<T>[];
};

function TableRow<T extends { id: number }>({
  row,
  columns,
}: TableRowProps<T>) {
  return (
    <tr key={String(row.id)}>
      {columns.map((column) => (
        <TableCell
          key={String(column.key)}
          value={row[column.key]}
          render={column.render}
        />
      ))}
    </tr>
  );
}

type TableCellProps<T> = {
  value: T;
  render?: (value: T) => React.ReactNode;
};

function TableCell<T>({ value, render }: TableCellProps<T>) {
  return <td className="p-2">{render ? render(value) : String(value)}</td>;
}
