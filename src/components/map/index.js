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

import API from 'Components/API'
class BasicMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      markers: []
    }
  }

  componentWillMount() {
    API.get('/api/nodeMap')
      .then(response => {
        const nodes = response.data.data
        const markers = []
        for(let i=0; i<nodes.length; i++) {
          if(nodes[i].location == null) continue;
          markers.push({
            markerOffset: Math.floor(Math.random()*(50-(-30)+1)+(-30)),
            name: nodes[i].location.city,
            coordinates: [nodes[i].location.ll[1], nodes[i].location.ll[0]]

          })
        }
        this.setState({markers})
      })
      .catch(console.log)
  }



  render() {

  //   const markers = [
  //   { markerOffset: -25, name: "asdasd", coordinates: [144.9631, -37.8136] },
  //   { markerOffset: -25, name: "", coordinates: [114.1694, 22.3193] },
  //   { markerOffset: 35, name: "", coordinates: [-73.935242, 40.7128]},
  //   { markerOffset: 35, name: "", coordinates: [-70.6693, -33.4489] },
  // ]

  const {markers} = this.state
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
                    strokeWidth: 6,
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
