/* --- src/history.js --- */
var History = React.createClass({displayName: "History",
  propTypes: {
    localHistory: React.PropTypes.array,
    onMapClick: React.PropTypes.func
  },
  
  clearHistory: function() {
  	this.props.localHistory = [];
        this.forceUpdate();
  },

  render: function() {
    return (React.createElement("div", {className: "list-group", style: {overflowY: "auto", maxHeight: "300px"}},
	React.createElement("button", {className: "active", onClick: () => this.clearHistory()}, "Очистить"),	 
          this.props.localHistory.map(function(object, index) {
		return (React.createElement("div", {key: index, className: "active", onClick: () => fluxify.doAction('chooseObject', object)}, React.createElement("a", {key: index, href: "#", onClick: this.openFavorite, className: "list-group-item"}, object.title)));
	
	  }
	)
        ));
}	
});
