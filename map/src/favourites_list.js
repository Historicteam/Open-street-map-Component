var FavouritesList = React.createClass({displayName: "FavouritesList",
  propTypes: {
    favourites: React.PropTypes.array,
    onSelectableClick: React.PropTypes.func
  },

  getDescription: function(favourite) {
    if (favourite.description)
      return favourite.description.slice(0, 100) + "...";
  },

  getPreview: function(favourite) {
    if (favourite.image)
      return React.createElement("img", {src: favourite.image, className: "img-thumbnail"})
  },

  render: function() {
    return (
      React.createElement("div", {className: "list-group", ref: "list", style: {overflowY: "auto", maxHeight: "300px"}}, 
        
          this.props.favourites.map(function(favourite, index) {
            return (
              React.createElement("a", {key: index, href: "#", className: "list-group-item", onClick: () => this.props.onSelectableClick(favourite)}, 
                React.createElement("h4", {className: "list-group-item-heading"}, favourite.title), 
                React.createElement("div", {className: "row"}, 
                  React.createElement("div", {className: "col-sm-5"}, 
                    this.getPreview(favourite)
                  ), 
                  React.createElement("div", {className: "col-sm-7"}, 
                    React.createElement("p", {className: "list-group-item-text"}, this.getDescription(favourite))
                  )
                )
              )
            );
          }, this
        )
      )
    );
  }
});
