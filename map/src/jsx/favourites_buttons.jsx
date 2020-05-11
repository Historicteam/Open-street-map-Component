var FavouritesButtons=React.createClass({ 
    propTypes: {
        chosen: React.PropTypes.object,
        onAddClick: React.PropTypes.func,
    },

    render: function(){
        return(
            <div className="form-group">
                <button className="active" onСlick={()=>this.props.onAddClick(this.props.chosen)}>Добавить в избранное</button>
            </div>
        );
    }
});
