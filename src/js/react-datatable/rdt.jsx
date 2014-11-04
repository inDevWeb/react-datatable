/** @jsx React.DOM */
var React = require('react');
var DataSource = require("./datasource");
var Pager = require("./pager");

var RDTRow = require("./row.jsx");
var RDTColumn = require("./column.jsx");
var Paginator = require("./paginator.jsx");


var TABLE_CSS = {
    pure: {
        table: 'pure-table pure-table-bordered'
    },
    'pure-striped': {
        table: 'pure-table pure-table-bordered pure-table-striped'
    },
    bootstrap: {
        table: 'table table-bordered'
    },
    foundation: {
        table: ''
    }
}

/**
 * Simple Data Table using react.
 *
 *
 *  var datasource = {
 *       data: []
 *   };
 *
 *  var config = {
 *      style : 'pure',
 *       cols : [
 *           { editable: true, property: "path" , header: "First Name"  }
        ]
    };
 *
 */
var RDT = React.createClass({

    nextPage : function() {
        if ( this.pager ) {
            this.pager = this.pager.next();
            this.setState({ pager : this.pager.state() });
        }

    },

    getInitialState: function () {

        this.ds = new DataSource(this.props.config,this.props.datasource);
        if ( this.props.config.pager ) {
            this.pager = new Pager(1,this.props.config.pager.rowsPerPage,this.ds);
            return { pager : this.pager.state() }
        }
        return { pager : null };
    },

    pagerUpdated : function(page) {
        if ( this.pager ) {
            this.pager = this.pager.toPage(page);
            this.setState({ pager : this.pager.state() });
        }
    },

    render: function () {
        var tableStyle = TABLE_CSS[this.props.config.style];
        var config = this.props.config;

        var paginator = null;
        if ( this.pager ) {
            paginator =  <Paginator datasource={this.ds} config={this.props.config} pageChangedListener={this.pagerUpdated}/> ;

        }
        return (
            <div>
                <div className="rdt-container" ref="container">
                    <table className={tableStyle['table']}>
                        <RDTColumn config={config} />
                        <tbody>
                        {
                            this.ds.map(this.state.pager,function(data,idx,realIdx) {
                                return  <RDTRow ds={this.ds} key={realIdx}  data={data} config={config} />
                            }.bind(this))
                        }
                        </tbody>

                    </table>
                </div>
                {paginator}
            </div>
        )

    }
});


module.exports = RDT;