import * as faceapi from 'face-api.js'

export const toIRect = (r: faceapi.IRect) => {
  return {
    x: r.x,
    y: r.y,
    width: r.width,
    height: r.height,
  }
}

export const toIPoint = (p: faceapi.IPoint) => {
  return {
    x: p.x,
    y: p.y,
  }
}
