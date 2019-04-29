import * as faceapi from 'face-api.js'

export interface IVideoMetaData {
  duration: number,
  frames: number,
  width: number,
  height: number,
}

export interface IFace {
  id: number,
  rect: faceapi.IRect,
  landmarks: faceapi.IPoint[]
}

export interface IFrameData {
  frame: number
  faces: IFace[]
}
