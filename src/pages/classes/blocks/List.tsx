import {Column} from '@tanstack/react-table';


interface IColumnFilterProps<TData, TValue> {
    column: Column<TData, TValue>;
}

const List = ({classes}: { classes: any }) => {
    return (
        <div className="card">
            <div className="card-table scrollable-x-auto">
                <table className="table">
                    <thead>
                    <tr>
                        <th className="">ID</th>
                        <th className="min-w-24">Lớp</th>
                        <th className="min-w-32">Mô tả</th>
                        <th className="w-8"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        classes ? classes.map((column: any) => (
                                <tr key={column.id}>
                                    <td className="text-sm text-gray-800 font-normal">{column.id}</td>
                                    <td className="text-sm text-gray-800 font-normal">{column.name}</td>
                                    <td className="text-sm text-gray-800 font-normal">{column.description}</td>
                                </tr>
                            ))
                            : null
                    }
                    {
                        classes && classes.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="text-center text-muted-foreground py-6">
                                    No data available
                                </td>
                            </tr>
                        ) : null
                    }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export {List};
