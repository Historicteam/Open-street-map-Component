var isOpen = false;
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

    this.props.store.on('change:selectable', (selectable)=>{
      this.setState({selectable: selectable});
    });
  },

  getInitialState: function() {
    return {
      objects: Object.values(this.props.store.objects),
      chosen: this.props.store.chosen,
      loaded: this.props.store.loaded,
      favourites: this.props.store.favourites,
      selectable: this.props.store.selectable,
      history: this.props.store.history
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
    fluxify.doAction('setFavouritesState', chosen);
  },

  onSortClick: function(){
    this.props.store.favourites.sort((a,b) => {
       	    if(a.title > b.title)	
 		return 1;
            if(a.title < b.title)
		return -1;
            return 0;
          }
          );
    this.setState({favourites: this.props.store.favourites});
  },
  
  onDeleteClick: function(){
    if(this.props.store.selectable) {
      this.props.store.favourites.splice(this.props.store.favourites.indexOf(this.props.store.selectable), 1);
    }
    this.props.store.selectable = null;
    this.setState({favourites: this.props.store.favourites});
    
  },
  
  onSelectableClick: function(chosen){
    fluxify.doAction('setSelectable', chosen);
  },

  openHistory: function() {
    isOpen = isOpen == true ? false : true;
    this.forceUpdate();
  },

  addToHistory: function(object) {
    if(this.props.store.history.indexOf(object) < 0){
    	this.props.store.history.push(object);
        this.setState({history: this.props.store.history});	
    }
  },

  clearHistory: function() {
    this.props.store.history.splice(0, this.props.store.history.length);
    this.setState({history: this.props.store.history});
  },

  //TODO remove hard-coded question
  onAgentParamsChange: function(params) {
    SCWeb.core.Main.doCommand(MapKeynodes.get('ui_menu_file_for_finding_persons'), [this.state.chosen.id]);
  },

  createViewer: function() {
    if (this.state.chosen != null && this.state.chosen)
      return React.createElement(Article, {object: this.state.chosen, onListClick: this.onListClick, addToHistory: this.addToHistory})
    else if(isOpen == false)
      return React.createElement(List, {objects: this.state.objects, onArticleClick: this.onClick})
    else 
      return React.createElement(History, {localHistory: this.props.store.history, onMapClick: this.onClick, clearHistory: this.clearHistory})
  },

  createViewerList: function(){
    return React.createElement(FavouritesList, {favourites: this.props.store.favourites, onSelectableClick: this.onSelectableClick})
  },
   
  createViewHistory() {
     if(isOpen === true) {
  	return React.createElement("button", {className: "active", onClick: () => this.clearHistory()}, "Очистить"); }
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
            React.createElement("button", {className: "active", onClick: this.openHistory}, "История"),
	    this.createViewHistory(), 
            this.createViewer(),
            React.createElement(GeneratePath),
            React.createElement(FavouritesButtons, {chosen: this.state.chosen, onAddClick:this.onAddClick, onSortClick: this.onSortClick, onDeleteClick: this.onDeleteClick}),
            this.createViewerList()
          )
        )
      )
    );
  }
});
