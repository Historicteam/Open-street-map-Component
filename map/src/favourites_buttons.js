var FavouritesButtons=React.createClass({displayName: "FavouritesButtons", 
    propTypes: {
        chosen: React.PropTypes.object,
        onAddClick: React.PropTypes.func,
    },

    render: function(){
        return(
            React.createElement("div",{className:"form-group"},
              React.createElement("button",{className:"active", onClick: () => this.props.onAddClick(this.props.chosen)},
              "Кнопка добавить в избранное")
        )
        );
    }
});
