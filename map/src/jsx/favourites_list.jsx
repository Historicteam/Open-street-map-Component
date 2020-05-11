var FavouritesList = React.createClass({
    propTypes: {
      favourites: React.PropTypes.array,
    },
  
    getDescription: function(favourite) {
      if (favourite.description)
        return favourite.description.slice(0, 100) + "...";
    },
  
    getPreview: function(favourite) {
      if (favourite.image)
        return <img src={favourite.image} className="img-thumbnail"></img>
    },
  
    render: function() {
      return (
        <div className="list-group" ref="list" style={{overflowY: "auto", maxHeight: "150px"}}>
          {
            this.props.favourites.map(function(favourite, index) {
              return (
                <a key={index} href="#" className="list-group-item">
                  <h4 className="list-group-item-heading">{favourite.title}</h4>
                  <div className="row">
                    <div className="col-sm-5">
                      {this.getPreview(favourite)}
                    </div>
                    <div className="col-sm-7">
                      <p className="list-group-item-text">{this.getDescription(favourite)}</p>
                    </div>
                  </div>
                </a>
              );
            }, this
          )}
        </div>
      );
    }
  });
  
