import React, { Component } from "react"
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Markers,
  Marker,
} from "react-simple-maps"
import worldData from './world-50m.json'
const wrapperStyles = {
  width: "100%",
  maxWidth: 980,
  margin: "0 auto",
}

class BasicMap extends Component {

  render() {

    const markers = [
    { markerOffset: -25, name: "", coordinates: [144.9631, -37.8136] },
    { markerOffset: -25, name: "", coordinates: [114.1694, 22.3193] },
    { markerOffset: 35, name: "", coordinates: [-73.935242, 40.7128]},
    { markerOffset: 35, name: "", coordinates: [-70.6693, -33.4489] },
  ]
    return (
      <div style={wrapperStyles}>
        <ComposableMap
          projectionConfig={{
            scale: 205,
            rotation: [-11,0,0],
          }}
          width={980}
          height={551}
          style={{
            width: "100%",
            height: "225px",
          }}
          >
          <ZoomableGroup center={[0,20]} disablePanning>
            <Geographies geography={worldData}>
              {(geographies, projection) => geographies.map((geography, i) => geography.id !== "ATA" && (
                <Geography
                  key={i}
                  geography={geography}
                  projection={projection}
                  style={{
                    default: {
                      fill: "#ECEFF1",
                      stroke: "#607D8B",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                    hover: {
                      fill: "#607D8B",
                      stroke: "#607D8B",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                    pressed: {
                      fill: "#FF5722",
                      stroke: "#607D8B",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                  }}
                />
              ))}

            </Geographies>
            <Markers>
            {markers.map((marker, i) => (
              <Marker
                key={i}
                marker={marker}
                style={{
                  default: { fill: "#145388" },
                  hover: { fill: "#FFFFFF" },
                  pressed: { fill: "#FFFFFF" },
                }}
                >
                <circle
                  cx={0}
                  cy={0}
                  r={10}
                  style={{
                    stroke: "#145388",
                    strokeWidth: 4,
                    opacity: 0.9,
                  }}
                />
                <text
                  textAnchor="middle"
                  y={marker.markerOffset}
                  style={{
                    fontFamily: "Roboto, sans-serif",
                    fill: "#607D8B",
                  }}
                  >
                  {marker.name}
                </text>
              </Marker>
            ))}
            </Markers>

          </ZoomableGroup>
        </ComposableMap>
      </div>
    )
  }
}

export default BasicMap
