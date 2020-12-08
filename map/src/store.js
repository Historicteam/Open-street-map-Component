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
          console.log("favourites:", this.favourites);
          console.log("adding to favourites", chosen);
          if (!this.favourites.includes(chosen))
             updater.set({favourites: [...this.favourites, chosen]}) 
          console.log(this.favourites);   
        },
	
        setSelectable: function(updater, chosen){
	       updater.set({selectable: chosen})
        },
        
        moveFavouriteUp: function(updater, selectable){
          console.log("moving up", selectable, this.favourites);
          var i = this.favourites.indexOf(selectable);
          console.log("index found", i);
          this.favourites.splice(i,1);
          console.log("deleted element");
          this.favourites.unshift(selectable);
          console.log("moved up");

          updater.set({favourites: this.favourites});
          console.log("updated");
        },

       	sortFavourites: function(updater){
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
      }
    });
  }
}
