import React from 'react';
import './MyGrid.css'

export type MyGridColumn = {
    id: string
    name: string
    field: string
    width: Int16Array
    formatter?: Function
    cssClass?: string
    sortable?: boolean
}

export type MyGridOptions = {
    rowHeight?: number,
    editable?: boolean,
    enableAddRow?: boolean,
    enableCellNavigation?: boolean
}

export interface MyGridRowDataInterface {
    getUniqKey() : string
}

export interface MyGridRowData extends Slick.SlickData, MyGridRowDataInterface {}

export type MyGridProps<T extends MyGridRowData> = {
    style?: string | React.CSSProperties
    options?: Slick.GridOptions<T>
    columns?: Slick.Column<T>[]
    data?: Array<T>
    uniqKey?: string
}

export type MyGridState<T extends MyGridRowData> = {
    data?: Array<T> | Slick.Data.DataView<T>
    dataToUpdate?: Map<string, T>
    counter?: number
}

export default class MyGrid<T extends MyGridRowData> extends React.Component<MyGridProps<T>, MyGridState<T>> {
    private baseRef : React.RefObject<HTMLDivElement>;
    private pagerRef : React.RefObject<HTMLDivElement>;
    private grid : Slick.Grid<T> | null;
    private dataView : Slick.Data.DataView<T> | null;
    constructor(props : Readonly<MyGridProps<T>>) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.baseRef = React.createRef();
        this.pagerRef = React.createRef();
        this.grid = null;
        this.dataView = null;
        this.state = {};
    }
    componentDidMount() {
        if (this.baseRef.current && this.props.data && this.props.columns && this.props.options) {
            this.dataView = new Slick.Data.DataView({ inlineFilters: true });
            this.grid = new Slick.Grid(this.baseRef.current,
                this.dataView, this.props.columns, this.props.options);
//            const pager : Slick.Controls.Pager = new Slick.Controls.Pager(dataView, this.grid, this.pagerRef.current);
            // wire up model events to drive the grid
            this.dataView.onRowCountChanged.subscribe((e, args) => {
                if (!this.grid) return;
                this.grid.updateRowCount();
                this.grid.render();
            });
            this.dataView.onRowsChanged.subscribe((e, args) => {
                if (!this.grid) return;
                this.grid.invalidateRows(args.rows);
                this.grid.render();
            });
            this.dataView.beginUpdate();
            this.dataView.setItems(this.props.data);
//            dataView.setFilter(myFilter);
            this.dataView.setFilterArgs(0);
            this.dataView.endUpdate();
        }
    }
    componentWillUnmount() {
        this.grid?.destroy();
    }
    shouldComponentUpdate(nextProps: Readonly<MyGridProps<T>>, nextState: Readonly<MyGridState<T>>, nextContext: any) {
        return false;
    }
    render() {
        const rx : RegExp = /([^:;]+):([^:;]+);?/g;
        const rxNoComma : RegExp = /^(\S+),$/;
        const isStyleCSSProperties : boolean = (this.props.style instanceof Object);
        const styleObjStr : string = (isStyleCSSProperties) ? '' :
                (this.props.style as string).replace(rx, (...args) => {
                return !args ? '' : `"${args[1]}":"${args[2]}",`;
            }).replace(rxNoComma, (...args) => {
                return !args ? '' : args[1];
            });
        const myStyle : React.CSSProperties = (this.props.style && isStyleCSSProperties) ? this.props.style as React.CSSProperties : 
            JSON.parse(`{${styleObjStr}}`) as React.CSSProperties;

        return (
            <div>
                <div className="my-grid" ref={this.baseRef} style={myStyle} onClick={this.onClick}>
                    {this.state.counter}
                </div>
                <div ref={this.pagerRef}></div>
            </div>
        );
    }
    onClick(e : React.MouseEvent<HTMLDivElement, MouseEvent>) {
        e.preventDefault();
        const { counter } = this.state;
        this.setState({counter: (counter) ? counter + 1 : 1})
    }
    setItem(item : T) : void {
        this.dataView?.beginUpdate();
        this.dataView?.updateItem(item.getUniqKey(), item)
        this.dataView?.endUpdate();
    }
}
