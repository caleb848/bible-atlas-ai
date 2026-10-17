import type { Feature, FeatureCollection, LineString } from 'geojson'
import type { ExpressionSpecification, LayerSpecification, StyleSpecification } from 'maplibre-gl'

/**
 * "Light atlas" map style on OpenFreeMap's free OpenMapTiles vector tiles (no API key), derived
 * from OpenFreeMap's Positron and recoloured toward a printed historical atlas: limestone land,
 * muted Aegean water, quiet grey modern labels. The ancient places and routes drawn on top lead.
 */

export const ATLAS_COLORS = {
  land: '#efebe4',
  water: '#b3c8d4',
  coast: '#97afbf',
  river: '#a7bfcd',
  urban: '#e7e2d8',
  building: '#ddd6ca',
  roadMajor: '#d6cec1',
  roadMinor: '#e1dace',
  border: '#b3ab9d',
  countryLabel: '#958e81',
  cityLabel: '#7b7569',
  waterLabel: '#587789',
  graticule: 'rgba(110, 100, 85, 0.075)',
  halo: '#f4f1eb',
  /** Journey routes (cobalt): at least 3:1 against both land and water. */
  route: '#2448b0',
  routeActive: '#13245a',
  routeCasing: '#fcfbf8',
  overview: '#2f56bd',
} as const

/** Layers whose ids start with this are modern-geography labels (hidden by the label control). */
export const MODERN_LABEL_PREFIX = 'modern-'

const nameField: ExpressionSpecification = ['coalesce', ['get', 'name:en'], ['get', 'name:latin'], ['get', 'name']]

/** Lines of latitude and longitude every 5°, faint like an engraved atlas. */
function graticule(): FeatureCollection<LineString> {
  const features: Feature<LineString>[] = []
  for (let lng = -180; lng <= 180; lng += 5) {
    features.push({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [[lng, -80], [lng, 80]] } })
  }
  for (let lat = -80; lat <= 80; lat += 5) {
    features.push({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [[-180, lat], [180, lat]] } })
  }
  return { type: 'FeatureCollection', features }
}

const ATTRIBUTION =
  '<a href="https://openfreemap.org" target="_blank" rel="noopener">OpenFreeMap</a> <a href="https://www.openmaptiles.org/" target="_blank" rel="noopener">© OpenMapTiles</a> Data from <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'

export interface AtlasStyleOptions {
  /**
   * Natural Earth shaded relief. Its raster tiles are large (≈200 KB each), so it is drawn only on
   * wide screens, where it adds the most and the connection is usually better.
   */
  relief: boolean
}

