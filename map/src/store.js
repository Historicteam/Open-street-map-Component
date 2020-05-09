MapStore = {
  get: function() {
    this.store = this.store || this.create();
    return this.store;
  },

  create: function() {
    return fluxify.createStore({
      id: "MapStore",
      initialState: {
        objects: {},
        chosen: null,
        contour: null,
        loaded: true,
        favourites: [],
        selectable: null,
        history: []
      },
      actionCallbacks: {
        importObject: function(updater, coordinates) {
          var objects = Object.assign({}, this.objects);
          MapUtils.importer(coordinates).import();
        },
        changeObject: function(updater, object) {
          var objects = Object.assign({}, this.objects);
          objects[object.id] = Object.assign({}, objects[object.id], object);
          updater.set({objects: objects});
        },
        clean: function(updater) {
          updater.set({objects: {}, chosen: null});
        },
        chooseObject: function(updater, object) {
          updater.set({chosen: object})
        },
        resetChosen: function(updater) {
          updater.set({chosen: null})
        },
        changeContour: function(updater, contour) {
          updater.set({contour: contour})
        },
        setLoadState: function(updater, loaded) {
          updater.set({loaded: loaded})
        },
        setFavouritesState: function(updater, chosen){
          if (!this.favourites.includes(chosen))
             updater.set({favourites: [...this.favourites, chosen]}) 
        },
	
        setSelectable: function(updater, chosen){
	   updater.set({selectable: chosen})
	},

	sortFavourites: function(updater){
          console.log("sortFavourites");
	   this.favourites.sort((a,b) => {
       	    if(a.title > b.title)	
 		return 1;
            if(a.title < b.title)
		return -1;
            return 0;
        }
        )
	  updater.set({favourites: this.favourites});
        },

        deleteFavourite: function(updater){
	  if(this.selectable) {
	    console.log(this.selectable);
	    this.favourites = this.favourites.splice(this.favourites.indexOf(this.selectable), 1);
	  }
	  this.selectable = null;
        }
    }});
  }
}
