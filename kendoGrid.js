import React from 'react';
import $ from 'jquery';
import kendo from '@progress/kendo-ui';
import { Grid, GridColumn } from '@progress/kendo-grid-react-wrapper';

class GridContainer extends React.Component {
    constructor(props) {
        super(props);
       
        this.dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "https://demos.telerik.com/kendo-ui/service/Products",
                    dataType: "jsonp"
                },
                update: {
                    url: "https://demos.telerik.com/kendo-ui/service/Products/Update",
                    dataType: "jsonp"
                },
                destroy: {
                    url: "https://demos.telerik.com/kendo-ui/service/Products/Destroy",
                    dataType: "jsonp"
                },
                create: {
                    url: "https://demos.telerik.com/kendo-ui/service/Products/Create",
                    dataType: "jsonp"
                },
                parameterMap: function (options, operation) {
                    if (operation !== "read" && options.models) {
                        return { models: kendo.stringify(options.models) };
                    }
                }
            },
            batch: true,
            pageSize: 5,
            schema: {
                model: {
                    id: "ProductID",
                    fields: {
                        ProductID: { editable: false, nullable: true },
                        ProductName: { validation: { required: true } },
                        UnitPrice: { type: "number", validation: { required: true, min: 1 } },
                        Discontinued: { type: "boolean" },
                        UnitsInStock: { type: "number", validation: { min: 0, required: true } }
                    }
                }
            }
        });

        this.state={
            showMessage:false,
            selected:[]
        }
    }

    onDataBound = () => {
        let self=this
        
        $('tr').dblclick(function () {

            var $row = $(this).closest("tr"),       // Finds the closest row <tr> 
                $tds = $row.find("td");             // Finds all children <td> elements

                const obj= {
                         'ProductID':$row.find("td:eq(0)").text(),
                        'UnitPrice':$row.find("td:eq(1)").text(),
                        'UnitsInStock':$row.find("td:eq(2)").text(),
                        'Discontinued':$row.find("td:eq(3)").text()
                  }
                  console.log(obj);
           self.setState(
               { selected:[...self.state.selected,obj],
                     showMessage:true
            }); 
             
    });
        
}

    render() {
        return (
            <div>
            <Grid dataSource={this.dataSource}
                scrollable={true} sortable={true}
                groupable={false} pageable={true}
                editable={"popup"}
                toolbar={["create"]}
                selectable={true}
                dataBound={this.onDataBound}
            >
                <GridColumn field="ProductID" template="#:ProductID# - #:ProductName#" title="ProductID" />
                <GridColumn field="UnitPrice" title="Unit Price" format="{0:c}" />
                <GridColumn field="UnitsInStock" title="Units in Stock" />
                <GridColumn field="Discontinued" />
                <GridColumn command={["edit", "destroy"]} title="Actions" />
            </Grid>
        
            {this.state.showMessage? 
            <div>
                <br/><h3>Selected Row</h3>
               
                <Grid dataSource={JSON.parse(JSON.stringify(this.state.selected))}
                
                 scrollable={true} sortable={true}
                pageable={true}
                editable={"popup"}
               
                selectable={true}>
               
                <GridColumn field="ProductID"  title="ProductID" />
                <GridColumn field="UnitPrice" title="Unit Price" format="{0:c}" />
                <GridColumn field="UnitsInStock" title="Units in Stock" />
                <GridColumn field="Discontinued" />
                <GridColumn command={["edit", "destroy"]} title="Actions" />
            </Grid>
                </div>
                :<h3>Not Clicked</h3>}
       
           
            </div>
        );

    }
}

export default GridContainer;