export function createAtlasStyle({ relief }: AtlasStyleOptions): StyleSpecification {
  const reliefLayers: LayerSpecification[] = relief
    ? [
        {
          // Grey relief at low opacity: mountains read as a soft engraving on the limestone land.
          id: 'relief',
          type: 'raster',
          source: 'relief',
          maxzoom: 9,
          paint: {
            'raster-saturation': -1,
            'raster-contrast': 0.1,
            'raster-brightness-min': 0.32,
            'raster-opacity': ['interpolate', ['linear'], ['zoom'], 3, 0.42, 6, 0.32, 8.5, 0],
            'raster-fade-duration': 300,
          },
        },
      ]
    : []

  return {
    version: 8,
    name: 'Bible Atlas Light',
    glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
    sources: {
      openmaptiles: { type: 'vector', url: 'https://tiles.openfreemap.org/planet', attribution: ATTRIBUTION },
      ...(relief
        ? {
            relief: {
              type: 'raster' as const,
              tiles: ['https://tiles.openfreemap.org/natural_earth/ne2sr/{z}/{x}/{y}.png'],
              tileSize: 256,
              maxzoom: 6,
              attribution: 'Relief: <a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener">Natural Earth</a>',
            },
          }
        : {}),
      graticule: { type: 'geojson', data: graticule() },
    },
    layers: [
      { id: 'background', type: 'background', paint: { 'background-color': ATLAS_COLORS.land } },
      ...reliefLayers,
      {
        id: 'landuse-urban',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'landuse',
        minzoom: 9,
        filter: ['match', ['get', 'class'], ['residential', 'suburb', 'neighbourhood', 'commercial'], true, false],
        paint: { 'fill-color': ATLAS_COLORS.urban, 'fill-opacity': ['interpolate', ['linear'], ['zoom'], 9, 0, 12, 0.8] },
      },
      {
        id: 'water',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'water',
        filter: ['!=', ['get', 'brunnel'], 'tunnel'],
        paint: { 'fill-color': ATLAS_COLORS.water, 'fill-antialias': true },
      },
      {
        id: 'coastline',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'water',
        filter: ['!=', ['get', 'brunnel'], 'tunnel'],
        paint: {
          'line-color': ATLAS_COLORS.coast,
          'line-width': ['interpolate', ['linear'], ['zoom'], 3, 0.5, 8, 0.9, 14, 1.4],
          'line-opacity': 0.85,
        },
      },
      {
        id: 'rivers',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'waterway',
        filter: ['match', ['get', 'class'], ['river', 'canal'], true, false],
        paint: {
          'line-color': ATLAS_COLORS.river,
          'line-width': ['interpolate', ['linear'], ['zoom'], 5, 0.6, 10, 1.5, 14, 2.8],
        },
      },
      { id: 'graticule', type: 'line', source: 'graticule', maxzoom: 9, paint: { 'line-color': ATLAS_COLORS.graticule, 'line-width': 0.8 } },
      {
        id: 'buildings',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'building',
        minzoom: 14,
        paint: { 'fill-color': ATLAS_COLORS.building, 'fill-opacity': ['interpolate', ['linear'], ['zoom'], 14, 0, 15.5, 0.8] },
      },
      {
        id: 'roads-minor',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        minzoom: 12,
        filter: ['match', ['get', 'class'], ['minor', 'service', 'tertiary'], true, false],
        paint: {
          'line-color': ATLAS_COLORS.roadMinor,
          'line-width': ['interpolate', ['linear'], ['zoom'], 12, 0.6, 16, 3],
        },
      },
      {
        id: 'roads-major',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        minzoom: 7,
        filter: ['match', ['get', 'class'], ['motorway', 'trunk', 'primary', 'secondary'], true, false],
        paint: {
          'line-color': ATLAS_COLORS.roadMajor,
          'line-opacity': ['interpolate', ['linear'], ['zoom'], 7, 0.35, 11, 0.85],
          'line-width': ['interpolate', ['linear'], ['zoom'], 7, 0.5, 16, 3.5],
        },
      },
      {
        id: 'borders',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'boundary',
        filter: ['all', ['==', ['get', 'admin_level'], 2], ['!=', ['get', 'maritime'], 1]],
        paint: {
          'line-color': ATLAS_COLORS.border,
          'line-opacity': 0.7,
          'line-width': ['interpolate', ['linear'], ['zoom'], 3, 0.5, 10, 1],
          'line-dasharray': [3, 2],
        },
      },
      {
        id: `${MODERN_LABEL_PREFIX}water`,
        type: 'symbol',
        source: 'openmaptiles',
        'source-layer': 'water_name',
        filter: ['match', ['geometry-type'], ['Point', 'MultiPoint'], true, false],
        layout: {
          'text-field': nameField,
          'text-font': ['Noto Sans Italic'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 3, 11, 8, 14],
          'text-letter-spacing': 0.2,
          'text-max-width': 8,
        },
        paint: { 'text-color': ATLAS_COLORS.waterLabel, 'text-opacity': 0.85 },
      },
      {
        id: `${MODERN_LABEL_PREFIX}country`,
        type: 'symbol',
        source: 'openmaptiles',
        'source-layer': 'place',
        maxzoom: 8,
        // Small states (e.g. Vatican City, Monaco) would crowd the Italian peninsula.
        filter: [
          'all',
          ['==', ['get', 'class'], 'country'],
          ['<=', ['coalesce', ['get', 'rank'], 1], 4],
          ['!', ['in', ['coalesce', ['get', 'iso_a2'], ''], ['literal', ['VA', 'SM', 'MC', 'AD', 'LI']]]],
        ],
        layout: {
          'text-field': nameField,
          'text-font': ['Noto Sans Regular'],
          'text-transform': 'uppercase',
          'text-letter-spacing': 0.3,
          'text-size': ['interpolate', ['linear'], ['zoom'], 3, 9.5, 7, 12],
          'text-max-width': 7,
        },
        paint: { 'text-color': ATLAS_COLORS.countryLabel, 'text-halo-color': ATLAS_COLORS.halo, 'text-halo-width': 1 },
      },
      {
        id: `${MODERN_LABEL_PREFIX}city`,
        type: 'symbol',
        source: 'openmaptiles',
        'source-layer': 'place',
        minzoom: 7,
        filter: ['match', ['get', 'class'], ['city', 'town'], true, false],
        layout: {
          'text-field': nameField,
          'text-font': ['Noto Sans Regular'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 7, 10, 12, 12.5],
          'text-max-width': 8,
        },
        paint: {
          'text-color': ATLAS_COLORS.cityLabel,
          'text-halo-color': ATLAS_COLORS.halo,
          'text-halo-width': 1.2,
        },
      },
      {
        id: `${MODERN_LABEL_PREFIX}streets`,
        type: 'symbol',
        source: 'openmaptiles',
        'source-layer': 'transportation_name',
        minzoom: 15,
        layout: {
          'text-field': nameField,
          'text-font': ['Noto Sans Regular'],
          'text-size': 10.5,
          'symbol-placement': 'line',
        },
        paint: { 'text-color': ATLAS_COLORS.cityLabel, 'text-halo-color': ATLAS_COLORS.halo, 'text-halo-width': 1 },
      },
    ],
  }
}
