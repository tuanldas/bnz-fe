import {DataGrid, DataGridColumnHeader, DataGridRowSelect, DataGridRowSelectAll, KeenIcon} from '@/components';
import {useMemo} from 'react';
import {Column, ColumnDef} from '@tanstack/react-table';
import {Input} from '@/components/ui/input';

interface IColumnFilterProps<TData, TValue> {
    column: Column<TData, TValue>;
}
class IUsersData {
    id: number | undefined
    name: string | undefined
    description: string | undefined
}

const List = ({classes}: { classes: any }) => {
    const ColumnInputFilter = <TData, TValue>({ column }: IColumnFilterProps<TData, TValue>) => {
        return (
            <Input
                placeholder="Filter..."
                value={(column.getFilterValue() as string) ?? ''}
                onChange={(event) => column.setFilterValue(event.target.value)}
                className="h-9 w-full max-w-40"
            />
        );
    };

    const columns = useMemo<ColumnDef<IUsersData>[]>(
        () => [
            {
                accessorKey: 'id',
                header: () => <DataGridRowSelectAll />,
                cell: ({ row }) => <DataGridRowSelect row={row} />,
                enableSorting: false,
                enableHiding: false,
                meta: {
                    headerClassName: 'w-0'
                }
            },
            {
                accessorFn: (row: IUsersData) => row.name,
                id: 'name',
                header: ({ column }) => <DataGridColumnHeader title="Lớp" filter={<ColumnInputFilter column={column}/>} column={column} />,
                enableSorting: true,
                meta: {
                    className: 'min-w-[300px]',
                    cellClassName: 'text-gray-800 font-normal',
                }
            },
            {
                accessorFn: (row) => row.description,
                id: 'description',
                header: ({ column }) => <DataGridColumnHeader title="Mô tả" column={column}/>,
                enableSorting: true,
                cell: (info) => {
                    return info.row.original.description;
                },
                meta: {
                    headerClassName: 'min-w-[180px]',
                }
            },
        ],
        []
    );
    return (
        <DataGrid
            columns={columns}
            data={classes}
            rowSelection={true}
            pagination={{ size: 10 }}
            sorting={[{ id: 'name', desc: false }]}
            layout={{ card: true }}
        />
    );
};

export {List};
