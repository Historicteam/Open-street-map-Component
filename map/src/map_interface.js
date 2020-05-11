var MapInterface = React.createClass({displayName: "MapInterface",
  propTypes: {
    questions: React.PropTypes.array,
    store: React.PropTypes.object
  },

  componentDidMount: function() {
    this.cleanModel();
    this.initChosenListener();
    this.initObjectsListener();
    this.initLoadedListener();
    this.initFavourites();
  },

  cleanModel: function() {
    fluxify.doAction('clean');
  },

  initChosenListener: function() {
    this.props.store.on('change:chosen', (chosen) => {
      this.setState({chosen: chosen});
    });
  },

  initObjectsListener: function() {
    this.props.store.on('change:objects', (objects) => {
      this.setState({objects: Object.values(objects)});
    });
  },

  initLoadedListener: function() {
    this.props.store.on('change:loaded', (loaded) => {
      this.setState({loaded: loaded});
    });
  },

  initFavourites: function(){
    this.props.store.on('change:favourites', (favourites)=>{
      this.setState({favourites: favourites});
    });

  },

  getInitialState: function() {
    return {
      objects: Object.values(this.props.store.objects),
      chosen: this.props.store.chosen,
      loaded: this.props.store.loaded,
      favourites: this.props.store.favourites
    };
  },

  onListClick: function() {
    fluxify.doAction('resetChosen');
  },

  onClick: function(object) {
    fluxify.doAction('chooseObject', object);
  },

  onMapClick: function(coordinates) {
    fluxify.doAction('importObject', coordinates);
  },

  onAddClick: function(chosen){
    fluxify.doAction('setFavouritesState', chosen)
  },

  
  //TODO remove hard-coded question
  onAgentParamsChange: function(params) {
    SCWeb.core.Main.doCommand(MapKeynodes.get('ui_menu_file_for_finding_persons'), [this.state.chosen.id]);
  },

  createViewer: function() {
    if (this.state.chosen)
      return React.createElement(Article, {object: this.state.chosen, onListClick: this.onListClick})
    else
      return React.createElement(List, {objects: this.state.objects, onArticleClick: this.onClick})
  },

  createViewerList: function(){
    return React.createElement(FavouritesList,{favourites: this.props.store.favourites})
  },

  render: function() {
    return (
      React.createElement(Loader, {loaded: this.state.loaded}, 
        React.createElement(Map, {objects: this.state.objects, chosen: this.state.chosen, onMarkerClick: this.onClick, onMapClick: this.onMapClick}), 
        React.createElement("div", {className: "row", style: {margin: "10px"}}, 
          React.createElement("div", {className: "col-sm-5 well"}, 
            React.createElement("div", {className: "form-group"}, 
              React.createElement(QuestionLine, {onChange: this.onAgentParamsChange, questions: this.props.questions})
            ), 
            React.createElement(Timeline, {onTimeChange: this.onAgentParamsChange}), 
            this.createViewer(),
            React.createElement(GeneratePath),
            React.createElement(FavouritesButtons, {chosen: this.state.chosen, onAddClick:this.onAddClick}),
            this.createViewerList()
          )
        )
      )
    );
  }
});

