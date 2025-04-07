import { Dimensions, Platform } from "react-native"

const { width: DEVICE_SCREEN_WIDTH, height: DEVICE_SCREEN_HEIGHT } = Dimensions.get(
  Platform.select({ ios: "screen", android: "window" }),
)

const DESIGN_SCREEN_WIDTH = 1024
const DESIGN_SCREEN_HEIGHT = 1366

const widthPercent = DEVICE_SCREEN_WIDTH / DESIGN_SCREEN_WIDTH
const heightPercent = DEVICE_SCREEN_HEIGHT / DESIGN_SCREEN_HEIGHT

function getWidth(designWidth: number) {
  const result = designWidth * widthPercent
  return Number(result.toFixed(1))
}

function getHeight(designHeight: number) {
  const result = designHeight * heightPercent
  return Number(result.toFixed(1))
}

function getFont(designWidth: number) {
  const result = designWidth * widthPercent
  return Number(result.toFixed(1))
}

export const responsive = {
  getWidth,
  getHeight,
  getFont,
  WIDTH: DEVICE_SCREEN_WIDTH,
  HEIGHT: DEVICE_SCREEN_HEIGHT,
}