import React, { Component } from "react";
import Results from './../Body/Results'
import SearchForm from './../Body/SearchForm'
import thunkMiddleware from 'redux-thunk';
import { connect, Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { reducer } from './../reducers/Reducer';
import { submitPerson } from './../actions/actions';

export const store = createStore(reducer, applyMiddleware(thunkMiddleware));
const ReduxSearchForm = connect(mapStateToProps, mapDispatchToProps)(SearchForm);

const Render=()=> {
           return (
                 <Results/>
               );
    } 

class Body extends Component {

    render() {
        const td1 = {
            width:'30%',
              padddingRight:'2%',  
              position:'fixed'      
         }
    
         return (
             <Provider store={store}>
                 <table>
                     <tbody>
                         <tr>
                             <td style={td1}> <ReduxSearchForm /></td>
                             <td style={{width:'70%'}}> <Results/></td>
                         </tr>
 
                     </tbody>
                 </table>
             </Provider>
 
         );
    } l
}


store.subscribe(() => {Render() 
    console.log("Updated store:"+ store.getState().person.user)})

function mapStateToProps(state) {
    return {
        isLoading: state.isLoading,
        person: state.person,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onSubmit: (person) => {
            dispatch(submitPerson(person));
        },
    };
}


export default  Body;
///////////////////////////////////////////////////////////////////////////////////////////////////////
import React from "react";
import { connect } from 'react-redux';
import GridContainer from './kendoGrid'
import {store} from './../DashBoard/Body'
class Results extends React.Component {

    constructor(props, context) {
        super(props, context)
      }
    componentDidMount() {
             store.subscribe(() => this.forceUpdate());
      }

   

    render() {
        return (
            <div style={{ paddingLeft: '5%' }}>
                <h3>person data:{store.getState().person.user} </h3>
                {store.getState().person.user.length ? <GridContainer/> : ''}

            </div>
        );
    }
}



export default Results;
//////////////////////////////////////////////////////////
import React from 'react';
import $ from 'jquery';
import kendo from '@progress/kendo-ui';
import { Grid, GridColumn } from '@progress/kendo-grid-react-wrapper';
import {store} from './../DashBoard/Body'
class GridContainer extends React.Component {
    constructor(props) {
        super(props);
       
        this.state={
            showMessage:false,
            selected:[],
            dataSource : this.fetchDataSource()
        }
    }
    componentDidMount() {
        store.subscribe(() => this.forceUpdate());

 }
 fetchDataSource=()=>{
   return new kendo.data.DataSource({
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

 }
 componentDidUpdate(prevProps, prevState) {
    console.log("Kendogrid.js - search query:"+store.getState().person.user)
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
            <div id="searchGrid">
            <Grid dataSource={this.state.dataSource}
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
                <GridColumn field="UnitsInStock" title="Units in Stock" />
                <GridColumn field="Discontinued" />
                <GridColumn command={["edit", "destroy"]} title="Actions" />
            </Grid>
                </div>
                :''}
       
           
            </div>
        );

    }
}

export default GridContainer;
