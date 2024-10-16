import { useContext, useState, useRef } from "react";

import ReactMapGL, { MapLayerMouseEvent, Marker, MarkerDragEvent, MapRef } from "react-map-gl";

import useSupercluster from "use-supercluster";

import { QuestsContext } from "../../context";

const MAPBOX_TOKEN = "pk.eyJ1IjoiYmFyeXl1ciIsImEiOiJjbHllbDVuY3EwM2ltMmtzYmVoMWxwNmNiIn0.luysOkvx840dZ5PRAzAmnw";

interface PointProperties {
  cluster: boolean;
  documentId?: string;
  location?: {
    lat: number;
    long: number;
  };
  timestamp?: string;
  point_count?: number;
}

export const Map = () => {
  const { quests, addQuest, deleteQuest, updateQuest } = useContext(QuestsContext);

  const [viewport, setViewport] = useState({
    latitude: 50.42668,
    longitude: 30.56304,
    zoom: 8,
  });

  const mapRef = useRef<MapRef | null>(null);

  const addQuestHandler = (event: MapLayerMouseEvent) => {
    addQuest({ location: { lat: event.lngLat.lat, long: event.lngLat.lng } });
  };

  const onMarkerDragEnd = (documentId: string, event: MarkerDragEvent) => {
    updateQuest(documentId, { lat: event.lngLat.lat, long: event.lngLat.lng });
  };

  const points = quests.map(quest => ({
    type: "Feature",
    properties: { cluster: false, documentId: quest.documentId, location: quest.location, timestamp: quest.timestamp },
    geometry: {
      type: "Point",
      coordinates: [
        quest.location.long,
        quest.location.lat,
      ]
    }
  }));
  
  const bounds = mapRef.current
    ? mapRef.current
      ?.getMap()
      .getBounds()
      .toArray()
      .flat()
    : null;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { clusters, supercluster } = useSupercluster<PointProperties>({
    points,
    bounds,
    zoom: viewport.zoom,
    options: { radius: 75, maxZoom: 20 },
  });

  return (
    <div className="map-container">
      <ReactMapGL
        {...viewport}
        onMove={(newViewport) => {
          setViewport(newViewport.viewState);
        }}
        mapboxAccessToken={MAPBOX_TOKEN}
        onClick={addQuestHandler}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        ref={mapRef}
      >
        {clusters.map((cluster, index) => {
            const [longitude, latitude] = cluster.geometry.coordinates;
            const {
              cluster: isCluster,
              point_count: pointCount
            } = cluster.properties;

            if (isCluster) {
              return (
                <Marker
                  key={`cluster-${cluster.id}`}
                  latitude={latitude}
                  longitude={longitude}
                >
                  <div
                    className="cluster-marker"
                    style={{
                      width: `${20 + (pointCount ? pointCount : 0 / points.length) * 20}px`,
                      height: `${20 + (pointCount ? pointCount : 0 / points.length) * 20}px`
                    }}
                    onClick={() => {
                      const expansionZoom = Math.min(
                        supercluster?.getClusterExpansionZoom(cluster.id as number) ?? 0,
                        20
                      );

                      setViewport({
                        ...viewport,
                        latitude,
                        longitude,
                        zoom: expansionZoom,
                        transitionInterpolator: {
                          speed: 2
                        },
                        transitionDuration: "auto"
                      });
                    }}
                  >
                    Quests: {pointCount}
                  </div>
                </Marker>
              );
            }

            return (
              <Marker
                key={`quest-${cluster.properties.documentId}`}
                latitude={latitude}
                longitude={longitude}
                draggable
                onDragEnd={(event: MarkerDragEvent) => onMarkerDragEnd(cluster.properties.documentId, event)}
              >
                <div className="marker">
                  <p>Quest {index + 1}</p>
                  <p>Latitude: <span>{cluster.properties?.location?.lat}</span></p>
                  <p>Longitude: <span>{cluster.properties?.location?.long}</span></p>
                  <p>Timestamp: <span>{cluster.properties.timestamp}</span></p>
                  <button
                    className="delete-btn"
                    onClick={(event) => {
                      event.stopPropagation();

                      deleteQuest(cluster.properties.documentId!);
                    }}
                  >
                    &#x2715;
                  </button>
                </div>
              </Marker>
        );
        })}
        </ReactMapGL>
    </div>
  );
};
