
export const loadAsText = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      resolve(reader.result as string)
    }
    reader.onerror = reject
    reader.readAsText(file)
  })
}
