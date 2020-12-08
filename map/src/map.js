var Map = React.createClass({displayName: "Map",
  propTypes: {
    objects: React.PropTypes.array,
    chosen: React.PropTypes.object,
    onMarkerClick: React.PropTypes.func,
    onMapClick: React.PropTypes.func
  },

  renderPath: function(pathType) {
    this.clearPath();
    this.addPathToMap(pathType);
  },

  initCursorListener: function() {
    document.body.addEventListener('keydown', (event) => {
      if (event.ctrlKey)
        this.refs.map.style.cursor = "crosshair";
    });
    document.body.addEventListener('keyup', () => {
      this.refs.map.style.cursor = "";
    });
  },

  createMap: function() {
    this.map = new L.Map('map', {zoomControl: false});
    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osm = new L.TileLayer(osmUrl, {minZoom: 1, maxZoom: 17});
    this.map.addLayer(osm);
  },

  bindMapClickAction: function() {
    this.map.on('click', (event) => {
      if (event.originalEvent.ctrlKey)
        this.props.onMapClick(event.latlng)
    });
  },

  fixZoomControls: function() {
    new L.control.zoom({position: 'bottomright'}).addTo(this.map);
  },

  clearMap: function() {
    if (this.markers)
      this.map.removeLayer(this.markers);
  },

  clearPath: function() {
    if (this.control)
      this.map.removeControl(this.control);
    if (this.userLocationMarker) {
      this.map.removeLayer(this.userLocationMarker);
    }
  },

  addMarkersToMap: function() {
    var markers = [];
    var onMarkerClick = this.props.onMarkerClick;
    this.props.objects.map(function(object) {
      if (!MapUtils.empty(object.geojson)) {
        var marker = L.geoJSON(object.geojson).on('click', () => onMarkerClick(object));
        markers.push(marker);
      }
    });
    if (markers.length > 0) {
      this.markers = L.featureGroup(markers); 
      this.markers.addTo(this.map);
      this.map.fitBounds(this.markers.getBounds());
    }
  },

  addPathToMap: function(pathType) {
    var self = this;

    navigator.geolocation.getCurrentPosition(function(userPosition) {
      var startPoint = L.latLng(userPosition.coords.latitude, userPosition.coords.longitude);
      var waypoints = [];
      self.props.objects.forEach(function(object) {
        if (!MapUtils.empty(object.geojson)) {
          var objectCoordinates = object.geojson.features[0].geometry.coordinates;
          objectCoordinates = objectCoordinates[0][0]  || (Array.isArray(objectCoordinates[0]) ? objectCoordinates[0] : objectCoordinates);
          if (objectCoordinates.length === 2) {
            waypoints.push(L.latLng(objectCoordinates[1], objectCoordinates[0]));
          } else {
            console.log("ERROR: can't read coordinates properly for \"" + object.title + "\"");
          }
        }
      });

      self.control = L.Routing.control({
        waypoints: MapUtils.generateShortestPath(startPoint, waypoints),
        router: L.Routing.mapbox('pk.eyJ1IjoibG9zaWsiLCJhIjoiY2tobmg3a3pkMGZnZjJ0bDF3NWVrNDh4MiJ9.LydjoGpORwJoiqabKnxTOQ', { profile: pathType, language: 'ru' }),
        showAlternatives: false,
        routeWhileDragging: false,
        show: false,
        lineOptions: {
          styles: getLineStyleByType(pathType)
        },
        createMarker: function () { return null; }
      }).on('routesfound', function (e) {
        self.userLocationMarker = L.marker([startPoint.lat, startPoint.lng]).addTo(self.map);
        self.userLocationMarker.bindPopup("<b>Вы здесь</b>").openPopup();
        self.map.setView([startPoint.lat, startPoint.lng], 14);
      }).on('routingerror', function (e) {
        alert("Что-то пошло не так: " + JSON.parse(e.error.message).error);
      }).addTo(self.map);

    }, function(failure) {
        alert("Нет доступа к вашему местоложению\n" + failure.message);
    });

    var getLineStyleByType = function(pathType) {
      var lineMainColor;

      switch(pathType) {
        case "mapbox/driving":
          lineMainColor = "#ff2f00";
          break;
        case "mapbox/cycling":
          lineMainColor = "#7fff0b";
          break;
        default: 
          lineMainColor = "#0089ff";
      }
      
      return [{color: 'black', opacity: 0.15, weight: 10}, {color: 'black', opacity: 0.8, weight: 7}, {color: lineMainColor, opacity: 1, weight: 5}];
    }
  },

  setInitialView: function() {
    this.map.setView([53, 27], 1);
  },

  setCenter: function() {
    if (this.props.chosen && !MapUtils.empty(this.props.chosen.geojson))
      this.map.fitBounds(L.geoJSON(this.props.chosen.geojson).getBounds());
  },

  componentDidMount: function() {
    this.createMap();
    this.bindMapClickAction();
    this.setInitialView();
    this.fixZoomControls();
    this.initCursorListener();

    $(MapState).on('generatePath', function(e){
      this.renderPath(e.pathType);
    }.bind(this));
  },

  componentDidUpdate: function() {
    this.clearMap();
    this.addMarkersToMap();
    this.setCenter();
  },

  componentWillUnmount: function () {
    $(MapState).off('generatePath');
  },

  render: function() {
    return (
      React.createElement("div", {id: "map", ref: "map", style: {position: "absolute", top: "0px", left: "0px", width: "100%", height: "100%"}})
    );
  }
});

