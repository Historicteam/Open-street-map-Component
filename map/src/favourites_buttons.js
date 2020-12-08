var FavouritesButtons=React.createClass({displayName: "FavouritesButtons", 
    propTypes: {
        chosen: React.PropTypes.object,
        onSortClick: React.PropTypes.func,
        onDeleteClick: React.PropTypes.func,
        moveFavourite: React.PropTypes.func
    },

    render: function(){
        return(
            React.createElement("div",{className:"form-group"},            
              React.createElement("button",{className:"active", onClick: () => this.props.onSortClick()},
              "Отсортировать"),
              React.createElement("button",{className:"active", onClick: () => this.props.onDeleteClick()},
              "Удалить"),
              React.createElement("button",{className:"active", onClick: () => this.props.moveFavourite()},
              "Вверх")
        )
        );
    }
});
