export const isDev = (): boolean => {
  return process.env.NODE_ENV === 'development' || process.env.ELECTRON_IS_DEV === '1'
}

export const isMac = (): boolean => {
  return process.platform === 'darwin'
}

export const isWindows = (): boolean => {
  return process.platform === 'win32'
}

export const isLinux = (): boolean => {
  return process.platform === 'linux'
}
