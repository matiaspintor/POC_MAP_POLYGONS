import { Component, OnInit } from '@angular/core';
import * as Mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'geographicPoc';

  public comunasSeleccionadas: any[] = new Array();
  public zonasCreadas: any[] = new Array();
  public nombreZona: string = '';
  public count: number;
  map: Mapboxgl.Map;

  ngOnInit() {
    this.count = 1;
    this.initMap();
    this.loadGeoJsonTest();
  }

  initMap() {
    (Mapboxgl as any).accessToken = 'pk.eyJ1IjoibWF0aWFzcGludG9yIiwiYSI6ImNrZ2NpMjBjajByYWIyeW9qaXFiMGg5bjgifQ.Z4bJsM1RKy-Qo_Ju-ixssA';
    this.map = new Mapboxgl.Map({
      container: 'map-demo',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-70.7699131, -33.4724228], //lng, lat
      zoom: 10
    });

  }

  loadGeoJsonTest() {
    this.map.on('load', () => {
      this.map.addSource('dataMap', {
        'type': 'geojson',
        'generateId': true,
        'data': 'https://opendata.arcgis.com/datasets/e3a1f8c4aa014429847c2944e3d92406_0.geojson'
      });
      this.map.addLayer({
        'id': 'borderersPolygons',
        'type': 'line',
        'source': 'dataMap',
        'layout': {},
        'paint': {
          'line-width': 3
        }
      });
      this.map.addLayer({
        'id': 'polygons',
        'type': 'fill',
        'source': 'dataMap',
        'layout': {},
        'paint': {
          'fill-color': [
            'case',
            ['boolean', ['feature-state', 'click'], true],
            '#48dbfb', // if selected true, paint in blue
            '#1dd1a1' // else paint in gray
          ],
          'fill-opacity': 0.7,
          'fill-outline-color': 'rgba(0,0, 0, 1)'
        },
        'filter': ['==', '$type', 'Polygon']
      });

      this.map.addLayer({
        id: "polygon-name",
        type: "symbol",
        source: "dataMap",
        layout: {
          "text-field": "{comuna}\n",
          "text-size": 12,
          'symbol-placement': "point"
        },
        paint: {
          "text-color": ["case",
            ["boolean", ["feature-state", "hover"], false],
            'rgba(255,0,0,0.75)',
            'rgba(0,0,0,0.75)'
          ],
          "text-halo-color": ["case",
            ["boolean", ["feature-state", "hover"], false],
            'rgba(255,255,0,1)',
            'rgba(255,255,255,1)'
          ],
          "text-halo-width": 3,
          "text-halo-blur": 0,
        }
      });



    });


    this.map.on('click', 'polygons', (e) => {
      if (this.comunasSeleccionadas.indexOf(e.features[0].properties.comuna) === -1) {
        this.comunasSeleccionadas.push(e.features[0].properties.comuna);
        console.log(e.features[0].properties.comuna);
      }
    });
  }

  crearZona() {
    this.zonasCreadas.push({
      'count': this.count,
      'nombreZona': this.nombreZona,
      'comunas': this.comunasSeleccionadas
    });
    this.count++;
    this.comunasSeleccionadas = new Array();
    this.nombreZona = '';
  }

}
