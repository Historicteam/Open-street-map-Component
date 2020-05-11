/* --- src/history.js --- */
var History = React.createClass({displayName: "History",
  propTypes: {
    clearHistory: React.PropTypes.func,
    localHistory: React.PropTypes.array,
    onMapClick: React.PropTypes.func
  },
   
  openFavorite: function(idOfObject) {
    SCWeb.core.Main.doDefaultCommand([idOfObject]);
  },

  render: function() {
    return (React.createElement("div", {className: "list-group", style: {overflowY: "auto", maxHeight: "300px"}},	 
          this.props.localHistory.map(function(object, index) {
		return (React.createElement("div", {key: index, className: "active", onClick: () => fluxify.doAction('chooseObject', object)}, React.createElement("a", {key: index, href: "#", onClick: this.openFavorite, className: "list-group-item"}, object.title)));
	
	  }
	)
        ));
}	
});
