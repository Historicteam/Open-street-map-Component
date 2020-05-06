var FavouritesButtons=React.createClass({displayName: "FavouritesButtons", 
    propTypes: {
        chosen: React.PropTypes.object,
        onAddClick: React.PropTypes.func,
        onSortClick: React.PropTypes.func,
	onDeleteClick: React.PropTypes.func
    },

    render: function(){
        return(
            React.createElement("div",{className:"form-group"},
              React.createElement("button",{className:"active", onClick: () => this.props.onAddClick(this.props.chosen)},
              "Добавить в избранное"),
              React.createElement("button",{className:"active", onClick: () => this.props.onSortClick()},
              "Отсортировать"),
              React.createElement("button",{className:"active", onClick: () => this.props.onDeleteClick()},
              "Удалить")
        )
        );
    }
});
