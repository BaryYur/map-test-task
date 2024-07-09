import React, { useContext, useState } from "react";

import ReactMapGL, { MapLayerMouseEvent, Marker, MarkerDragEvent } from "react-map-gl";
import { QuestsContext } from "../../context";

const MAPBOX_TOKEN = "pk.eyJ1IjoiYmFyeXl1ciIsImEiOiJjbHllbDVuY3EwM2ltMmtzYmVoMWxwNmNiIn0.luysOkvx840dZ5PRAzAmnw";

export const Map: React.FC = () => {
  const { quests, addQuest, deleteQuest, updateQuest } = useContext(QuestsContext);

  const [viewport, setViewport] = useState({
    latitude: 50.42668,
    longitude: 30.56304,
    zoom: 8,
  });

  const addQuestHandler = (event: MapLayerMouseEvent) => {
    addQuest({ location: { lat: event.lngLat.lat, long: event.lngLat.lng } });
  };

  const onMarkerDragEnd = (documentId: string, event: MarkerDragEvent) => {
    updateQuest(documentId, { lat: event.lngLat.lat, long: event.lngLat.lng });
  };

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
      >
        {quests.map((marker, index) => (
          <Marker
            key={marker.documentId}
            latitude={marker.location.lat}
            longitude={marker.location.long}
            draggable
            onDragEnd={(event: MarkerDragEvent) => onMarkerDragEnd(marker.documentId!, event)}
          >
            <div className="marker">
              <p>Quest: <span>{index + 1}</span></p>
              <p>Latitude: <span>{marker.location.lat}</span></p>
              <p>Longitude: <span>{marker.location.long}</span></p>
              <p>Timestamp: <span>{marker.timestamp}</span></p>

              <button
                className="delete-btn"
                onClick={(event) => {
                  event.stopPropagation();

                  deleteQuest(marker.documentId!);
                }}
              >
                &#x2715;
              </button>
            </div>
          </Marker>
        ))}
      </ReactMapGL>
    </div>
  );
};